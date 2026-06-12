import os
import re
import json
import hashlib
import shutil
import subprocess
import sys
import time
from abc import ABC, abstractmethod
from datetime import UTC, datetime
from typing import Dict, List, Optional, Set, Tuple

try:
    import ollama
except ImportError:
    # [Orchestrator]: ollama package is optional — cloud runs use STRUCTAI_LLM_PROVIDER=claude
    ollama = None  # type: ignore[assignment]


def configure_console_encoding() -> None:
    """Windows cp1252 consoles cannot print pipeline emoji without UTF-8."""
    if sys.platform == "win32":
        for stream in (sys.stdout, sys.stderr):
            reconfigure = getattr(stream, "reconfigure", None)
            if callable(reconfigure):
                try:
                    reconfigure(encoding="utf-8", errors="replace")
                except Exception:
                    pass


configure_console_encoding()

# LLM-Backend: ollama (default) | claude (requires ANTHROPIC_API_KEY)
LLM_PROVIDER_NAME = os.getenv("STRUCTAI_LLM_PROVIDER", "ollama").strip().lower()

CODER_MODEL = os.getenv("STRUCTAI_CODER_MODEL", "qwen2.5-coder:7b")
CRITIC_MODEL = os.getenv("STRUCTAI_CRITIC_MODEL", "gemma4")
DEBUGGER_MODEL = os.getenv("STRUCTAI_DEBUGGER_MODEL", "gemma4")
ARCHITECT_MODEL = os.getenv("STRUCTAI_ARCHITECT_MODEL", "gemma4")
AUDITOR_MODEL = os.getenv("STRUCTAI_AUDITOR_MODEL", "gemma4")
TASKS_CONFIG_PATH = os.getenv("STRUCTAI_TASKS_CONFIG", "orchestrator.tasks.json")
BUILD_REPORT_PATH = os.getenv("STRUCTAI_BUILD_REPORT", "orchestrator.report.json")
CHECKPOINT_PATH = os.getenv("STRUCTAI_CHECKPOINT_PATH", "orchestrator.checkpoint.json")
STRICT_MODE = os.getenv("STRUCTAI_STRICT_MODE", "true").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
DRY_RUN = os.getenv("STRUCTAI_DRY_RUN", "false").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
GATES_ONLY = os.getenv("STRUCTAI_GATES_ONLY", "false").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
TEMPLATE_FALLBACK = os.getenv("STRUCTAI_TEMPLATE_FALLBACK", "true").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
FAST_PATH_ENABLED = os.getenv("STRUCTAI_FAST_PATH", "true").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
CONSTANTS_TEMPLATE_ALWAYS = os.getenv("STRUCTAI_CONSTANTS_TEMPLATE", "true").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
CRITIC_AUTO_PROVE_ON_STATIC = os.getenv("STRUCTAI_CRITIC_AUTO_PROVE", "true").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}
MODEL_CALL_RETRIES = int(os.getenv("STRUCTAI_MODEL_CALL_RETRIES", "3"))
MODEL_CALL_RETRY_BASE_SECONDS = float(os.getenv("STRUCTAI_MODEL_RETRY_BASE_SECONDS", "1.5"))
QUALITY_GATE_TIMEOUT_SECONDS = int(os.getenv("STRUCTAI_QUALITY_GATE_TIMEOUT_SECONDS", "300"))
CLAUDE_MAX_TOKENS = int(os.getenv("STRUCTAI_CLAUDE_MAX_TOKENS", "8192"))
# [Orchestrator]: optional Opus escalation — used for coder/debugger from this cycle on
CODER_ESCALATION_MODEL = os.getenv("STRUCTAI_CODER_ESCALATION_MODEL", "").strip()
CODER_ESCALATION_CYCLE = int(os.getenv("STRUCTAI_CODER_ESCALATION_CYCLE", "4"))

# ---------------------------------------------------------------------
# LLM PROVIDER ABSTRACTION (Ollama today, Claude-ready tomorrow)
# Env: STRUCTAI_LLM_PROVIDER=ollama|claude, ANTHROPIC_API_KEY (claude only)
# ---------------------------------------------------------------------
class LLMProvider(ABC):
    @abstractmethod
    def chat(self, model_name: str, system_prompt: str, user_prompt: str) -> str:
        raise NotImplementedError

    @abstractmethod
    def list_models(self) -> List[str]:
        raise NotImplementedError

    @property
    @abstractmethod
    def name(self) -> str:
        raise NotImplementedError


class OllamaProvider(LLMProvider):
    def __init__(self) -> None:
        if ollama is None:
            raise RuntimeError(
                "Python-Paket 'ollama' fehlt — 'pip install ollama' ausführen "
                "oder STRUCTAI_LLM_PROVIDER=claude setzen."
            )

    @property
    def name(self) -> str:
        return "ollama"

    def chat(self, model_name: str, system_prompt: str, user_prompt: str) -> str:
        last_error = "Unbekannter Fehler"
        for attempt in range(1, MODEL_CALL_RETRIES + 1):
            try:
                response = ollama.chat(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                )
                content = extract_ollama_message_text(response)
                if not content.strip():
                    raise ValueError(
                        f"Leere Modell-Antwort ({type(response).__name__})"
                    )
                return content
            except Exception as error:
                last_error = str(error)
                if attempt >= MODEL_CALL_RETRIES:
                    break
                backoff = MODEL_CALL_RETRY_BASE_SECONDS * (2 ** (attempt - 1))
                print(
                    f"  ⚠️  Modell-Call fehlgeschlagen ({model_name}, Versuch {attempt}/{MODEL_CALL_RETRIES}): {last_error}"
                )
                print(f"  ↻ Retry in {backoff:.1f}s...")
                time.sleep(backoff)
        raise RuntimeError(
            f"Modell-Call dauerhaft fehlgeschlagen ({model_name}): {last_error}"
        )

    def list_models(self) -> List[str]:
        try:
            models_response = ollama.list()
        except Exception:
            return []
        models: List[str] = []
        raw_list = None
        if isinstance(models_response, dict):
            raw_list = models_response.get("models", [])
        else:
            raw_list = getattr(models_response, "models", None)
            if raw_list is None and hasattr(models_response, "__iter__"):
                raw_list = list(models_response)
        if not isinstance(raw_list, list):
            return []
        for entry in raw_list:
            model_name: Optional[str] = None
            if isinstance(entry, dict):
                model_name = entry.get("model") or entry.get("name")
            else:
                model_name = getattr(entry, "model", None) or getattr(entry, "name", None)
            if isinstance(model_name, str) and model_name.strip():
                models.append(model_name.strip())
        return models


class ClaudeProvider(LLMProvider):
    """
    Anthropic Claude API — aktivieren via STRUCTAI_LLM_PROVIDER=claude.
    Erfordert ANTHROPIC_API_KEY. Modelle via STRUCTAI_*_MODEL env vars.
    """

    def __init__(self) -> None:
        self.api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
        if not self.api_key:
            raise RuntimeError(
                "STRUCTAI_LLM_PROVIDER=claude erfordert ANTHROPIC_API_KEY."
            )

    @property
    def name(self) -> str:
        return "claude"

    def chat(self, model_name: str, system_prompt: str, user_prompt: str) -> str:
        import urllib.error
        import urllib.request

        payload = json.dumps(
            {
                "model": model_name,
                "max_tokens": CLAUDE_MAX_TOKENS,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}],
            }
        ).encode("utf-8")
        request = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )
        last_error = "Unbekannter Fehler"
        for attempt in range(1, MODEL_CALL_RETRIES + 1):
            try:
                with urllib.request.urlopen(request, timeout=300) as response:
                    body = json.loads(response.read().decode("utf-8"))
                content_blocks = body.get("content", [])
                if not isinstance(content_blocks, list):
                    raise ValueError("Ungültige Claude-Antwortstruktur")
                text_parts = [
                    block.get("text", "")
                    for block in content_blocks
                    if isinstance(block, dict) and block.get("type") == "text"
                ]
                content = "\n".join(part for part in text_parts if isinstance(part, str))
                if not content.strip():
                    raise ValueError("Leere Claude-Antwort")
                return content
            except urllib.error.HTTPError as error:
                try:
                    error_body = error.read().decode("utf-8", errors="replace")[:500]
                except Exception:
                    error_body = ""
                last_error = f"HTTP {error.code}: {error_body or error.reason}"
                # [Orchestrator]: auth/request errors are permanent — retrying wastes budget
                if error.code in {400, 401, 403, 404}:
                    break
                if attempt >= MODEL_CALL_RETRIES:
                    break
                backoff = MODEL_CALL_RETRY_BASE_SECONDS * (2 ** (attempt - 1))
                print(
                    f"  ⚠️  Claude-Call fehlgeschlagen ({model_name}, Versuch {attempt}/{MODEL_CALL_RETRIES}): {last_error}"
                )
                print(f"  ↻ Retry in {backoff:.1f}s...")
                time.sleep(backoff)
            except (urllib.error.URLError, ValueError, json.JSONDecodeError) as error:
                last_error = str(error)
                if attempt >= MODEL_CALL_RETRIES:
                    break
                backoff = MODEL_CALL_RETRY_BASE_SECONDS * (2 ** (attempt - 1))
                print(
                    f"  ⚠️  Claude-Call fehlgeschlagen ({model_name}, Versuch {attempt}/{MODEL_CALL_RETRIES}): {last_error}"
                )
                print(f"  ↻ Retry in {backoff:.1f}s...")
                time.sleep(backoff)
        raise RuntimeError(
            f"Claude-Call dauerhaft fehlgeschlagen ({model_name}): {last_error}"
        )

    def list_models(self) -> List[str]:
        return list(
            {
                CODER_MODEL,
                CRITIC_MODEL,
                DEBUGGER_MODEL,
                ARCHITECT_MODEL,
                AUDITOR_MODEL,
            }
        )


_LLM_PROVIDER: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    global _LLM_PROVIDER
    if _LLM_PROVIDER is None:
        if LLM_PROVIDER_NAME == "claude":
            _LLM_PROVIDER = ClaudeProvider()
        else:
            _LLM_PROVIDER = OllamaProvider()
    return _LLM_PROVIDER


# ---------------------------------------------------------------------
# HILFSFUNKTIONEN
# ---------------------------------------------------------------------
def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()
 
def write_file(path, content):
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def write_file_atomic(path: str, content: str) -> None:
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)
    temp_path = f"{path}.tmp"
    with open(temp_path, "w", encoding="utf-8") as temp_file:
        temp_file.write(content)
    os.replace(temp_path, path)
 
def extract_ollama_message_text(response: object) -> str:
    """Extract assistant text from Ollama SDK dict / ChatResponse / thinking models."""
    message: object = None
    if isinstance(response, dict):
        message = response.get("message")
    else:
        message = getattr(response, "message", None)
        if message is None and hasattr(response, "model_dump"):
            dumped = response.model_dump()
            if isinstance(dumped, dict):
                message = dumped.get("message")

    def read_field(source: object, key: str) -> str:
        if isinstance(source, dict):
            value = source.get(key)
        else:
            value = getattr(source, key, None)
        return value.strip() if isinstance(value, str) else ""

    if message is None:
        return ""

    content = read_field(message, "content")
    thinking = read_field(message, "thinking")
    if content:
        return content
    if thinking:
        return thinking
    return ""


def clean_code(raw: str) -> str:
    """Entfernt Markdown-Blöcke die das LLM manchmal trotzdem ausgibt."""
    lines = raw.strip().splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    return "\n".join(lines).strip()


def extract_status(review_text: str) -> str:
    """
    Extrahiert robust STATUS aus Kritiker-/Debugger-Ausgaben.
    Erwartet 'STATUS: PROVED' oder 'STATUS: REJECTED', toleriert Formatabweichungen.
    """
    match = re.search(r"STATUS\s*:\s*(PROVED|REJECTED)", review_text, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    upper_text = review_text.upper()
    if "PROVED" in upper_text and "REJECTED" not in upper_text:
        return "PROVED"
    if "REJECTED" in upper_text:
        return "REJECTED"
    return "REJECTED"


def is_malformed_agent_status(review_text: str) -> bool:
    stripped = review_text.strip()
    if not stripped:
        return True
    if re.fullmatch(r"STATUS\s*:?\s*", stripped, re.IGNORECASE):
        return True
    if not re.search(r"STATUS\s*:\s*(PROVED|REJECTED)", stripped, re.IGNORECASE):
        return True
    return False


def resolve_critic_verdict(critic_result: str, static_checks_passed: bool) -> Tuple[str, str]:
    """Returns (status, display_text). Auto-PROVED when LLM output malformed but static is green."""
    if is_malformed_agent_status(critic_result):
        preview = critic_result.strip().replace("\n", " ")[:240]
        print(f"  ⚠️  Kritiker-Antwort unvollständig/malformed: {preview!r}")
        if static_checks_passed and CRITIC_AUTO_PROVE_ON_STATIC:
            escalated = (
                "STATUS: PROVED\n"
                "BEGRÜNDUNG: Auto-Eskalation — Static Checks grün, Kritiker-Output malformed."
            )
            print("  ✅ Static Checks grün → Kritiker-Eskalation auf PROVED.")
            return "PROVED", escalated
        return "REJECTED", critic_result
    return extract_status(critic_result), critic_result


def normalize_review_text(review_text: str) -> str:
    """
    Schneidet Rauschen nach dem ersten STATUS/BEGRÜNDUNG-Block ab,
    damit Parser und Feedback-Loop deterministisch bleiben.
    """
    lines = [line.rstrip() for line in review_text.strip().splitlines()]
    if not lines:
        return review_text.strip()
    status_index = -1
    status_line_pattern = re.compile(
        r"^\s*STATUS\s*:\s*(PROVED|REJECTED)\b", re.IGNORECASE
    )
    begruendung_pattern = re.compile(r"^\s*BEGR[ÜU]?NDUNG\s*:", re.IGNORECASE)
    for idx, line in enumerate(lines):
        if status_line_pattern.match(line):
            status_index = idx
            break
    if status_index == -1:
        return review_text.strip()

    selected: List[str] = [lines[status_index]]
    begruendung_added = False
    for idx in range(status_index + 1, len(lines)):
        current = lines[idx]
        if status_line_pattern.match(current):
            break
        if not begruendung_added and begruendung_pattern.match(current):
            selected.append(current)
            begruendung_added = True
            continue
        if begruendung_added:
            if current.strip() == "":
                break
            if current.strip().startswith("***"):
                break
            if current.strip().startswith("**"):
                break
            selected.append(current)
    normalized = "\n".join(selected).strip()
    if is_malformed_agent_status(normalized):
        return review_text.strip()
    return normalized


def extract_begruendung(review_text: str) -> str:
    normalized = normalize_review_text(review_text)
    match = re.search(r"BEGRÜNDUNG\s*:\s*(.*)$", normalized, re.IGNORECASE | re.DOTALL)
    if not match:
        return ""
    return match.group(1).strip()


def is_subjective_rejection(begruendung: str) -> bool:
    """
    Erkennt weiche/spekulative Auditor-Kritik ohne harte Regelverletzung.
    Diese soll keine Endlosschleifen verursachen.
    """
    lower = begruendung.lower()
    hard_signals = [
        "any",
        "todo",
        "try-catch",
        "validateStoreLogic".lower(),
        "default export".lower(),
        "import",
        "fsd",
        "fehlende",
        "verboten",
        "regel",
    ]
    if any(signal in lower for signal in hard_signals):
        return False
    subjective_signals = [
        "over-engineering",
        "wiederverwendbarkeit",
        "zu komplex",
        "könnte",
        "potenziell",
        "theoretisch",
        "style-kopplung",
        "wartbarkeit",
    ]
    return any(signal in lower for signal in subjective_signals)


def call_local_model(model_name: str, system_prompt: str, user_prompt: str) -> str:
    return get_llm_provider().chat(model_name, system_prompt, user_prompt)


def infer_file_category(file_path: str) -> str:
    normalized = file_path.replace("\\", "/").lower()
    if normalized.endswith("/types.ts") or "/theme/" in normalized:
        return "constants"
    if normalized.endswith("/store.ts"):
        return "store"
    if "/app/" in normalized and normalized.endswith("/_layout.tsx"):
        return "layout"
    if "/app/" in normalized and normalized.endswith(".tsx"):
        return "screen"
    if "/api/" in normalized or "/processes/" in normalized or "/backend/" in normalized:
        return "store"
    return "component"


CATEGORY_RULES: Dict[str, List[str]] = {
    "constants": [
        "1. FSD-Architektur & Imports (erlaubt)",
        "5. Library-Whitelist (erlaubt)",
        "6a. Keine Platzhalter/TODOs (erlaubt)",
        "6b. Strikte TypeScript-Typisierung, as const korrekt (erlaubt)",
        "NICHT prüfen: Navigation, Performance, SwiftUI, try-catch, validateStoreLogic",
    ],
    "store": [
        "1. FSD-Architektur & Imports (erlaubt)",
        "3. Performance / Zustand-Selektoren (erlaubt)",
        "5. Library-Whitelist (erlaubt)",
        "6a. Keine Platzhalter/TODOs (erlaubt)",
        "6b. Strikte TypeScript-Typisierung (erlaubt)",
        "6c. Try-Catch bei async/API (erlaubt)",
        "6d. validateStoreLogic() Funktion — NUR in */model/store.ts (erlaubt)",
        "NICHT prüfen: Navigation, SwiftUI Look & Feel",
    ],
    "component": [
        "1. FSD-Architektur & Imports (erlaubt)",
        "3. Performance / FlatList / useMemo (erlaubt)",
        "4. SwiftUI Look & Feel, Glassmorphismus, Dark Mode (erlaubt)",
        "5. Library-Whitelist (erlaubt)",
        "6a. Keine Platzhalter/TODOs (erlaubt)",
        "6b. Strikte TypeScript-Typisierung, export interface Props (erlaubt)",
        "6c. Try-Catch bei async/API (erlaubt)",
        "NICHT prüfen: Navigation, validateStoreLogic",
    ],
    "screen": [
        "1. FSD-Architektur & Imports (erlaubt)",
        "2. Navigation & Routing (erlaubt)",
        "3. Performance / FlatList / useMemo (erlaubt)",
        "4. SwiftUI Look & Feel, Dark Mode (erlaubt)",
        "5. Library-Whitelist (erlaubt)",
        "6a. Keine Platzhalter/TODOs (erlaubt)",
        "6b. Strikte TypeScript-Typisierung, Default Export (erlaubt)",
        "6c. Try-Catch bei async/API (erlaubt)",
        "NICHT prüfen: validateStoreLogic",
    ],
    "layout": [
        "1. FSD-Architektur & Imports (erlaubt)",
        "2. Navigation & Routing (erlaubt)",
        "4. SwiftUI Look & Feel (erlaubt)",
        "5. Library-Whitelist (erlaubt)",
        "6a. Keine Platzhalter/TODOs (erlaubt)",
        "6b. Strikte TypeScript-Typisierung, Default Export (erlaubt)",
        "6c. Try-Catch bei async/API (erlaubt)",
        "NICHT prüfen: Performance/FlatList, validateStoreLogic",
    ],
}

CODER_FOCUS_RULES: Dict[str, str] = {
    "constants": (
        "DEINE AUFGABE IST EINE 'constants'-DATEI. Exakte Regeln:\n"
        "- NUR reine TypeScript-Konstanten — KEIN React, KEIN JSX, KEINE Komponenten.\n"
        "- KEIN import aus 'react', 'react-native' oder anderen UI-Paketen.\n"
        "- export const NAME = {...} as const;\n"
        "- export type TypeName = typeof NAME; (niemals bare Typ-Name)\n"
        "- Kein 'any', keine TODOs, keine Funktionen, keine Logik.\n"
        "- Kein export default. Nur Named Exports.\n"
        "- Keine @/-Imports. Kein validateStoreLogic().\n"
        "- Kollisionsverbot: 'export const theme' + 'export type Theme' ist OK. "
        "  'export const Theme' + 'export type Theme' ist verboten."
    ),
    "store": (
        "DEINE AUFGABE IST EINE 'store'-DATEI. Exakte Regeln:\n"
        "- Zustand mit persist-Middleware (AsyncStorage), Named Export.\n"
        "- Kein 'any'. Immer GamificationStore-Interface importieren.\n"
        "- Jede async Funktion in try-catch.\n"
        "- validateStoreLogic() exportieren (NUR in */model/store.ts).\n"
        "- Kein SwiftUI, kein JSX, keine React-Komponenten."
    ),
    "component": (
        "DEINE AUFGABE IST EINE 'component'-DATEI. Exakte Regeln:\n"
        "- export interface ComponentNameProps { ... } — zwingend.\n"
        "- Named Export (kein default export).\n"
        "- Farben NUR via theme.colors.*, keine Hex/rgba direkt.\n"
        "- Scale 0.97 bei Pressable via Animated oder reanimated.\n"
        "- borderRadius 16–24 für alle Karten/Buttons.\n"
        "- Kein 'any'. Kein TODO. Try-catch wenn async."
    ),
    "screen": (
        "DEINE AUFGABE IST EIN 'screen'-FILE. Exakte Regeln:\n"
        "- export default function ScreenName() — Pflicht.\n"
        "- Kein State in URL-Params. Nur primitive IDs.\n"
        "- FlatList statt ScrollView für Listen.\n"
        "- Farben NUR via theme.colors.*, keine Hex/rgba direkt.\n"
        "- Alle async in try-catch.\n"
        "- Kein 'any', kein TODO."
    ),
    "layout": (
        "DEINE AUFGABE IST EIN 'layout'-FILE. Exakte Regeln:\n"
        "- export default function Layout() — Pflicht.\n"
        "- Nutze Stack/Tabs/Link aus expo-router, keinen manuellen Navigator.\n"
        "- Farben NUR via theme.colors.*, keine Hex/rgba direkt.\n"
        "- Dark Mode First: Hintergrund aus theme.colors.background.*\n"
        "- Alle async in try-catch."
    ),
}


def _build_critic_rule_context(file_path: str) -> str:
    category = infer_file_category(file_path)
    rules = CATEGORY_RULES.get(category, CATEGORY_RULES["component"])
    rule_lines = "\n".join(f"  - {r}" for r in rules)
    return (
        f"DATEI-KATEGORIE: '{category}'\n"
        f"ANZUWENDENDE REGELN (nur diese, keine anderen):\n{rule_lines}"
    )


def _build_coder_focus_rules(file_path: str) -> str:
    category = infer_file_category(file_path)
    return CODER_FOCUS_RULES.get(category, CODER_FOCUS_RULES["component"])


THEME_CONST_SYMBOLS = frozenset({"AppColors", "AppTypography", "theme"})

TS_BUILTIN_TYPE_NAMES = frozenset(
    {
        "Array",
        "Record",
        "Partial",
        "Required",
        "Readonly",
        "Pick",
        "Omit",
        "Extract",
        "Exclude",
        "NonNullable",
        "Parameters",
        "ReturnType",
        "InstanceType",
        "Promise",
        "Date",
        "RegExp",
        "Error",
        "Map",
        "Set",
        "WeakMap",
        "WeakSet",
        "Object",
        "Function",
        "String",
        "Number",
        "Boolean",
        "Symbol",
        "BigInt",
        "Intl",
        "React",
        "JSX",
        "ViewStyle",
        "TextStyle",
        "ImageStyle",
        "StyleProp",
    }
)


def _strip_line_comment(line: str) -> str:
    in_single = False
    in_double = False
    for idx, char in enumerate(line):
        if char == "'" and not in_double:
            in_single = not in_single
        elif char == '"' and not in_single:
            in_double = not in_double
        elif char == "/" and idx + 1 < len(line) and line[idx + 1] == "/" and not in_single and not in_double:
            return line[:idx]
    return line


def _collect_value_only_symbols(code: str) -> Set[str]:
    """Identifiers imported or defined as runtime values (not type-only imports)."""
    symbols: Set[str] = set()
    for match in re.finditer(
        r"import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+['\"][^'\"]+['\"]",
        code,
    ):
        full_match = match.group(0)
        if full_match.startswith("import type "):
            continue
        default_name = match.group(2)
        if default_name:
            symbols.add(default_name)
            continue
        names_clause = match.group(1) or ""
        for part in names_clause.split(","):
            token = part.strip()
            if not token:
                continue
            if re.match(r"^type\s+\w+", token):
                continue
            alias_match = re.match(r"^(\w+)(?:\s+as\s+(\w+))?$", token)
            if alias_match:
                symbols.add(alias_match.group(2) or alias_match.group(1))
    for match in re.finditer(r"export\s+const\s+(\w+)", code):
        symbols.add(match.group(1))
    for match in re.finditer(r"^\s*const\s+(\w+)\s*=", code, re.MULTILINE):
        symbols.add(match.group(1))
    return symbols


def _line_at_index(code: str, index: int) -> str:
    line_start = code.rfind("\n", 0, index) + 1
    line_end = code.find("\n", index)
    if line_end == -1:
        line_end = len(code)
    return code[line_start:line_end]


def _is_object_literal_property_value_line(line: str, symbol: str) -> bool:
    """Erlaubt `colors: AppColors` als Wert-Zuweisung im const-Objekt."""
    stripped = line.strip()
    return bool(re.match(rf"^[A-Za-z_][\w]*\s*:\s*{symbol}\s*,?\s*$", stripped))


def _is_type_context_before(code: str, index: int) -> bool:
    line = _line_at_index(code, index)
    symbol_match = re.search(r"\b([A-Z][A-Za-z0-9_]*)\b", code[index : index + 40])
    if symbol_match and _is_object_literal_property_value_line(
        line, symbol_match.group(1)
    ):
        return False
    before = code[max(0, index - 32) : index]
    return bool(
        re.search(r"(:\s*|[<,|&]\s*|extends\s+|implements\s+)$", before)
        or re.search(r"export\s+type\s+\w+\s*=\s*$", before)
        or re.search(r"\binterface\s+\w+", line)
        or re.search(r"export\s+type\s+\w+\s*=\s*\{", line)
    )


def _check_const_used_as_type(code: str, file_path: str) -> List[str]:
    """Reject using const/theme values as bare type annotations (ts2749)."""
    issues: List[str] = []
    value_symbols = _collect_value_only_symbols(code)
    normalized_path = file_path.replace("\\", "/")

    for line_number, raw_line in enumerate(code.splitlines(), start=1):
        line = _strip_line_comment(raw_line)
        for symbol in THEME_CONST_SYMBOLS:
            for match in re.finditer(rf"\b{symbol}\b", line):
                if match.start() > 0 and line[match.start() - 1] == ".":
                    continue
                prefix = line[: match.start()]
                if re.search(r"\btypeof\s+$", prefix):
                    continue
                if _is_object_literal_property_value_line(line, symbol):
                    continue
                if re.search(rf":\s*{symbol}\b", line) or re.search(
                    rf"<\s*{symbol}\s*>", line
                ):
                    issues.append(
                        f"Zeile {line_number}: '{symbol}' ist ein const-Wert, kein Typ — "
                        f"verwende 'typeof {symbol}' in Typannotationen."
                    )
                    break

        for match in re.finditer(r":\s*(?!typeof\s)([A-Z][A-Za-z0-9_]*)\b", line):
            ident = match.group(1)
            if ident in TS_BUILTIN_TYPE_NAMES:
                continue
            if _is_object_literal_property_value_line(line, ident):
                continue
            if ident in value_symbols or (
                ident in THEME_CONST_SYMBOLS
                and normalized_path.startswith("src/shared/theme/")
            ):
                issues.append(
                    f"Zeile {line_number}: '{ident}' ist vermutlich ein const-Wert "
                    f"(value-import/const export) — Typannotationen brauchen 'typeof {ident}'."
                )

        for match in re.finditer(r"<\s*(?!typeof\s)([A-Z][A-Za-z0-9_]*)\b", line):
            ident = match.group(1)
            if ident in TS_BUILTIN_TYPE_NAMES:
                continue
            if ident in value_symbols:
                issues.append(
                    f"Zeile {line_number}: Generics dürfen '{ident}' nicht als Typ nutzen — "
                    f"verwende 'typeof {ident}' wenn es ein const-Wert ist."
                )

    for match in re.finditer(r"(?<!typeof\s)\b(AppColors|AppTypography)\b", code):
        symbol = match.group(1)
        line = _line_at_index(code, match.start())
        if re.search(r"export\s*\{", line):
            continue
        if _is_object_literal_property_value_line(line, symbol):
            continue
        if not _is_type_context_before(code, match.start()):
            continue
        line_number = code.count("\n", 0, match.start()) + 1
        message = (
            f"Zeile {line_number}: '{symbol}' als Typ ohne 'typeof' erkannt "
            f"(z.B. ': {symbol}' oder '<{symbol}>')."
        )
        if message not in issues:
            issues.append(message)

    return issues


def _resolve_relative_import(base_file: str, spec: str) -> bool:
    base_dir = os.path.dirname(base_file) or "."
    resolved = os.path.normpath(os.path.join(base_dir, spec))
    candidates = [
        resolved,
        f"{resolved}.ts",
        f"{resolved}.tsx",
        os.path.join(resolved, "index.ts"),
        os.path.join(resolved, "index.tsx"),
    ]
    return any(os.path.isfile(candidate) for candidate in candidates)


def _check_import_paths(code: str, file_path: str) -> List[str]:
    issues: List[str] = []
    normalized_code = code.replace("\\", "/")
    if "/theme/tokens" in normalized_code or "theme/tokens" in normalized_code:
        issues.append(
            "Falscher Theme-Import: Datei 'tokens' existiert nicht — nutze '../theme' bzw. './index'."
        )
    for match in re.finditer(r"from\s+['\"]([^'\"]+)['\"]", code):
        spec = match.group(1).strip()
        if spec.startswith("@/"):
            issues.append(
                f"Alias-Import '{spec}' ist verboten — nur relative Imports oder npm-Pakete verwenden."
            )
            continue
        if not spec.startswith("."):
            continue
        if not _resolve_relative_import(file_path, spec):
            issues.append(f"Import-Ziel existiert nicht: '{spec}' (relativ zu {file_path}).")
    return issues


THEME_ACCESS_PATHS = {
    "colors.background.primary",
    "colors.background.secondary",
    "colors.background.card",
    "colors.border.subtle",
    "colors.text.primary",
    "colors.text.secondary",
    "colors.text.muted",
    "colors.accent.everyday",
    "colors.accent.code",
    "colors.accent.visual",
    "colors.feedback.success",
    "colors.feedback.warning",
    "colors.feedback.danger",
    "typography.fontSize.xs",
    "typography.fontSize.sm",
    "typography.fontSize.md",
    "typography.fontSize.lg",
    "typography.fontSize.xl",
    "typography.fontSize.xxl",
    "typography.fontSize.display",
    "typography.fontWeight.regular",
    "typography.fontWeight.medium",
    "typography.fontWeight.semibold",
    "typography.fontWeight.bold",
}


def _check_theme_access_paths(code: str, file_path: str) -> List[str]:
    issues: List[str] = []
    normalized_path = file_path.replace("\\", "/")
    if not normalized_path.startswith("src/") or "/shared/theme/" in normalized_path:
        return issues
    for match in re.finditer(r"theme\.((?:colors|typography)(?:\.[A-Za-z0-9_]+)+)", code):
        access_path = match.group(1)
        if access_path not in THEME_ACCESS_PATHS:
            issues.append(
                f"Unbekannter Theme-Pfad 'theme.{access_path}' — nur definierte Tokens nutzen."
            )
    return issues


def _check_component_contract(code: str, file_path: str, category: str) -> List[str]:
    issues: List[str] = []
    if category != "component" or not file_path.endswith(".tsx"):
        return issues
    if not re.search(r"export\s+interface\s+\w+Props\b", code):
        issues.append("Component-Regel: export interface ...Props fehlt.")
    if "theme." in code and not re.search(
        r"from\s+['\"]\.\./theme['\"]|from\s+['\"]\./index['\"]|from\s+['\"]src/shared/theme",
        code,
    ):
        if re.search(r"theme\.", code) and "/shared/theme/" not in file_path.replace("\\", "/"):
            issues.append(
                "Theme-Nutzung ohne gültigen Theme-Import (erwartet z.B. \"from '../theme'\")."
            )
    return issues


def _check_export_name_collisions(code: str) -> List[str]:
    issues: List[str] = []
    const_exports = {m.group(1) for m in re.finditer(r"export\s+const\s+(\w+)", code)}
    type_exports = {m.group(1) for m in re.finditer(r"export\s+type\s+(\w+)", code)}
    interface_exports = {
        m.group(1) for m in re.finditer(r"export\s+interface\s+(\w+)", code)
    }
    collisions = const_exports & (type_exports | interface_exports)
    for name in sorted(collisions):
        issues.append(
            f"Name-Kollision: 'export const {name}' und 'export type/interface {name}' "
            f"im selben Modul — const und Typ müssen unterschiedliche Namen haben "
            f"(z.B. const theme + type Theme)."
        )
    if "Theme" in const_exports and "Theme" in type_exports:
        issues.append(
            "Name-Kollision: 'export const Theme' und 'export type Theme' — "
            "verwende z.B. 'export const theme' und 'export type Theme = typeof theme'."
        )
    return issues


def run_static_checks(code: str, file_path: str) -> List[str]:
    issues: List[str] = []
    lowered = code.lower()
    category = infer_file_category(file_path)
    normalized_path = file_path.replace("\\", "/")

    if "```" in code:
        issues.append("Markdown-Codeblöcke sind im Output verboten.")
    if re.search(r"\bany\b", code):
        issues.append("TypeScript-Regel verletzt: 'any' gefunden.")
    if "todo" in lowered:
        issues.append("TODO/Platzhalter gefunden.")
    if re.search(r"from\s+['\"]\.\./\.\./\.\./", code):
        issues.append("Import-Gesetz verletzt: '../../../' Pfad erkannt.")
    if (
        "/features/" in normalized_path
        and "/features/" in code
        and re.search(r"from\s+['\"][^'\"]*features/[^'\"]*['\"]", code)
    ):
        issues.append("Möglicher Cross-Feature-Import erkannt. Prüfen und vermeiden.")

    # Design-Token-Schutz: Keine direkten Hex-Farben außerhalb des Theme-Layers.
    # Erlaubt nur in src/shared/theme/*, damit SwiftUI-like Konsistenz zentral steuerbar bleibt.
    is_theme_file = normalized_path.startswith("src/shared/theme/")
    is_app_code_file = normalized_path.startswith("src/") and (
        normalized_path.endswith(".ts") or normalized_path.endswith(".tsx")
    )
    if is_app_code_file and not is_theme_file:
        if re.search(r"#[0-9a-fA-F]{3,8}\b", code):
            issues.append(
                "Design-Token-Regel verletzt: Direkte Hex-Farben außerhalb src/shared/theme/* gefunden."
            )
        if re.search(r"rgba\s*\(", code, re.IGNORECASE):
            issues.append(
                "Design-Token-Regel verletzt: Direkte rgba()-Farben außerhalb src/shared/theme/* gefunden."
            )

    if category in {"screen", "layout"} and "export default" not in code:
        issues.append("Screen/Layout benötigt Default Export.")
    normalized_path_for_store = file_path.replace("\\", "/")
    is_actual_store = normalized_path_for_store.endswith("/store.ts")
    if category == "store" and is_actual_store and "validateStoreLogic" not in code:
        issues.append("Store-Regel verletzt: validateStoreLogic() fehlt.")
    if category in {"store", "component", "screen", "layout"}:
        has_async = "async " in code or "fetch(" in code
        has_try_catch = "try" in lowered and "catch" in lowered
        if has_async and not has_try_catch:
            issues.append("Async/API ohne try-catch erkannt.")

    if category == "constants":
        if re.search(r"from\s+['\"]react", code, re.IGNORECASE):
            issues.append("constants-Datei: React-Import verboten.")
        if re.search(r"from\s+['\"]react-native", code, re.IGNORECASE):
            issues.append("constants-Datei: react-native-Import verboten.")
        if "<" in code and ">" in code and "typeof" not in code:
            issues.append("constants-Datei: JSX/Komponenten-Syntax verboten.")

    issues.extend(_check_import_paths(code, file_path))
    issues.extend(_check_theme_access_paths(code, file_path))
    issues.extend(_check_component_contract(code, file_path, category))
    issues.extend(_check_const_used_as_type(code, file_path))
    issues.extend(_check_export_name_collisions(code))

    return issues


def normalize_path(path: str) -> str:
    return path.replace("\\", "/").strip()


def get_execution_priority(file_path: str) -> Tuple[int, int]:
    normalized = normalize_path(file_path).lower()
    if "/shared/theme/" in normalized:
        return (0, 0)
    if "/shared/ui/" in normalized:
        return (0, 1)
    if "/features/" in normalized and "/model/" in normalized:
        return (1, 0)
    if "/features/" in normalized and "/api/" in normalized:
        return (1, 1)
    if "/app/" in normalized and "_layout.tsx" in normalized:
        return (2, 0)
    if "/app/" in normalized:
        return (2, 1)
    if "/backend/" in normalized or "/server/" in normalized:
        return (3, 0)
    return (4, 0)


def validate_task_dependencies(tasks: List[Dict[str, object]]) -> List[str]:
    issues: List[str] = []
    known_paths: Set[str] = set()
    for task in tasks:
        path_value = task.get("path")
        if isinstance(path_value, str):
            normalized = normalize_path(path_value)
            if normalized in known_paths:
                issues.append(f"Doppelte Task-Path erkannt: {normalized}")
            known_paths.add(normalized)

    for task in tasks:
        path_value = task.get("path")
        if not isinstance(path_value, str):
            continue
        normalized_path = normalize_path(path_value)
        dependencies = task.get("depends_on", [])
        if not isinstance(dependencies, list):
            issues.append(f"depends_on muss Liste sein: {normalized_path}")
            continue
        for dependency in dependencies:
            if not isinstance(dependency, str) or not dependency.strip():
                issues.append(f"Leere/ungültige Dependency in Task: {normalized_path}")
                continue
            normalized_dependency = normalize_path(dependency)
            if normalized_dependency not in known_paths:
                issues.append(
                    f"Fehlende Dependency-Task: {normalized_path} -> {normalized_dependency}"
                )
    return issues


def sort_task_queue(tasks: List[Dict[str, object]]) -> List[Dict[str, object]]:
    """
    Topological Sort über depends_on.
    Bei gleicher Abhängigkeitstiefe greift Frontend-first Priorität.
    """
    tasks_by_path: Dict[str, Dict[str, object]] = {}
    indegree: Dict[str, int] = {}
    adjacency: Dict[str, List[str]] = {}

    for task in tasks:
        path_value = task.get("path")
        if not isinstance(path_value, str):
            continue
        path_key = normalize_path(path_value)
        tasks_by_path[path_key] = task
        indegree[path_key] = 0
        adjacency[path_key] = []

    for path_key, task in tasks_by_path.items():
        dependencies = task.get("depends_on", [])
        if not isinstance(dependencies, list):
            continue
        for dependency in dependencies:
            if not isinstance(dependency, str):
                continue
            dep_key = normalize_path(dependency)
            if dep_key not in tasks_by_path:
                continue
            adjacency[dep_key].append(path_key)
            indegree[path_key] += 1

    ready = [
        path for path, degree in indegree.items() if degree == 0
    ]
    ready.sort(
        key=lambda path: (
            get_execution_priority(path),
            str(tasks_by_path[path].get("phase", "")),
            path,
        )
    )

    ordered_paths: List[str] = []
    while ready:
        current = ready.pop(0)
        ordered_paths.append(current)
        for dependent in adjacency.get(current, []):
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                ready.append(dependent)
                ready.sort(
                    key=lambda path: (
                        get_execution_priority(path),
                        str(tasks_by_path[path].get("phase", "")),
                        path,
                    )
                )

    if len(ordered_paths) != len(tasks_by_path):
        unresolved = [path for path, degree in indegree.items() if degree > 0]
        print("⚠️  Zyklische oder unauflösbare Abhängigkeiten erkannt:")
        for path in unresolved:
            print(f"   - {path}")
        # Fallback: stabile Prioritäts-Sortierung
        fallback = sorted(
            tasks_by_path.values(),
            key=lambda task: (
                get_execution_priority(str(task.get("path", ""))),
                str(task.get("phase", "")),
                str(task.get("path", "")),
            ),
        )
        return fallback

    return [tasks_by_path[path] for path in ordered_paths]


def detect_local_models() -> List[str]:
    return get_llm_provider().list_models()


def is_model_available(required_model: str, available_models: List[str]) -> bool:
    required = required_model.strip().lower()
    for available in available_models:
        candidate = available.strip().lower()
        if candidate == required:
            return True
        if candidate.startswith(required + ":"):
            return True
        if required.startswith(candidate + ":"):
            return True
    return False


def resolve_command(command: List[str]) -> List[str]:
    """Resolve npm/npx to .cmd shims on Windows for subprocess without shell."""
    if not command:
        return command
    if sys.platform != "win32":
        return command
    executable = command[0].lower()
    if executable in {"npm", "npx", "node"}:
        resolved = shutil.which(f"{executable}.cmd") or shutil.which(executable)
        if resolved:
            return [resolved, *command[1:]]
    return command


def command_exists(command_name: str) -> bool:
    if shutil.which(command_name) is not None:
        return True
    if sys.platform == "win32":
        return shutil.which(f"{command_name}.cmd") is not None
    return False


def run_command(command: List[str], cwd: str) -> Tuple[bool, str]:
    resolved_command = resolve_command(command)
    try:
        completed = subprocess.run(
            resolved_command,
            cwd=cwd,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=QUALITY_GATE_TIMEOUT_SECONDS,
            shell=False,
        )
        output = f"{completed.stdout}\n{completed.stderr}".strip()
        return completed.returncode == 0, output
    except subprocess.TimeoutExpired as timeout_error:
        return (
            False,
            (
                f"Command-Timeout nach {QUALITY_GATE_TIMEOUT_SECONDS}s: "
                f"{' '.join(command)}\n{str(timeout_error)}"
            ),
        )
    except Exception as error:
        return False, str(error)


PIPELINE_PROGRESS_WIDTH = int(os.getenv("STRUCTAI_PROGRESS_WIDTH", "28"))


def format_eta(seconds: float) -> str:
    if seconds < 0 or not (seconds < float("inf")):
        return "?"
    total_seconds = int(seconds)
    hours, remainder = divmod(total_seconds, 3600)
    minutes, secs = divmod(remainder, 60)
    if hours > 0:
        return f"{hours}h {minutes}m"
    if minutes > 0:
        return f"{minutes}m {secs}s"
    return f"{secs}s"


def estimate_pipeline_duration(
    total_tasks: int,
    *,
    fast_path: bool,
    resume_skip: int,
    dry_run: bool,
) -> str:
    remaining = max(total_tasks - resume_skip, 0)
    if dry_run:
        return "~1–3 Min (Dry-Run + Quality Gates)"
    if remaining == 0:
        return "~2–5 Min (Checkpoint vollständig, nur Quality Gates)"
    if fast_path:
        low = max(5, remaining * 1)
        high = max(10, remaining * 5)
        return f"~{low}–{high} Min (Fast-Path/Templates, {remaining} offene Tasks)"
    low = max(30, remaining * 10)
    high = max(60, remaining * 40)
    return (
        f"~{low}–{high} Min volle LLM-Pipeline ({remaining} Tasks, "
        "hardwareabhängig — qwen2.5-coder:7b typisch 3–10 Min pro Datei)"
    )


class PipelineProgress:
    def __init__(self, total: int) -> None:
        self.total = max(total, 1)
        self.processed = 0
        self.started_at = time.time()

    def advance(self, path: str, status: str) -> None:
        self.processed = min(self.processed + 1, self.total)
        elapsed = time.time() - self.started_at
        pct = (self.processed / self.total) * 100.0
        filled = int(PIPELINE_PROGRESS_WIDTH * self.processed / self.total)
        bar = "█" * filled + "░" * (PIPELINE_PROGRESS_WIDTH - filled)
        remaining_tasks = self.total - self.processed
        if self.processed > 0 and remaining_tasks > 0:
            eta = format_eta((elapsed / self.processed) * remaining_tasks)
        elif remaining_tasks == 0:
            eta = "0s"
        else:
            eta = "…"
        print(
            f"\n  📊 [{bar}] {pct:5.1f}% "
            f"({self.processed}/{self.total}) "
            f"ETA ~{eta} | {status}\n"
            f"      → {path}"
        )

    def active(self, path: str, detail: str) -> None:
        elapsed = time.time() - self.started_at
        pct = (self.processed / self.total) * 100.0
        filled = int(PIPELINE_PROGRESS_WIDTH * self.processed / self.total)
        bar = "█" * filled + "░" * (PIPELINE_PROGRESS_WIDTH - filled)
        print(
            f"  ⏳ [{bar}] {pct:5.1f}% ({self.processed}/{self.total}) "
            f"{detail} | {path} | elapsed {format_eta(elapsed)}"
        )


_pipeline_progress: Optional[PipelineProgress] = None


def set_pipeline_progress(progress: Optional[PipelineProgress]) -> None:
    global _pipeline_progress
    _pipeline_progress = progress


def get_pipeline_progress() -> Optional[PipelineProgress]:
    return _pipeline_progress


STUB_GATE_MARKERS = (
    "echo lint skipped",
    "echo test skipped",
    "lint skipped",
    "test skipped",
)


def is_stub_gate_output(output: str) -> bool:
    normalized = output.strip().lower()
    return any(marker in normalized for marker in STUB_GATE_MARKERS)


def run_quality_gates(cwd: str) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    package_json_path = os.path.join(cwd, "package.json")
    if not os.path.exists(package_json_path):
        return results

    gate_commands = [
        ("Typecheck", ["npm", "run", "typecheck"]),
        ("Lint", ["npm", "run", "lint"]),
        ("Test", ["npm", "run", "test"]),
    ]
    for gate_name, command in gate_commands:
        if not command_exists(command[0]):
            results.append(
                {
                    "gate": gate_name,
                    "status": "SKIPPED",
                    "reason": f"Command '{command[0]}' nicht gefunden.",
                }
            )
            continue
        ok, output = run_command(command, cwd)
        status = "PROVED" if ok else "REJECTED"
        if ok and is_stub_gate_output(output):
            status = "REJECTED"
            output = f"Stub-Script erkannt (kein echter Gate-Lauf): {output[-500:]}"
        results.append(
            {
                "gate": gate_name,
                "status": status,
                "output": output[-2000:],
            }
        )

    expo_gate = run_expo_doctor_gate(cwd)
    results.append(expo_gate)
    return results


def run_expo_doctor_gate(cwd: str) -> Dict[str, str]:
    gate_name = "Expo Doctor"
    if not command_exists("npx"):
        return {
            "gate": gate_name,
            "status": "SKIPPED",
            "reason": "Command 'npx' nicht gefunden.",
        }

    for command in (["npx", "expo-doctor"], ["npx", "expo", "doctor"]):
        ok, output = run_command(command, cwd)
        if ok:
            return {"gate": gate_name, "status": "PROVED", "output": output[-2000:]}

    return {
        "gate": gate_name,
        "status": "REJECTED",
        "output": output[-2000:] if output else "Expo Doctor fehlgeschlagen.",
    }


def get_task_paths(tasks: List[Dict[str, object]]) -> List[str]:
    paths: List[str] = []
    for task in tasks:
        path = task.get("path")
        if isinstance(path, str) and path.strip():
            paths.append(normalize_path(path))
    return sorted(set(paths))


def get_disk_task_files(task_paths: List[str]) -> List[str]:
    return sorted(path for path in task_paths if os.path.exists(path))


def compute_triple_consistency(
    task_paths: List[str],
    checkpoint_completed: List[str],
    report_succeeded: List[str],
) -> Dict[str, object]:
    disk_files = get_disk_task_files(task_paths)
    disk_set = set(disk_files)
    checkpoint_set = {
        normalize_path(path)
        for path in checkpoint_completed
        if isinstance(path, str) and path.strip()
    }
    report_set = {
        normalize_path(path)
        for path in report_succeeded
        if isinstance(path, str) and path.strip()
    }
    task_set = set(task_paths)
    consistent = (
        disk_set == checkpoint_set == report_set
        and disk_set == task_set
        and len(task_set) > 0
    )
    return {
        "disk_count": len(disk_set),
        "checkpoint_count": len(checkpoint_set),
        "report_count_succeeded": len(report_set),
        "tasks_total": len(task_set),
        "consistent": consistent,
        "disk_only": sorted(disk_set - checkpoint_set),
        "checkpoint_only": sorted(checkpoint_set - disk_set),
        "report_only": sorted(report_set - checkpoint_set),
    }


def verify_report_gate_honesty() -> List[str]:
    issues: List[str] = []
    if not os.path.exists(BUILD_REPORT_PATH):
        return issues
    try:
        report = json.loads(read_file(BUILD_REPORT_PATH))
    except Exception as error:
        return [f"orchestrator.report.json unlesbar: {error}"]
    if not isinstance(report, dict):
        return ["orchestrator.report.json hat ungültiges Format."]

    gates = report.get("quality_gates", [])
    if isinstance(gates, list):
        for gate in gates:
            if not isinstance(gate, dict):
                continue
            gate_name = gate.get("gate", "Unknown")
            status = gate.get("status", "")
            output = str(gate.get("output", ""))
            if status == "PROVED" and is_stub_gate_output(output):
                issues.append(
                    f"Report-Gate '{gate_name}' behauptet PROVED, Output ist aber ein Stub."
                )

    if report.get("release_ready") is True and isinstance(gates, list):
        for gate in gates:
            if not isinstance(gate, dict):
                continue
            if gate.get("status") in {"REJECTED", "SKIPPED"}:
                issues.append(
                    f"release_ready=true trotz Gate-Status {gate.get('gate')}: {gate.get('status')}"
                )
    return issues


def verify_triple_consistency_preflight(
    tasks: List[Dict[str, object]],
    task_fingerprint: str,
) -> List[str]:
    issues: List[str] = []
    task_paths = get_task_paths(tasks)
    if not task_paths:
        return ["Task-Queue enthält keine gültigen Pfade."]

    checkpoint = load_checkpoint()
    checkpoint_fingerprint = checkpoint.get("task_fingerprint")
    if checkpoint_fingerprint != task_fingerprint:
        return issues

    completed_raw = checkpoint.get("completed_paths", [])
    completed = (
        [normalize_path(path) for path in completed_raw if isinstance(path, str) and path.strip()]
        if isinstance(completed_raw, list)
        else []
    )
    disk_files = get_disk_task_files(task_paths)

    if completed and sorted(set(completed)) != sorted(set(disk_files)):
        issues.append(
            "Triple-Konsistenz verletzt: Checkpoint completed_paths stimmen nicht mit Disk überein."
        )
        only_checkpoint = sorted(set(completed) - set(disk_files))
        only_disk = sorted(set(disk_files) - set(completed))
        if only_checkpoint:
            issues.append(f"  Nur im Checkpoint: {', '.join(only_checkpoint[:5])}")
        if only_disk:
            issues.append(f"  Nur auf Disk: {', '.join(only_disk[:5])}")

    if os.path.exists(BUILD_REPORT_PATH):
        try:
            report = json.loads(read_file(BUILD_REPORT_PATH))
            succeeded_raw = report.get("tasks_succeeded", [])
            succeeded = (
                [
                    normalize_path(path)
                    for path in succeeded_raw
                    if isinstance(path, str) and path.strip()
                ]
                if isinstance(succeeded_raw, list)
                else []
            )
            if completed and sorted(set(succeeded)) != sorted(set(completed)):
                issues.append(
                    "Triple-Konsistenz verletzt: Report tasks_succeeded stimmen nicht mit Checkpoint überein."
                )
            triple = report.get("triple_consistency", {})
            if isinstance(triple, dict) and triple.get("consistent") is True:
                recomputed = compute_triple_consistency(task_paths, completed, succeeded)
                if not recomputed.get("consistent"):
                    issues.append(
                        "Report triple_consistency.consistent=true, Recompute ergibt false."
                    )
        except Exception as error:
            issues.append(f"orchestrator.report.json Prüfung fehlgeschlagen: {error}")

    issues.extend(verify_report_gate_honesty())
    return issues


def load_task_queue(default_queue: List[Dict[str, object]]) -> List[Dict[str, object]]:
    if not os.path.exists(TASKS_CONFIG_PATH):
        return default_queue
    try:
        raw = read_file(TASKS_CONFIG_PATH)
        parsed = json.loads(raw)
    except Exception as error:
        print(f"⚠️  Konnte {TASKS_CONFIG_PATH} nicht laden: {error}")
        return default_queue
    if not isinstance(parsed, list):
        print(f"⚠️  {TASKS_CONFIG_PATH} muss eine JSON-Liste sein. Nutze Default-Queue.")
        return default_queue

    valid_tasks: List[Dict[str, object]] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        phase = item.get("phase")
        task = item.get("task")
        path = item.get("path")
        depends_on = item.get("depends_on", [])
        if all(isinstance(v, str) and v.strip() for v in [phase, task, path]):
            normalized_dependencies: List[str] = []
            if isinstance(depends_on, list):
                for dependency in depends_on:
                    if isinstance(dependency, str) and dependency.strip():
                        normalized_dependencies.append(normalize_path(dependency))
            valid_task: Dict[str, object] = {
                "phase": phase,
                "task": task,
                "path": normalize_path(path),
                "depends_on": normalized_dependencies,
            }
            if isinstance(item.get("force_llm"), bool):
                valid_task["force_llm"] = item["force_llm"]
            coder_model_value = item.get("coder_model")
            if isinstance(coder_model_value, str) and coder_model_value.strip():
                valid_task["coder_model"] = coder_model_value.strip()
            valid_tasks.append(valid_task)

    if not valid_tasks:
        print(f"⚠️  {TASKS_CONFIG_PATH} enthält keine gültigen Tasks. Nutze Default-Queue.")
        return default_queue
    print(f"✅ Lade Task-Queue aus {TASKS_CONFIG_PATH} ({len(valid_tasks)} Tasks)")
    return valid_tasks


def load_checkpoint() -> Dict[str, object]:
    if not os.path.exists(CHECKPOINT_PATH):
        return {"completed_paths": [], "failed_paths": []}
    try:
        parsed = json.loads(read_file(CHECKPOINT_PATH))
        if isinstance(parsed, dict):
            completed = parsed.get("completed_paths", [])
            failed = parsed.get("failed_paths", [])
            return {
                "completed_paths": completed if isinstance(completed, list) else [],
                "failed_paths": failed if isinstance(failed, list) else [],
                "task_fingerprint": parsed.get("task_fingerprint"),
            }
    except Exception:
        pass
    return {"completed_paths": [], "failed_paths": []}


def save_checkpoint(completed_paths: List[str], failed_paths: List[str]) -> None:
    payload = {
        "timestamp": datetime.now(UTC).isoformat(),
        "completed_paths": sorted(set(completed_paths)),
        "failed_paths": sorted(set(failed_paths)),
    }
    write_file_atomic(CHECKPOINT_PATH, json.dumps(payload, ensure_ascii=False, indent=2))


def compute_task_fingerprint(tasks: List[Dict[str, object]]) -> str:
    normalized_tasks: List[Dict[str, object]] = []
    for task in tasks:
        normalized_tasks.append(
            {
                "phase": str(task.get("phase", "")),
                "task": str(task.get("task", "")),
                "path": normalize_path(str(task.get("path", ""))),
                "depends_on": sorted(
                    normalize_path(str(dep))
                    for dep in task.get("depends_on", [])
                    if isinstance(dep, str)
                ),
            }
        )
    normalized_tasks.sort(key=lambda item: str(item.get("path", "")))
    payload = json.dumps(normalized_tasks, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def load_checkpoint_for_tasks(task_fingerprint: str) -> Dict[str, object]:
    checkpoint = load_checkpoint()
    checkpoint_fingerprint = checkpoint.get("task_fingerprint")
    if checkpoint_fingerprint != task_fingerprint:
        return {"completed_paths": [], "failed_paths": [], "task_fingerprint": task_fingerprint}

    completed = checkpoint.get("completed_paths", [])
    repaired_completed: List[str] = []
    if isinstance(completed, list):
        for path in completed:
            if isinstance(path, str) and path.strip() and os.path.exists(path):
                repaired_completed.append(normalize_path(path))

    failed = checkpoint.get("failed_paths", [])
    repaired_failed: List[str] = []
    if isinstance(failed, list):
        for path in failed:
            if isinstance(path, str) and path.strip():
                repaired_failed.append(normalize_path(path))

    return {
        "completed_paths": repaired_completed,
        "failed_paths": repaired_failed,
        "task_fingerprint": task_fingerprint,
    }


def save_checkpoint_for_tasks(
    completed_paths: List[str], failed_paths: List[str], task_fingerprint: str
) -> None:
    payload = {
        "timestamp": datetime.now(UTC).isoformat(),
        "task_fingerprint": task_fingerprint,
        "completed_paths": sorted(set(normalize_path(path) for path in completed_paths)),
        "failed_paths": sorted(set(normalize_path(path) for path in failed_paths)),
    }
    write_file_atomic(CHECKPOINT_PATH, json.dumps(payload, ensure_ascii=False, indent=2))


def are_dependencies_ready(
    task: Dict[str, object], completed_paths: Set[str]
) -> Tuple[bool, List[str]]:
    missing: List[str] = []
    dependencies = task.get("depends_on", [])
    if not isinstance(dependencies, list):
        return True, []
    for dependency in dependencies:
        if not isinstance(dependency, str):
            continue
        dep = normalize_path(dependency)
        if dep not in completed_paths:
            missing.append(dep)
            continue
        # [Orchestrator]: dry runs never write files — disk check only for real builds
        if not DRY_RUN and not os.path.exists(dep):
            missing.append(dep)
    return len(missing) == 0, missing


def ensure_project_scaffold() -> None:
    package_json = """{
  "name": "structai",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "echo lint skipped",
    "test": "echo test skipped"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-font": "~13.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-crypto": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "react-native-reanimated": "~3.16.1",
    "react-native-screens": "~4.1.0",
    "react-native-safe-area-context": "4.12.0",
    "zustand": "^5.0.2",
    "@react-native-async-storage/async-storage": "1.23.1",
    "lucide-react-native": "^0.460.0",
    "lottie-react-native": "7.1.0"
  },
  "devDependencies": {
    "typescript": "~5.6.3",
    "@types/react": "~18.3.12"
  }
}
"""
    tsconfig_json = """{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "moduleResolution": "bundler",
    "paths": {
      "src/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
"""
    scaffold_files = {
        "package.json": package_json,
        "tsconfig.json": tsconfig_json,
    }
    for path, content in scaffold_files.items():
        if not os.path.exists(path):
            write_file(path, content)
            print(f"🧩 Projekt-Scaffold angelegt: {path}")


CONTRACTS_DIR = "orchestrator/contracts"
TEMPLATES_DIR = "orchestrator/templates"


def ensure_baseline_files() -> None:
    ensure_project_scaffold()
    baseline_files = {
        "instructions.md": DEFAULT_INSTRUCTIONS_CONTENT,
        "orchestrator.tasks.json": DEFAULT_TASKS_JSON,
    }
    for path, content in baseline_files.items():
        if not os.path.exists(path):
            write_file(path, content)
            print(f"🧩 Baseline-Datei angelegt: {path}")

    for infra_dir in [CONTRACTS_DIR, TEMPLATES_DIR]:
        os.makedirs(infra_dir, exist_ok=True)

    theme_contract_source = "theme_contract.md"
    theme_contract_dest = os.path.join(CONTRACTS_DIR, "theme.contract.md")
    if os.path.exists(theme_contract_source) and not os.path.exists(theme_contract_dest):
        shutil.copy2(theme_contract_source, theme_contract_dest)
        print(f"🧩 Contract kopiert: {theme_contract_dest}")


def read_contract(contract_name: str) -> str:
    contract_path = os.path.join(CONTRACTS_DIR, contract_name)
    if os.path.isfile(contract_path):
        return read_file(contract_path)
    return ""


def get_template_for_path(file_path: str) -> Optional[str]:
    template_path = os.path.join(TEMPLATES_DIR, normalize_path(file_path))
    if os.path.isfile(template_path):
        return read_file(template_path)
    return None


def try_validated_template(file_path: str) -> Optional[str]:
    template_code = get_template_for_path(file_path)
    if not template_code:
        return None
    static_issues = run_static_checks(template_code, file_path)
    if static_issues:
        return None
    return template_code


def should_use_template_for_file(file_path: str) -> bool:
    if FAST_PATH_ENABLED:
        return True
    if CONSTANTS_TEMPLATE_ALWAYS and infer_file_category(file_path) == "constants":
        return True
    return False


def load_dependency_sources(task: Dict[str, object]) -> str:
    blocks: List[str] = []
    dependencies = task.get("depends_on", [])
    if not isinstance(dependencies, list):
        return ""
    for dependency in dependencies:
        if not isinstance(dependency, str):
            continue
        dep_path = normalize_path(dependency)
        if os.path.isfile(dep_path):
            blocks.append(
                f"--- BESTEHENDE ABHÄNGIGKEIT: {dep_path} (exakt diese API/Keys nutzen) ---\n"
                f"{read_file(dep_path)}\n"
            )
    return "\n".join(blocks)


def _contract_names_for_path(file_path: str) -> List[str]:
    normalized = normalize_path(file_path)
    names: List[str] = []
    if "/shared/theme/" in normalized:
        names.append("theme.contract.md")
    elif "/shared/ui/" in normalized:
        names.extend(
            ["theme.contract.md", "design-reference.contract.md", "product.contract.md"]
        )
    elif "/app/" in normalized:
        names.extend(
            [
                "product.contract.md",
                "design-reference.contract.md",
                "screens.contract.md",
                "theme.contract.md",
            ]
        )
    elif "/features/" in normalized or "/processes/" in normalized:
        names.append("product.contract.md")
        if "PromptLab" in normalized or "promptLab" in normalized:
            names.append("backend.contract.md")
    elif normalized.startswith("backend/"):
        names.extend(["backend.contract.md", "product.contract.md"])
    return names


def get_contract_for_target(file_path: str) -> str:
    blocks: List[str] = []
    seen: Set[str] = set()
    for name in _contract_names_for_path(file_path):
        if name in seen:
            continue
        seen.add(name)
        content = read_contract(name)
        if content.strip():
            blocks.append(f"--- {name} ---\n{content}")
    return "\n\n".join(blocks)


def build_agent_context(task: Dict[str, object]) -> str:
    sections: List[str] = []
    dependency_block = load_dependency_sources(task)
    if dependency_block.strip():
        sections.append(dependency_block)
    contract_block = get_contract_for_target(str(task.get("path", "")))
    if contract_block.strip():
        sections.append("--- BINDENDER VERTRAG ---\n" + contract_block)
    path_value = str(task.get("path", ""))
    if "/shared/ui/" in normalize_path(path_value) or "/app/" in normalize_path(path_value):
        allowed_paths = "\n".join(f"- theme.{item}" for item in sorted(THEME_ACCESS_PATHS))
        sections.append(
            "--- ERLAUBTE theme.* ZUGRIFFE (keine anderen Keys erfinden) ---\n"
            + allowed_paths
        )
    return "\n\n".join(sections)


def preflight_check(
    tasks: Optional[List[Dict[str, object]]] = None,
    task_fingerprint: Optional[str] = None,
) -> Tuple[bool, List[str]]:
    issues: List[str] = []
    try:
        provider = get_llm_provider()
    except RuntimeError as provider_error:
        return False, [str(provider_error)]
    print(f"  🔌 LLM Provider: {provider.name}")

    if provider.name == "ollama" and not DRY_RUN and not GATES_ONLY:
        local_models = detect_local_models()
        required_models = {
            CODER_MODEL,
            CRITIC_MODEL,
            DEBUGGER_MODEL,
            ARCHITECT_MODEL,
            AUDITOR_MODEL,
        }
        missing_models = [
            model
            for model in required_models
            if not is_model_available(model, local_models)
        ]
        if missing_models:
            issues.append(f"Fehlende lokale Ollama-Modelle: {', '.join(missing_models)}")
        if "30b" in CODER_MODEL.lower() or "32b" in CODER_MODEL.lower():
            print(
                "  ⚠️  Hinweis: Großes Coder-Modell erkannt (30B+). "
                "Auf RTX 3060 Ti (16GB VRAM) empfohlen: "
                "STRUCTAI_CODER_MODEL=qwen2.5-coder:7b"
            )
    elif provider.name == "ollama" and (DRY_RUN or GATES_ONLY):
        print("  🧪 DRY-RUN/GATES-ONLY: Ollama-Modell-Check übersprungen.")

    if not os.path.exists("instructions.md"):
        issues.append("instructions.md fehlt.")

    if tasks and task_fingerprint and not GATES_ONLY and not DRY_RUN:
        issues.extend(verify_triple_consistency_preflight(tasks, task_fingerprint))

    return len(issues) == 0, issues
 
# ---------------------------------------------------------------------
# AGENT 1: Der Coder (Lokal - Qwen3 Coder 30B)
# ---------------------------------------------------------------------
def ask_coder(
    task_description: str,
    file_path: str,
    architect_plan: str,
    build_context: str = "",
    past_critic_feedback: str = "",
    past_static_feedback: str = "",
    model_override: str = "",
) -> str:
    rules = read_file("instructions.md")
    focus = _build_coder_focus_rules(file_path)

    feedback_block = ""
    if past_critic_feedback:
        feedback_block = f"""
VERGANGENES KRITIKER-FEEDBACK (ZWINGEND korrigieren!):
{past_critic_feedback}
"""
    static_feedback_block = ""
    if past_static_feedback:
        static_feedback_block = f"""
VERGANGENE STATIC-CHECK FEHLER (ZWINGEND korrigieren!):
{past_static_feedback}
"""

    prompt = f"""Du bist der Senior React Native / Expo / TypeScript Entwickler für StructAI.

DEINE AUFGABE:
Schreibe den vollständigen, lauffähigen Code für die Datei: {file_path}
Anforderung: {task_description}
ARCHITECT-PLAN (bindend umsetzen):
{architect_plan}

KONTEXT AUS DEM PROJEKT (bindend, nicht ignorieren):
{build_context if build_context.strip() else "Keine zusätzlichen Abhängigkeiten."}

KATEGORIE-SPEZIFISCHE REGELN (Priorität 1, bindend):
{focus}

FULL RULEBOOK (Referenz):
{rules}
{feedback_block}
{static_feedback_block}
WICHTIG:
- Antworte AUSSCHLIESSLICH mit reinem Code. Kein Markdown, keine ```-Blöcke, keine Erklärungen.
- Beginne sofort mit dem ersten Import oder dem ersten Zeichen des Codes.
- Der Code muss zu 100% vollständig und lauffähig sein. Keine TODOs, keine Platzhalter.
- Theme-const-Tokens: In `export type`/`interface` immer `typeof`. In `export const theme = {{ colors: AppColors }}` ist `colors: AppColors` als WERT erlaubt.
- `export type`-Namen dürfen nicht mit `export const`-Namen kollidieren (`theme` const + `Theme` type).
- Imports: KEINE @/-Alias-Pfade, KEINE erfundenen Module (z.B. theme/tokens). Nur relative Imports zu existierenden Dateien. Theme aus `../theme` oder `src/shared/theme/index`.
- UI/Feature: keine Hex-/rgba-Literale — nur `theme.colors.*` / `theme.typography.*` mit existierenden Keys.
"""


    raw_content = call_local_model(
        model_name=model_override or CODER_MODEL,
        system_prompt=(
            "Du bist ein hochqualifizierter Senior React Native Entwickler. "
            "Schreibe präzisen, sauberen Code gemäß den Anweisungen."
        ),
        user_prompt=prompt,
    )
    return clean_code(raw_content)


# ---------------------------------------------------------------------
# AGENT 2: Der Kritiker (Lokal - Ollama Gemma 4)
# ---------------------------------------------------------------------
def ask_critic(generated_code: str, file_path: str) -> str:
    category = infer_file_category(file_path)
    if category == "constants":
        rules = (
            "Prüfe NUR constants-Regeln: as const, typeof-Typen, kein any/TODO, "
            "kein React/JSX, keine Funktionen, Named Exports."
        )
    else:
        rules = read_file("instructions.md")

    prompt = f"""Du bist der unerbarmherzige Code-Kritiker für StructAI.

DIE GESETZE (instructions.md):
{rules}

{_build_critic_rule_context(file_path)}

ZU PRÜFENDE DATEI: {file_path}
GENERIERTER CODE:
{generated_code}

PRÜF-PROTOKOLL:
1. Bestimme die Kategorie der Datei anhand des Pfades (bereits oben angegeben).
2. Prüfe AUSSCHLIESSLICH die für diese Kategorie markierten Regeln.
3. Regeln mit "NICHT prüfen" darfst du NIEMALS als Ablehnungsgrund nennen.
4. Nenne maximal 3 Ablehnungsgründe (die kritischsten zuerst).
5. Lehne NUR bei objektiven, nachweisbaren Regelverstößen ab. Keine Spekulationen.

ANTWORTE NUR IN DIESEM FORMAT (zwei Zeilen, exakt):
STATUS: PROVED
BEGRÜNDUNG: Perfekt.

ODER bei Fehlern:
STATUS: REJECTED
BEGRÜNDUNG: 1) ...
"""

    for attempt in range(1, MODEL_CALL_RETRIES + 1):
        review = call_local_model(
            model_name=CRITIC_MODEL,
            system_prompt=(
                "Du bist ein extrem kritischer Tech-Lead. "
                "Antworte IMMER mit exakt 'STATUS: PROVED' oder 'STATUS: REJECTED' in Zeile 1. "
                "Keine Einleitung, kein Markdown."
            ),
            user_prompt=prompt,
        )
        normalized = normalize_review_text(review)
        if not is_malformed_agent_status(normalized):
            return normalized
        preview = normalized.strip().replace("\n", " ")[:200]
        print(
            f"  ⚠️  Kritiker lieferte malformed Output (Versuch {attempt}/{MODEL_CALL_RETRIES}): {preview!r}"
        )
        if attempt < MODEL_CALL_RETRIES:
            time.sleep(MODEL_CALL_RETRY_BASE_SECONDS)
    return normalized


# ---------------------------------------------------------------------
# AGENT 3: Der Debugger/Fixer (Lokal - standardmäßig Gemma 4)
# ---------------------------------------------------------------------
def ask_debugger(
    current_code: str,
    file_path: str,
    task_description: str,
    critic_feedback: str,
    build_context: str = "",
    previous_debugger_feedback: str = "",
    model_override: str = "",
) -> str:
    rules = read_file("instructions.md")

    debugger_feedback_block = ""
    if previous_debugger_feedback.strip():
        debugger_feedback_block = f"""
VERGANGENES DEBUGGER-FEEDBACK (falls letzter Fix erneut abgelehnt wurde):
{previous_debugger_feedback}
"""

    prompt = f"""Du bist der StructAI Debugger-Agent.
Deine Aufgabe: einen bereits vorhandenen Code gezielt korrigieren, basierend auf Kritiker-Feedback.

ZIELDATEI: {file_path}
ANFORDERUNG DER DATEI: {task_description}

GESETZE (instructions.md):
{rules}

PROJEKT-KONTEXT (bindend):
{build_context if build_context.strip() else "Kein Zusatzkontext."}

AKTUELLER CODE:
{current_code}

KRITIKER-FEEDBACK (muss vollständig behoben werden):
{critic_feedback}
{debugger_feedback_block}
WICHTIG:
- Liefere ausschließlich den vollständigen, korrigierten Datei-Code.
- Kein Markdown, keine ```-Blöcke, keine Erklärungen.
- Behebe NUR echte Mängel laut Kritik, ohne funktionierende Teile unnötig umzubauen.
- Keine TODOs, keine Platzhalter, kein any.
- Theme-const-Tokens: in Typannotationen immer `typeof AppColors` / `typeof AppTypography` / `typeof theme`, niemals den const-Namen als Typ. Keine Kollision zwischen `export const` und `export type` (z.B. `theme` const + `Theme` type).
- Korrigiere falsche Imports (tokens, @/...) auf existierende Pfade; nutze nur definierte theme-Keys.
"""

    raw_content = call_local_model(
        model_name=model_override or DEBUGGER_MODEL,
        system_prompt=(
            "Du bist ein präziser Senior Debugger für TypeScript/React Native. "
            "Du fixst sauber und minimal-invasiv, ohne neue Fehler zu erzeugen."
        ),
        user_prompt=prompt,
    )
    return clean_code(raw_content)


# ---------------------------------------------------------------------
# AGENT 4: Der Architect/Planner (Lokal - Gemma 4)
# ---------------------------------------------------------------------
def ask_architect(
    task_description: str, file_path: str, build_context: str = ""
) -> str:
    rules = read_file("instructions.md")
    contracts = get_contract_for_target(file_path)
    contracts_block = ""
    if contracts.strip():
        contracts_block = f"\nBINDENDE VERTRÄGE:\n{contracts}\n"
    prompt = f"""Du bist der StructAI Architect-Agent.
Erzeuge einen kompakten, umsetzbaren Bauplan für genau eine Datei.
Produkt ist StructAI (Prompting-Akademie) — kein Fremd-Branding aus Design-Mockups.

DATEI: {file_path}
TASK: {task_description}

PROJEKT-KONTEXT:
{build_context if build_context.strip() else "Keine Abhängigkeiten."}
{contracts_block}
GESETZE:
{rules}

ANTWORT-FORMAT (strikt):
PLAN:
1) ...
2) ...
3) ...
RISIKEN:
- ...
ABNAHMEKRITERIEN:
- ...
"""
    return call_local_model(
        model_name=ARCHITECT_MODEL,
        system_prompt=(
            "Du bist ein Principal Engineer. "
            "Lieferst nur konkrete, umsetzbare Planpunkte für React Native/TypeScript."
        ),
        user_prompt=prompt,
    )


# ---------------------------------------------------------------------
# AGENT 5: Der QA Auditor (Lokal - Gemma 4)
# ---------------------------------------------------------------------
def ask_auditor(generated_code: str, file_path: str, task_description: str) -> str:
    prompt = f"""Du bist der StructAI QA-Auditor. Zweite Schutzschicht nach dem Kritiker.
Fokus: Integrationsrisiken, Stabilität, Runtime-Fehler — KEINE Stilkritik.

DATEI: {file_path}
KATEGORIE: {infer_file_category(file_path)}
TASK: {task_description}

ABSOLUTE ABLEHNUNGSVERBOTE (niemals als Grund nennen):
- "könnte", "potenziell", "theoretisch", "zu komplex", "wiederverwendbarkeit"
- Stylistische Präferenzen oder alternative Implementierungsideen
- Fehlende Features, die nicht im Task gefordert waren
- Hypothetische Risiken ohne konkreten Code-Beleg

NUR BEI DIESEN OBJEKTIVEN BEFUNDEN ABLEHNEN:
- Runtime-Fehler nachweisbar im Code (null-deref, falscher Import, etc.)
- Async-Code ohne try-catch in Kategorien wo Regel 6c gilt
- Verletzung des FSD-Import-Gesetzes (cross-feature imports)
- 'any' im Code

CODE:
{generated_code}

ANTWORTE NUR IN DIESEM FORMAT:
STATUS: [PROVED oder REJECTED]
BEGRÜNDUNG: [Bei PROVED: "Perfekt." | Bei REJECTED: max. 3 nummerierte, objektive Punkte]
"""
    review = call_local_model(
        model_name=AUDITOR_MODEL,
        system_prompt=(
            "Du bist ein kompromissloser QA-/Reliability-Lead. "
            "Bewerte nur reale, objektiv nachweisbare technische Risiken. "
            "Lehne NICHT wegen Stilpräferenzen, hypothetischen oder spekulativen Risiken ab."
        ),
        user_prompt=prompt,
    )
    return normalize_review_text(review)


def try_finalize_with_contract_template(
    file_path: str, task_description: str
) -> bool:
    """Letzter autonomer Fallback: verbindliches Template aus orchestrator/templates/."""
    if not TEMPLATE_FALLBACK:
        return False
    template_code = get_template_for_path(file_path)
    if not template_code:
        return False
    static_issues = run_static_checks(template_code, file_path)
    if static_issues:
        return False
    print("  📐 Contract-Template-Fallback (automatisch im Pipeline-Ablauf).")
    critic_result = ask_critic(template_code, file_path)
    if extract_status(critic_result) != "PROVED":
        return False
    auditor_result = ask_auditor(template_code, file_path, task_description)
    auditor_status = extract_status(auditor_result)
    if auditor_status == "PROVED":
        write_file(file_path, template_code)
        print(f"\n  ✅ APPROVED (Template) & GESPEICHERT: {file_path}")
        return True
    if is_subjective_rejection(extract_begruendung(auditor_result)):
        write_file(file_path, template_code)
        print(f"\n  ✅ APPROVED (Template, Auditor-Eskalation) & GESPEICHERT: {file_path}")
        return True
    return False


# ---------------------------------------------------------------------
# DIE ORCHESTRATOR-SCHLEIFE (Quality Gate)
# ---------------------------------------------------------------------
def build_file_with_quality_gate(task: Dict[str, object]) -> Tuple[bool, str]:
    task_description = str(task.get("task", ""))
    file_path = normalize_path(str(task.get("path", "")))
    build_context = build_agent_context(task)
    # [Orchestrator]: force_llm skips stale templates when task requirements changed
    force_llm = bool(task.get("force_llm"))
    task_coder_model = str(task.get("coder_model", "")).strip()

    def resolve_coder_model(cycle_number: int) -> str:
        """Per-task model override + Opus escalation (Claude provider only)."""
        if LLM_PROVIDER_NAME != "claude":
            return ""
        if CODER_ESCALATION_MODEL and cycle_number >= CODER_ESCALATION_CYCLE:
            return CODER_ESCALATION_MODEL
        return task_coder_model

    print(f"\n{'='*60}")
    print(f"🚀 BUILD: {file_path}")
    print(f"{'='*60}")
    progress = get_pipeline_progress()
    if progress is not None:
        progress.active(file_path, "Architect → Coder → Critic → Auditor")
    if build_context.strip():
        print("  📎 Dependency/Contract-Kontext geladen.")
 
    max_cycles = int(os.getenv("STRUCTAI_MAX_CYCLES", "7"))
    max_debug_passes_per_cycle = int(os.getenv("STRUCTAI_DEBUG_PASSES", "3"))
    cooldown_seconds = int(os.getenv("STRUCTAI_COOLDOWN_SECONDS", "2"))
    max_subjective_auditor_rejections = int(
        os.getenv("STRUCTAI_MAX_SUBJECTIVE_AUDITOR_REJECTIONS", "2")
    )

    if not force_llm and should_use_template_for_file(file_path):
        template_code = try_validated_template(file_path)
        if template_code:
            label = (
                "Constants-Template"
                if infer_file_category(file_path) == "constants"
                else "Fast Path Template"
            )
            print(f"  ⚡ {label} für {file_path} gefunden und validiert.")
            write_file(file_path, template_code)
            print(f"\n  ✅ APPROVED ({label}) & GESPEICHERT: {file_path}")
            return True, ""
        if FAST_PATH_ENABLED:
            print(f"  ⚠️  Template für {file_path} fehlt oder hat Static-Check-Fehler — nutze LLM-Pipeline.")

    architect_plan = ask_architect(task_description, file_path, build_context)
    print("  🧭 Architect-Plan erstellt.")

    last_critic_feedback = ""
    last_debugger_feedback = ""
    last_static_feedback = ""
    last_auditor_feedback = ""
    current_code: Optional[str] = None
    subjective_auditor_rejections = 0

    escalation_announced = False
    for cycle in range(1, max_cycles + 1):
        print(f"\n  🔁 [Cycle {cycle}/{max_cycles}]")

        cycle_model = resolve_coder_model(cycle)
        if (
            cycle_model
            and CODER_ESCALATION_MODEL
            and cycle >= CODER_ESCALATION_CYCLE
            and not escalation_announced
        ):
            print(f"  🚀 Modell-Eskalation aktiv: Coder/Debugger → {cycle_model}")
            escalation_announced = True

        if cycle == 4 and last_critic_feedback:
            print("  🧭 Re-Architect: Frischer Plan mit Fehler-Kontext...")
            failure_context = (
                f"{build_context}\n\n"
                f"--- BISHERIGE FEHLER (ZWINGEND vermeiden) ---\n{last_critic_feedback}"
            )
            architect_plan = ask_architect(task_description, file_path, failure_context)

        if current_code is None or cycle in (1, 4):
            print("  📝 Coder erstellt/erneuert Basis-Code...")
            current_code = ask_coder(
                task_description=task_description,
                file_path=file_path,
                architect_plan=architect_plan,
                build_context=build_context,
                past_critic_feedback=last_critic_feedback,
                past_static_feedback=last_static_feedback,
                model_override=cycle_model,
            )
        else:
            print("  🧰 Debugger startet direkt vom letzten Stand...")
            current_code = ask_debugger(
                current_code=current_code,
                file_path=file_path,
                task_description=task_description,
                critic_feedback=last_critic_feedback,
                build_context=build_context,
                previous_debugger_feedback=last_debugger_feedback,
                model_override=cycle_model,
            )

        if cooldown_seconds > 0:
            time.sleep(cooldown_seconds)

        static_issues = run_static_checks(current_code, file_path)
        if static_issues:
            last_static_feedback = "\n".join(
                [f"{index}. {issue}" for index, issue in enumerate(static_issues, start=1)]
            )
            print("  🧪 STATIC CHECK: REJECTED")
            print(f"  {last_static_feedback}")
            current_code = ask_debugger(
                current_code=current_code,
                file_path=file_path,
                task_description=task_description,
                critic_feedback=f"STATIC CHECK FEHLER:\n{last_static_feedback}",
                build_context=build_context,
                previous_debugger_feedback=last_debugger_feedback,
                model_override=cycle_model,
            )
            if cooldown_seconds > 0:
                time.sleep(cooldown_seconds)
            static_issues = run_static_checks(current_code, file_path)
            if static_issues:
                last_static_feedback = "\n".join(
                    [
                        f"{index}. {issue}"
                        for index, issue in enumerate(static_issues, start=1)
                    ]
                )
                print("  ❌ STATIC CHECK weiterhin fehlgeschlagen, neuer Cycle.")
                continue
            print("  ✅ STATIC CHECK nach Debug-Pass bestanden.")
            last_static_feedback = ""

        print("  🔍 Kritiker prüft aktuellen Stand...")
        critic_result = ask_critic(current_code, file_path)
        critic_status, critic_display = resolve_critic_verdict(
            critic_result, static_checks_passed=True
        )
        print("\n  --- KRITIKER ERGEBNIS ---")
        print(f"  {critic_display.strip()}")
        print("  -------------------------")

        if critic_status == "PROVED":
            print("  🧯 QA-Auditor prüft Integrationsrisiken...")
            auditor_result = ask_auditor(current_code, file_path, task_description)
            auditor_status = extract_status(auditor_result)
            auditor_begruendung = extract_begruendung(auditor_result)
            print("  --- AUDITOR ERGEBNIS ---")
            print(f"  {auditor_result.strip()}")
            print("  ------------------------")
            if auditor_status == "PROVED":
                write_file(file_path, current_code)
                print(f"\n  ✅ APPROVED & GESPEICHERT: {file_path}")
                return True, ""
            if is_subjective_rejection(auditor_begruendung):
                subjective_auditor_rejections += 1
                print(
                    "  ⚠️  Auditor-Feedback als subjektiv klassifiziert "
                    f"({subjective_auditor_rejections}/{max_subjective_auditor_rejections})."
                )
                if subjective_auditor_rejections >= max_subjective_auditor_rejections:
                    print("  ✅ Escalation: Critic PROVED + wiederholt subjektiver Auditor -> ACCEPT.")
                    write_file(file_path, current_code)
                    return True, ""
            last_auditor_feedback = auditor_result
            last_critic_feedback = auditor_result
            print("  ❌ Auditor REJECTED. Debugger korrigiert Risiko-Punkte...")

        else:
            last_critic_feedback = critic_result
            print("  ❌ REJECTED. Debugger übernimmt gezielte Korrektur...")

        for debug_pass in range(1, max_debug_passes_per_cycle + 1):
            print(f"    🛠️  Debug-Pass {debug_pass}/{max_debug_passes_per_cycle}...")
            merged_feedback = "\n".join(
                block
                for block in [last_critic_feedback, last_auditor_feedback]
                if block.strip()
            )
            current_code = ask_debugger(
                current_code=current_code,
                file_path=file_path,
                task_description=task_description,
                critic_feedback=merged_feedback,
                build_context=build_context,
                previous_debugger_feedback=last_debugger_feedback,
                model_override=cycle_model,
            )

            if cooldown_seconds > 0:
                time.sleep(cooldown_seconds)

            static_issues = run_static_checks(current_code, file_path)
            if static_issues:
                last_static_feedback = "\n".join(
                    [
                        f"{index}. {issue}"
                        for index, issue in enumerate(static_issues, start=1)
                    ]
                )
                print("    🧪 STATIC CHECK nach Debug-Pass: REJECTED")
                print(f"    {last_static_feedback}")
                last_debugger_feedback = f"STATIC CHECK FEHLER:\n{last_static_feedback}"
                continue
            last_static_feedback = ""

            print("    🔍 Kritiker re-checkt Debug-Pass...")
            critic_result = ask_critic(current_code, file_path)
            critic_status, critic_display = resolve_critic_verdict(
                critic_result, static_checks_passed=True
            )
            print("    --- RE-CHECK ---")
            print(f"    {critic_display.strip()}")
            print("    ---------------")

            if critic_status == "PROVED":
                auditor_result = ask_auditor(current_code, file_path, task_description)
                auditor_status = extract_status(auditor_result)
                auditor_begruendung = extract_begruendung(auditor_result)
                print("    --- AUDITOR RE-CHECK ---")
                print(f"    {auditor_result.strip()}")
                print("    ------------------------")
                if auditor_status == "PROVED":
                    write_file(file_path, current_code)
                    print(f"\n  ✅ APPROVED & GESPEICHERT: {file_path}")
                    return True, ""
                if is_subjective_rejection(auditor_begruendung):
                    subjective_auditor_rejections += 1
                    print(
                        "    ⚠️  Auditor-Feedback als subjektiv klassifiziert "
                        f"({subjective_auditor_rejections}/{max_subjective_auditor_rejections})."
                    )
                    if subjective_auditor_rejections >= max_subjective_auditor_rejections:
                        print("    ✅ Escalation: Critic PROVED + wiederholt subjektiver Auditor -> ACCEPT.")
                        write_file(file_path, current_code)
                        return True, ""
                last_auditor_feedback = auditor_result
                last_debugger_feedback = auditor_result
                last_critic_feedback = auditor_result
                continue

            last_debugger_feedback = critic_result
            last_critic_feedback = critic_result
            last_auditor_feedback = ""

    if not force_llm and try_finalize_with_contract_template(file_path, task_description):
        return True, ""

    failure_feedback = "\n".join(
        block
        for block in [last_critic_feedback, last_static_feedback, last_auditor_feedback]
        if block.strip()
    )
    print(f"\n  💥 FEHLGESCHLAGEN: {file_path} nach {max_cycles} Zyklen.")
    print(f"  → Bitte Task-Beschreibung manuell verfeinern.")
    return False, failure_feedback
 
# ---------------------------------------------------------------------
# TASK QUEUE – Die vollständige StructAI Build-Reihenfolge
# ---------------------------------------------------------------------
TASK_QUEUE = [
 
    # ── PHASE 1: SHARED FOUNDATION ──────────────────────────────────
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/theme/colors.ts als zentrales Design-Token-System (SwiftUI-like). "
            "export const AppColors = {...} as const; export type AppColorPalette = typeof AppColors. "
            "Keine Verwendung von any."
        ),
        "path": "src/shared/theme/colors.ts",
        "depends_on": [],
    },
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/theme/typography.ts. "
            "export const AppTypography = {...} as const; export type AppTypographyTokens = typeof AppTypography. "
            "Schriftgrößen xs–display, Gewichte regular–bold. Dark Mode First, SwiftUI-Style."
        ),
        "path": "src/shared/theme/typography.ts"
    },
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/theme/index.ts als zentralen Re-Export. "
            "export const theme = { colors: AppColors, typography: AppTypography } as const; "
            "export type Theme = typeof theme (niemals AppColors/AppTypography als bare Typen). "
            "Re-export AppColors und AppTypography."
        ),
        "path": "src/shared/theme/index.ts"
    },
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/ui/PressableCard.tsx. "
            "Eine wiederverwendbare React Native Karte mit: "
            "borderRadius 20, Glassmorphismus-Look (rgba Background + rgba Border), "
            "Scale-Feedback bei Press (0.97) via react-native Animated, "
            "Props: children, onPress (optional), style (optional), accentColor (optional string für Border-Glow). "
            "TypeScript Interface für Props. Named Export."
        ),
        "path": "src/shared/ui/PressableCard.tsx"
    },
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/ui/GradientButton.tsx. "
            "Ein Premium-Button mit LinearGradient (expo-linear-gradient), "
            "Scale-Feedback bei Press via Animated, "
            "Props: label (string), onPress, gradientColors (string[]), disabled (optional boolean). "
            "Disabled-State: 50% Opacity. TypeScript Interface. Named Export."
        ),
        "path": "src/shared/ui/GradientButton.tsx"
    },
 
    # ── PHASE 2: GAMIFICATION STORE ─────────────────────────────────
    {
        "phase": "2 – Gamification Store",
        "task": (
            "Erstelle src/features/Gamification/model/types.ts. "
            "Definiere und exportiere folgende TypeScript Interfaces/Types: "
            "UserStats (xp: number, level: number, streak: number, lastActiveDate: string), "
            "EnergyState (currentOrbs: number, maxOrbs: number, lastRegenTimestamp: number), "
            "GamificationStore (userStats, energy, isPremium: boolean, "
            "addXP: (amount: number) => void, "
            "useOrb: () => boolean, "
            "regenOrbs: () => void, "
            "incrementStreak: () => void, "
            "setPremium: (val: boolean) => void). "
            "Nur Types/Interfaces, keine Implementierung."
        ),
        "path": "src/features/Gamification/model/types.ts"
    },
    {
        "phase": "2 – Gamification Store",
        "task": (
            "Erstelle src/features/Gamification/model/store.ts mit Zustand (zustand) und persist-Middleware (AsyncStorage). "
            "Importiere GamificationStore aus './types'. "
            "Implementiere: "
            "- maxOrbs = 5, startOrbs = 5 "
            "- addXP: erhöht XP, bei 100*level XP wird level erhöht und XP resettet "
            "- useOrb: gibt false zurück wenn 0 Orbs, sonst zieht 1 ab und gibt true zurück "
            "- regenOrbs: prüft Zeitstempel, regeneriert 1 Orb pro 30 abgelaufene Minuten, maximal bis maxOrbs "
            "- incrementStreak: prüft ob lastActiveDate != heute, dann +1 streak, setzt lastActiveDate "
            "- isPremium default false "
            "Persistiere unter Key 'structai-gamification'. Kein 'any'. Named Export: useGamificationStore."
        ),
        "path": "src/features/Gamification/model/store.ts"
    },
 
    # ── PHASE 3: APP LAYOUT & NAVIGATION ────────────────────────────
    {
        "phase": "3 – App Layout & Navigation",
        "task": (
            "Erstelle src/app/_layout.tsx als Root-Layout für Expo Router. "
            "Importiere theme aus src/shared/theme/index. "
            "Setze StatusBar auf 'light-content'. "
            "Lade Fonts via expo-font (System Fonts sind ok als Fallback). "
            "Initialisiere beim App-Start useGamificationStore().regenOrbs(). "
            "Nutze Stack aus expo-router mit screenOptions headerShown: false, "
            "background: theme.colors.background.primary. "
            "Zeige einen einfachen dunklen Ladebildschirm bis fonts geladen sind. "
            "Default Export."
        ),
        "path": "src/app/_layout.tsx"
    },
    {
        "phase": "3 – App Layout & Navigation",
        "task": (
            "Erstelle src/app/(tabs)/_layout.tsx für die Haupt-Tab-Navigation via Expo Router Tabs. "
            "3 Tabs: 'akademie' (Label: Akademie, Icon: graduation-cap oder book), "
            "'lab' (Label: Prompt Lab, Icon: flask oder cpu), "
            "'profil' (Label: Profil, Icon: person). "
            "Tab Bar Style: backgroundColor: '#0F172A', borderTopColor: 'rgba(255,255,255,0.08)', "
            "activeTintColor: '#007AFF', inactiveTintColor: 'rgba(255,255,255,0.4)'. "
            "Nutze @expo/vector-icons (Ionicons) für Icons. "
            "screenOptions: headerShown false. Default Export."
        ),
        "path": "src/app/(tabs)/_layout.tsx"
    },
 
    # ── PHASE 4: SCREEN SKELETONS ────────────────────────────────────
    {
        "phase": "4 – Screen Skeletons",
        "task": (
            "Erstelle src/app/(tabs)/akademie.tsx – den Akademie-Hauptscreen. "
            "Zeige einen ScrollView mit dark background (#0F172A). "
            "Header: 'Deine Lernpfade' in weißer, großer Schrift. "
            "3 PressableCards (importiert aus src/shared/ui/PressableCard) nebeneinander bzw. als Liste: "
            "1. 'Everyday Mastery' mit accentColor '#007AFF' "
            "2. 'Code & Development' mit accentColor '#00E5FF' "
            "3. 'Visual Creation' mit accentColor '#FF007F'. "
            "Jede Karte zeigt Titel, kurze Beschreibung und einen Fortschrittsbalken (Platzhalter: 0%). "
            "Alle Texte in TypeScript typisiert. Default Export."
        ),
        "path": "src/app/(tabs)/akademie.tsx"
    },
    {
        "phase": "4 – Screen Skeletons",
        "task": (
            "Erstelle src/app/(tabs)/lab.tsx – den Prompt Lab Screen. "
            "Zeige oben eine Energie-Orb-Anzeige (importiere useGamificationStore, zeige currentOrbs als leuchtende Kreise). "
            "Darunter ein großes TextInput (multiline, dark, abgerundet, Glassmorphismus-Look) mit Placeholder 'Gib deinen Prompt ein...'. "
            "Darunter ein GradientButton (importiert aus src/shared/ui/GradientButton) mit Label 'Optimieren ✨' "
            "und gradientColors ['#007AFF', '#00E5FF']. "
            "Button-Press: prüft isPremium oder useOrb(), wenn false zeige Alert 'Keine Energie! Upgrade auf Premium'. "
            "Score-Anzeige (0-100) als Platzhalter-Card. Alles typisiert. Default Export."
        ),
        "path": "src/app/(tabs)/lab.tsx"
    },
    {
        "phase": "4 – Screen Skeletons",
        "task": (
            "Erstelle src/app/(tabs)/profil.tsx – den Profil/Gamification Screen. "
            "Importiere useGamificationStore und zeige: "
            "- Großes XP-Display mit aktuellem Level und XP-Fortschrittsbalken "
            "- Streak-Anzeige mit Feuer-Emoji 🔥 und Tagesanzahl "
            "- Energie-Orbs Status "
            "- Premium-Status Banner (wenn isPremium: goldener Banner 'Premium Aktiv ✨', sonst: Button 'Upgrade auf Premium'). "
            "Dark Mode, SwiftUI-Karten-Look via PressableCard. Alles typisiert. Default Export."
        ),
        "path": "src/app/(tabs)/profil.tsx"
    },

    # ── PHASE 5: FEATURE APIs & PROCESSES ────────────────────────────
    {
        "phase": "5 – Feature APIs",
        "task": (
            "Erstelle src/features/PromptLab/api/optimizer.ts. "
            "Implementiere einen streng typisierten Optimizer-Service mit BYOK-Unterstützung. "
            "Eingabe: rawPrompt, provider, optional apiKey. Ausgabe: optimizedPrompt, score, rationale. "
            "Nutze fetch mit try-catch und saubere Fehlerobjekte."
        ),
        "path": "src/features/PromptLab/api/optimizer.ts"
    },
    {
        "phase": "5 – Feature APIs",
        "task": (
            "Erstelle src/features/APIKeyManager/model/secureKeyStore.ts. "
            "Implementiere save/get/remove/list für API-Keys via expo-secure-store. "
            "100% typisiert, ohne any, mit try-catch und nutzerfreundlichen Fehlermeldungen."
        ),
        "path": "src/features/APIKeyManager/model/secureKeyStore.ts"
    },
    {
        "phase": "5 – Feature APIs",
        "task": (
            "Erstelle src/processes/promptLab/runPromptComparison.ts. "
            "Implementiere Promise.all-basierte Multi-Model-Requests für ModelComparer "
            "mit stabiler Fehlerisolierung pro Modell und typisiertem Ergebnis."
        ),
        "path": "src/processes/promptLab/runPromptComparison.ts"
    },

    # ── PHASE 6: BACKEND-STUBS (für spätere Server-Anbindung) ────────
    {
        "phase": "6 – Backend Stubs",
        "task": (
            "Erstelle backend/src/types/contracts.ts. "
            "Definiere streng typisierte Contracts für PromptOptimizeRequest/Response, "
            "ModelCompareRequest/Response und APIError ohne any."
        ),
        "path": "backend/src/types/contracts.ts"
    },
    {
        "phase": "6 – Backend Stubs",
        "task": (
            "Erstelle backend/src/health/healthcheck.ts. "
            "Implementiere eine einfache Healthcheck-Funktion mit Version, Timestamp und Status "
            "inklusive try-catch für robuste Serverdiagnostik."
        ),
        "path": "backend/src/health/healthcheck.ts"
    },
]

DEFAULT_INSTRUCTIONS_CONTENT = """# StructAI Instructions

Nutze diese Datei als zentrales Regelwerk für Coder, Kritiker, Debugger, Architect und Auditor.
Halte TypeScript strikt, vermeide any/TODOs, beachte FSD und nutze Default-Exports nur bei Screens/Layouts.
"""

DEFAULT_TASKS_JSON = json.dumps(TASK_QUEUE, ensure_ascii=False, indent=2)
 
def refresh_quality_report_only(
    ordered_task_queue: List[Dict[str, object]],
    task_fingerprint: str,
) -> int:
    """Run quality gates and refresh orchestrator.report.json without LLM builds."""
    checkpoint = load_checkpoint_for_tasks(task_fingerprint)
    completed_raw = checkpoint.get("completed_paths", [])
    completed_paths = sorted(
        {
            normalize_path(path)
            for path in completed_raw
            if isinstance(path, str) and path.strip()
        }
    )
    task_paths = get_task_paths(ordered_task_queue)

    existing_report: Dict[str, object] = {}
    if os.path.exists(BUILD_REPORT_PATH):
        try:
            parsed = json.loads(read_file(BUILD_REPORT_PATH))
            if isinstance(parsed, dict):
                existing_report = parsed
        except Exception:
            existing_report = {}

    succeeded = completed_paths
    triple = compute_triple_consistency(task_paths, completed_paths, succeeded)

    print("\n  🧪 Quality-Gate-Refresh (ohne LLM-Build)...")
    gate_results = run_quality_gates(os.getcwd())
    release_ready = triple.get("consistent", False) and len(completed_paths) == len(task_paths)

    for result in gate_results:
        status = result.get("status", "UNKNOWN")
        print(f"     - {result.get('gate', 'Unknown')}: {status}")
        if status in {"REJECTED", "SKIPPED"}:
            release_ready = False

    build_report: Dict[str, object] = {
        "timestamp": datetime.now(UTC).isoformat(),
        "models": existing_report.get(
            "models",
            {
                "coder": CODER_MODEL,
                "architect": ARCHITECT_MODEL,
                "critic": CRITIC_MODEL,
                "debugger": DEBUGGER_MODEL,
                "auditor": AUDITOR_MODEL,
            },
        ),
        "tasks_total": len(ordered_task_queue),
        "tasks_succeeded": succeeded,
        "tasks_failed": list(checkpoint.get("failed_paths", [])),
        "tasks_skipped": [],
        "failure_reasons": existing_report.get("failure_reasons", {}),
        "triple_consistency": triple,
        "quality_gates": gate_results,
        "release_ready": release_ready,
        "notes": [
            "Report via STRUCTAI_GATES_ONLY aktualisiert — nur Quality Gates, kein LLM-Build.",
            f"Triple-Consistency: {'ok' if triple.get('consistent') else 'REJECTED'}.",
        ],
    }

    print(f"\n  🚦 Release-Ready: {'JA' if release_ready else 'NEIN'}")
    write_file_atomic(BUILD_REPORT_PATH, json.dumps(build_report, ensure_ascii=False, indent=2))
    print(f"  📄 Build-Report gespeichert: {BUILD_REPORT_PATH}")
    return 0 if release_ready else 1


# ---------------------------------------------------------------------
# MAIN – Startet die autonome Produktionskette
# ---------------------------------------------------------------------
if __name__ == "__main__":
    ensure_baseline_files()

    raw_queue = load_task_queue(TASK_QUEUE)
    dependency_issues = validate_task_dependencies(raw_queue)
    if dependency_issues:
        print("\n" + "!" * 60)
        print("! TASK-DEPENDENCY FEHLER")
        print("!" * 60)
        for issue in dependency_issues:
            print(f"- {issue}")
        print("\nBuild abgebrochen. Bitte orchestrator.tasks.json korrigieren.")
        sys.exit(1)

    ordered_task_queue = sort_task_queue(raw_queue)
    task_fingerprint = compute_task_fingerprint(ordered_task_queue)

    preflight_ok, preflight_issues = preflight_check(ordered_task_queue, task_fingerprint)
    if not preflight_ok:
        print("\n" + "!" * 60)
        print("! PRE-FLIGHT FEHLER")
        print("!" * 60)
        for issue in preflight_issues:
            print(f"- {issue}")
        print("\nBuild abgebrochen. Bitte Preflight-Probleme beheben und neu starten.")
        sys.exit(1)

    if GATES_ONLY:
        sys.exit(refresh_quality_report_only(ordered_task_queue, task_fingerprint))

    checkpoint = load_checkpoint_for_tasks(task_fingerprint)
    completed_paths = set(
        p for p in checkpoint.get("completed_paths", []) if isinstance(p, str) and p.strip()
    )
    failed_paths_from_checkpoint = set(
        p for p in checkpoint.get("failed_paths", []) if isinstance(p, str) and p.strip()
    )
    build_report: Dict[str, object] = {
        "timestamp": datetime.now(UTC).isoformat(),
        "provider": LLM_PROVIDER_NAME,
        "dry_run": DRY_RUN,
        "models": {
            "coder": CODER_MODEL,
            "architect": ARCHITECT_MODEL,
            "critic": CRITIC_MODEL,
            "debugger": DEBUGGER_MODEL,
            "auditor": AUDITOR_MODEL,
        },
        "tasks_total": len(ordered_task_queue),
        "tasks_succeeded": [],
        "tasks_failed": [],
        "tasks_skipped": [],
        "failure_reasons": {},
        "quality_gates": [],
        "release_ready": False,
    }

    print("\n" + "█"*60)
    print("█  STRUCTAI AUTONOMOUS BUILD SYSTEM – START              █")
    print("█"*60)
    print(f"\n  📋 {len(ordered_task_queue)} Dateien in der Queue")
    print(f"  🤖 Coder: {CODER_MODEL}")
    print(f"  🧠 Architect: {ARCHITECT_MODEL}")
    print(f"  🔍 Critic: {CRITIC_MODEL}")
    print(f"  🧰 Debugger: {DEBUGGER_MODEL}")
    print(f"  🧯 Auditor: {AUDITOR_MODEL}\n")
    print(f"  🛡️ Strict Mode: {'ON' if STRICT_MODE else 'OFF'}\n")
    print(f"  🧪 Dry Run: {'ON' if DRY_RUN else 'OFF'}\n")
    if completed_paths:
        print(f"  ♻️ Resume: {len(completed_paths)} bereits erledigte Dateien werden übersprungen.\n")
 
    failed_files = []
    current_phase = ""
    resume_skip = sum(
        1
        for task in ordered_task_queue
        if normalize_path(str(task.get("path", ""))) in completed_paths
        and os.path.exists(normalize_path(str(task.get("path", ""))))
    )
    duration_hint = estimate_pipeline_duration(
        len(ordered_task_queue),
        fast_path=FAST_PATH_ENABLED,
        resume_skip=resume_skip,
        dry_run=DRY_RUN,
    )
    print(f"  ⏱️  Geschätzte Dauer: {duration_hint}\n")

    pipeline_progress = PipelineProgress(len(ordered_task_queue))
    set_pipeline_progress(pipeline_progress)

    for i, task in enumerate(ordered_task_queue):
        task_path = normalize_path(str(task.get("path", "")))
        dependencies_ready, missing_dependencies = are_dependencies_ready(task, completed_paths)
        if not dependencies_ready:
            print(f"  ⛔ Dependency-Block: {task_path}")
            for missing in missing_dependencies:
                print(f"     - fehlt/ungültig: {missing}")
            failed_files.append(task_path)
            failed_paths_from_checkpoint.add(task_path)
            cast_failed = build_report["tasks_failed"]
            if isinstance(cast_failed, list):
                cast_failed.append(task_path)
            save_checkpoint_for_tasks(
                list(completed_paths),
                list(failed_paths_from_checkpoint),
                task_fingerprint,
            )
            if STRICT_MODE:
                print("\n  🛑 STRICT_MODE aktiv: Abbruch bei Dependency-Block.")
                break
            pipeline_progress.advance(task_path, "BLOCKED (Dependency)")
            continue

        if task_path in completed_paths and os.path.exists(task_path):
            print(f"  ⏭️  SKIP (bereits erledigt): {task_path}")
            cast_succeeded = build_report["tasks_succeeded"]
            if isinstance(cast_succeeded, list) and task_path not in cast_succeeded:
                cast_succeeded.append(task_path)
            pipeline_progress.advance(task_path, "SKIP (Checkpoint)")
            continue

        # Phase-Header ausgeben wenn neu
        if task.get("phase") != current_phase:
            current_phase = task.get("phase", "")
            print(f"\n\n{'▓'*60}")
            print(f"  PHASE: {current_phase}")
            print(f"{'▓'*60}")
 
        if DRY_RUN:
            print(f"\n  🧪 DRY-RUN VALID: {task_path}")
            completed_paths.add(task_path)
            cast_succeeded = build_report["tasks_succeeded"]
            if isinstance(cast_succeeded, list) and task_path not in cast_succeeded:
                cast_succeeded.append(task_path)
            if task_path in failed_paths_from_checkpoint:
                failed_paths_from_checkpoint.remove(task_path)
            # [Orchestrator]: dry runs must not persist phantom completions to the checkpoint
            pipeline_progress.advance(task_path, "DRY-RUN OK")
            continue

        success, last_feedback = build_file_with_quality_gate(task)
 
        if not success:
            failed_files.append(task_path)
            failed_paths_from_checkpoint.add(task_path)
            cast_failed = build_report["tasks_failed"]
            if isinstance(cast_failed, list):
                cast_failed.append(task_path)
            failure_reasons = build_report.get("failure_reasons")
            if isinstance(failure_reasons, dict) and last_feedback.strip():
                failure_reasons[task_path] = last_feedback[:500]
            print(f"\n  ⚠️  Überspringe {task_path} und fahre fort...")
            # Nicht stoppen – weiterarbeiten und am Ende reporten
            if STRICT_MODE:
                print("  🛑 STRICT_MODE aktiv: Abbruch beim ersten fehlgeschlagenen Build.")
                save_checkpoint_for_tasks(
                    list(completed_paths),
                    list(failed_paths_from_checkpoint),
                    task_fingerprint,
                )
                pipeline_progress.advance(task_path, "FAILED")
                break
            pipeline_progress.advance(task_path, "FAILED (weiter)")
        else:
            completed_paths.add(task_path)
            cast_succeeded = build_report["tasks_succeeded"]
            if isinstance(cast_succeeded, list):
                cast_succeeded.append(task_path)
            if task_path in failed_paths_from_checkpoint:
                failed_paths_from_checkpoint.remove(task_path)
            save_checkpoint_for_tasks(
                list(completed_paths),
                list(failed_paths_from_checkpoint),
                task_fingerprint,
            )
            pipeline_progress.advance(task_path, "APPROVED")

        # Kurze Pause zwischen Dateien
        time.sleep(2)

    set_pipeline_progress(None)
 
    # Abschlussbericht
    print("\n\n" + "█"*60)
    print("█  BUILD ABGESCHLOSSEN                                   █")
    print("█"*60)
    print(
        f"\n  ✅ Erfolgreich: {len(ordered_task_queue) - len(failed_files)}/{len(ordered_task_queue)} Dateien"
    )
 
    if failed_files:
        print(f"\n  ❌ Fehlgeschlagen ({len(failed_files)}):")
        for f in failed_files:
            print(f"     → {f}")
        print("\n  → Diese Dateien manuell prüfen oder Task-Beschreibung verfeinern.")
    else:
        print("\n  🎉 Alle Dateien erfolgreich gebaut!")
        if not DRY_RUN:
            save_checkpoint_for_tasks(list(completed_paths), [], task_fingerprint)
 
    print("\n  🧪 Starte finale Quality Gates...")
    gate_results = run_quality_gates(os.getcwd())
    release_ready = len(failed_files) == 0

    succeeded_paths = build_report.get("tasks_succeeded", [])
    if not isinstance(succeeded_paths, list):
        succeeded_paths = []
    completed_for_triple = sorted(
        set(
            normalize_path(path)
            for path in list(completed_paths)
            if isinstance(path, str) and path.strip()
        )
    )
    triple = compute_triple_consistency(
        get_task_paths(ordered_task_queue),
        completed_for_triple,
        [path for path in succeeded_paths if isinstance(path, str)],
    )
    build_report["triple_consistency"] = triple
    if not triple.get("consistent"):
        if DRY_RUN:
            # [Orchestrator]: dry runs write no files — triple consistency is informational only
            print(
                "     - Triple-Consistency: SKIPPED (Dry-Run, keine Dateien geschrieben)"
            )
        else:
            release_ready = False
            print(
                "     - Triple-Consistency: REJECTED "
                f"(disk={triple.get('disk_count')}, "
                f"checkpoint={triple.get('checkpoint_count')}, "
                f"report={triple.get('report_count_succeeded')})"
            )
    else:
        print("     - Triple-Consistency: PROVED")

    if gate_results:
        build_report["quality_gates"] = gate_results
        for result in gate_results:
            gate = result.get("gate", "Unknown")
            status = result.get("status", "UNKNOWN")
            print(f"     - {gate}: {status}")
            if status in {"REJECTED", "SKIPPED"}:
                release_ready = False
    else:
        print("     - Keine package.json gefunden, Gates übersprungen.")
        release_ready = False

    build_report["release_ready"] = release_ready
    print(f"\n  🚦 Release-Ready: {'JA' if release_ready else 'NEIN'}")

    write_file_atomic(BUILD_REPORT_PATH, json.dumps(build_report, ensure_ascii=False, indent=2))
    print(f"\n  📄 Build-Report gespeichert: {BUILD_REPORT_PATH}")

    print("\n  Nächster Schritt: 'npx expo start' um die App zu sehen.")
    print("█"*60 + "\n")

    # [Orchestrator]: honest exit code so CI/cloud runs fail visibly when not release-ready
    sys.exit(0 if release_ready else 1)
