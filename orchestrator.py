import os
import re
import json
import shutil
import subprocess
import sys
import time
from datetime import UTC, datetime
from typing import Dict, List, Optional, Tuple

import ollama


CODER_MODEL = os.getenv("STRUCTAI_CODER_MODEL", "qwen3-coder:30b")
CRITIC_MODEL = os.getenv("STRUCTAI_CRITIC_MODEL", "gemma4")
DEBUGGER_MODEL = os.getenv("STRUCTAI_DEBUGGER_MODEL", "gemma4")
ARCHITECT_MODEL = os.getenv("STRUCTAI_ARCHITECT_MODEL", "gemma4")
AUDITOR_MODEL = os.getenv("STRUCTAI_AUDITOR_MODEL", "gemma4")
TASKS_CONFIG_PATH = os.getenv("STRUCTAI_TASKS_CONFIG", "orchestrator.tasks.json")
BUILD_REPORT_PATH = os.getenv("STRUCTAI_BUILD_REPORT", "orchestrator.report.json")

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
    if "PROVED" in upper_text:
        return "PROVED"
    return "REJECTED"


def call_local_model(model_name: str, system_prompt: str, user_prompt: str) -> str:
    response = ollama.chat(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    content = response["message"]["content"]
    return content if isinstance(content, str) else str(content)


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
    return "component"


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

    if category in {"screen", "layout"} and "export default" not in code:
        issues.append("Screen/Layout benötigt Default Export.")
    if category == "store" and "validateStoreLogic" not in code:
        issues.append("Store-Regel verletzt: validateStoreLogic() fehlt.")
    if category in {"store", "component", "screen", "layout"}:
        has_async = "async " in code or "fetch(" in code
        has_try_catch = "try" in lowered and "catch" in lowered
        if has_async and not has_try_catch:
            issues.append("Async/API ohne try-catch erkannt.")

    return issues


def get_execution_priority(file_path: str) -> Tuple[int, int]:
    normalized = file_path.replace("\\", "/").lower()
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


def sort_task_queue(tasks: List[Dict[str, str]]) -> List[Dict[str, str]]:
    return sorted(
        tasks,
        key=lambda task: (
            get_execution_priority(task["path"]),
            task.get("phase", ""),
            task["path"],
        ),
    )


def detect_local_models() -> List[str]:
    try:
        models_response = ollama.list()
    except Exception:
        return []
    models: List[str] = []
    for key in ("models",):
        entries = models_response.get(key, [])
        for entry in entries:
            model_name = entry.get("model") or entry.get("name")
            if isinstance(model_name, str):
                models.append(model_name)
    return models


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


def command_exists(command_name: str) -> bool:
    return shutil.which(command_name) is not None


def run_command(command: List[str], cwd: str) -> Tuple[bool, str]:
    try:
        completed = subprocess.run(
            command,
            cwd=cwd,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        output = f"{completed.stdout}\n{completed.stderr}".strip()
        return completed.returncode == 0, output
    except Exception as error:
        return False, str(error)


def run_quality_gates(cwd: str) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    package_json_path = os.path.join(cwd, "package.json")
    if not os.path.exists(package_json_path):
        return results

    gate_commands = [
        ("Typecheck", ["npm", "run", "typecheck"]),
        ("Lint", ["npm", "run", "lint"]),
        ("Test", ["npm", "run", "test"]),
        ("Expo Doctor", ["npx", "expo", "doctor"]),
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
        results.append(
            {
                "gate": gate_name,
                "status": "PROVED" if ok else "REJECTED",
                "output": output[-2000:],
            }
        )
    return results


def load_task_queue(default_queue: List[Dict[str, str]]) -> List[Dict[str, str]]:
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

    valid_tasks: List[Dict[str, str]] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        phase = item.get("phase")
        task = item.get("task")
        path = item.get("path")
        if all(isinstance(v, str) and v.strip() for v in [phase, task, path]):
            valid_tasks.append({"phase": phase, "task": task, "path": path})

    if not valid_tasks:
        print(f"⚠️  {TASKS_CONFIG_PATH} enthält keine gültigen Tasks. Nutze Default-Queue.")
        return default_queue
    print(f"✅ Lade Task-Queue aus {TASKS_CONFIG_PATH} ({len(valid_tasks)} Tasks)")
    return valid_tasks


def ensure_baseline_files() -> None:
    baseline_files = {
        "instructions.md": DEFAULT_INSTRUCTIONS_CONTENT,
        "orchestrator.tasks.json": DEFAULT_TASKS_JSON,
    }
    for path, content in baseline_files.items():
        if not os.path.exists(path):
            write_file(path, content)
            print(f"🧩 Baseline-Datei angelegt: {path}")


def preflight_check() -> Tuple[bool, List[str]]:
    issues: List[str] = []
    local_models = detect_local_models()
    required_models = {CODER_MODEL, CRITIC_MODEL, DEBUGGER_MODEL, ARCHITECT_MODEL, AUDITOR_MODEL}
    missing_models = [
        model for model in required_models if not is_model_available(model, local_models)
    ]
    if missing_models:
        issues.append(f"Fehlende lokale Ollama-Modelle: {', '.join(missing_models)}")

    if not os.path.exists("instructions.md"):
        issues.append("instructions.md fehlt.")

    # npm ist optional: Build soll auch ohne Node-Tooling laufen.
    # Qualitätstests werden später automatisch als SKIPPED markiert.

    return len(issues) == 0, issues
 
# ---------------------------------------------------------------------
# AGENT 1: Der Coder (Lokal - Qwen3 Coder 30B)
# ---------------------------------------------------------------------
def ask_coder(
    task_description: str,
    file_path: str,
    architect_plan: str,
    past_critic_feedback: str = "",
    past_static_feedback: str = "",
) -> str:
    rules = read_file("instructions.md")

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

STRIKTE REGELN AUS DEM GESETZBUCH:
{rules}
{feedback_block}
{static_feedback_block}
WICHTIG:
- Antworte AUSSCHLIESSLICH mit reinem Code. Kein Markdown, keine ```-Blöcke, keine Erklärungen.
- Beginne sofort mit dem ersten Import oder dem ersten Zeichen des Codes.
- Der Code muss zu 100% vollständig und lauffähig sein. Keine TODOs, keine Platzhalter.
"""


    raw_content = call_local_model(
        model_name=CODER_MODEL,
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
    rules = read_file("instructions.md")

    prompt = f"""Du bist der unerbarmherzige Code-Kritiker und Tech-Lead für StructAI.
Deine Mission: Technical Debt um jeden Preis verhindern.
 
DIE GESETZE (instructions.md):
{rules}
 
ZU PRÜFENDE DATEI: {file_path}
GENERIERTER CODE:
{generated_code}
 
Prüfe systematisch:
1. FSD-Architektur korrekt?
2. TypeScript zu 100% (kein 'any')?
3. Keine TODOs oder Platzhalter?
4. SwiftUI-Ästhetik eingehalten (Glassmorphismus, Abrundungen, Dark Mode)?
5. Try-Catch bei allen async Funktionen?
6. Konsistent mit dem Rest des Projekts?
 
ANTWORTE NUR IN DIESEM FORMAT:
STATUS: [PROVED oder REJECTED]
BEGRÜNDUNG: [Bei REJECTED: exakte Mängelliste. Bei PROVED: schreibe nur 'Perfekt.']
"""

    return call_local_model(
        model_name=CRITIC_MODEL,
        system_prompt=(
            "Du bist ein extrem kritischer Tech-Lead. "
            "Analysiere den Code tiefgründig und sei unnachgiebig."
        ),
        user_prompt=prompt,
    )


# ---------------------------------------------------------------------
# AGENT 3: Der Debugger/Fixer (Lokal - standardmäßig Gemma 4)
# ---------------------------------------------------------------------
def ask_debugger(
    current_code: str,
    file_path: str,
    task_description: str,
    critic_feedback: str,
    previous_debugger_feedback: str = "",
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
"""

    raw_content = call_local_model(
        model_name=DEBUGGER_MODEL,
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
def ask_architect(task_description: str, file_path: str) -> str:
    rules = read_file("instructions.md")
    prompt = f"""Du bist der StructAI Architect-Agent.
Erzeuge einen kompakten, umsetzbaren Bauplan für genau eine Datei.

DATEI: {file_path}
TASK: {task_description}

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
    rules = read_file("instructions.md")
    prompt = f"""Du bist der StructAI QA-Auditor.
Fokus: Langzeitstabilität, Wartbarkeit, Integrationssicherheit.

DATEI: {file_path}
TASK: {task_description}

GESETZE:
{rules}

CODE:
{generated_code}

ANTWORTE NUR IN DIESEM FORMAT:
STATUS: [PROVED oder REJECTED]
BEGRÜNDUNG: [Bei PROVED: "Perfekt." | Bei REJECTED: max. 3 nummerierte Punkte]
"""
    return call_local_model(
        model_name=AUDITOR_MODEL,
        system_prompt=(
            "Du bist ein kompromissloser QA-/Reliability-Lead. "
            "Bewerte nur reale technische Risiken und gib präzise, knappe Punkte."
        ),
        user_prompt=prompt,
    )


# ---------------------------------------------------------------------
# DIE ORCHESTRATOR-SCHLEIFE (Quality Gate)
# ---------------------------------------------------------------------
def build_file_with_quality_gate(task_description: str, file_path: str) -> bool:
    print(f"\n{'='*60}")
    print(f"🚀 BUILD: {file_path}")
    print(f"{'='*60}")
 
    max_cycles = int(os.getenv("STRUCTAI_MAX_CYCLES", "7"))
    max_debug_passes_per_cycle = int(os.getenv("STRUCTAI_DEBUG_PASSES", "3"))
    cooldown_seconds = int(os.getenv("STRUCTAI_COOLDOWN_SECONDS", "2"))

    architect_plan = ask_architect(task_description, file_path)
    print("  🧭 Architect-Plan erstellt.")

    last_critic_feedback = ""
    last_debugger_feedback = ""
    last_static_feedback = ""
    last_auditor_feedback = ""
    current_code: Optional[str] = None

    for cycle in range(1, max_cycles + 1):
        print(f"\n  🔁 [Cycle {cycle}/{max_cycles}]")

        if current_code is None or cycle in (1, 4):
            print("  📝 Coder erstellt/erneuert Basis-Code...")
            current_code = ask_coder(
                task_description=task_description,
                file_path=file_path,
                architect_plan=architect_plan,
                past_critic_feedback=last_critic_feedback,
                past_static_feedback=last_static_feedback,
            )
        else:
            print("  🧰 Debugger startet direkt vom letzten Stand...")
            current_code = ask_debugger(
                current_code=current_code,
                file_path=file_path,
                task_description=task_description,
                critic_feedback=last_critic_feedback,
                previous_debugger_feedback=last_debugger_feedback,
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
                previous_debugger_feedback=last_debugger_feedback,
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
        critic_status = extract_status(critic_result)
        print("\n  --- KRITIKER ERGEBNIS ---")
        print(f"  {critic_result.strip()}")
        print("  -------------------------")

        if critic_status == "PROVED":
            print("  🧯 QA-Auditor prüft Integrationsrisiken...")
            auditor_result = ask_auditor(current_code, file_path, task_description)
            auditor_status = extract_status(auditor_result)
            print("  --- AUDITOR ERGEBNIS ---")
            print(f"  {auditor_result.strip()}")
            print("  ------------------------")
            if auditor_status == "PROVED":
                write_file(file_path, current_code)
                print(f"\n  ✅ APPROVED & GESPEICHERT: {file_path}")
                return True
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
                previous_debugger_feedback=last_debugger_feedback,
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
            critic_status = extract_status(critic_result)
            print("    --- RE-CHECK ---")
            print(f"    {critic_result.strip()}")
            print("    ---------------")

            if critic_status == "PROVED":
                auditor_result = ask_auditor(current_code, file_path, task_description)
                auditor_status = extract_status(auditor_result)
                print("    --- AUDITOR RE-CHECK ---")
                print(f"    {auditor_result.strip()}")
                print("    ------------------------")
                if auditor_status == "PROVED":
                    write_file(file_path, current_code)
                    print(f"\n  ✅ APPROVED & GESPEICHERT: {file_path}")
                    return True
                last_auditor_feedback = auditor_result
                last_debugger_feedback = auditor_result
                last_critic_feedback = auditor_result
                continue

            last_debugger_feedback = critic_result
            last_critic_feedback = critic_result
            last_auditor_feedback = ""

    print(f"\n  💥 FEHLGESCHLAGEN: {file_path} nach {max_cycles} Zyklen.")
    print(f"  → Bitte Task-Beschreibung manuell verfeinern.")
    return False
 
# ---------------------------------------------------------------------
# TASK QUEUE – Die vollständige StructAI Build-Reihenfolge
# ---------------------------------------------------------------------
TASK_QUEUE = [
 
    # ── PHASE 1: SHARED FOUNDATION ──────────────────────────────────
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/theme/typography.ts. "
            "Definiere ein TypeScript-Objekt 'AppTypography' mit Schriftgrößen (xs, sm, md, lg, xl, xxl, display) "
            "und Schriftgewichten (regular: '400', medium: '500', semibold: '600', bold: '700'). "
            "Dark Mode First, SwiftUI-Style. Named Export."
        ),
        "path": "src/shared/theme/typography.ts"
    },
    {
        "phase": "1 – Shared Foundation",
        "task": (
            "Erstelle src/shared/theme/index.ts als zentralen Re-Export für alle Theme-Dateien. "
            "Importiere und re-exportiere AppColors aus './colors' und AppTypography aus './typography'. "
            "Exportiere außerdem ein kombiniertes 'theme'-Objekt mit colors und typography."
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
 
# ---------------------------------------------------------------------
# MAIN – Startet die autonome Produktionskette
# ---------------------------------------------------------------------
if __name__ == "__main__":
    ensure_baseline_files()
    preflight_ok, preflight_issues = preflight_check()
    if not preflight_ok:
        print("\n" + "!" * 60)
        print("! PRE-FLIGHT FEHLER")
        print("!" * 60)
        for issue in preflight_issues:
            print(f"- {issue}")
        print("\nBuild abgebrochen. Bitte Preflight-Probleme beheben und neu starten.")
        sys.exit(1)

    raw_queue = load_task_queue(TASK_QUEUE)
    ordered_task_queue = sort_task_queue(raw_queue)
    build_report: Dict[str, object] = {
        "timestamp": datetime.now(UTC).isoformat(),
        "models": {
            "coder": CODER_MODEL,
            "architect": ARCHITECT_MODEL,
            "critic": CRITIC_MODEL,
            "debugger": DEBUGGER_MODEL,
            "auditor": AUDITOR_MODEL,
        },
        "tasks_total": len(ordered_task_queue),
        "tasks_failed": [],
        "quality_gates": [],
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
 
    failed_files = []
    current_phase = ""
 
    for i, task in enumerate(ordered_task_queue):
        # Phase-Header ausgeben wenn neu
        if task.get("phase") != current_phase:
            current_phase = task.get("phase", "")
            print(f"\n\n{'▓'*60}")
            print(f"  PHASE: {current_phase}")
            print(f"{'▓'*60}")
 
        success = build_file_with_quality_gate(task["task"], task["path"])
 
        if not success:
            failed_files.append(task["path"])
            cast_failed = build_report["tasks_failed"]
            if isinstance(cast_failed, list):
                cast_failed.append(task["path"])
            print(f"\n  ⚠️  Überspringe {task['path']} und fahre fort...")
            # Nicht stoppen – weiterarbeiten und am Ende reporten
 
        # Kurze Pause zwischen Dateien
        time.sleep(2)
 
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
 
    print("\n  🧪 Starte finale Quality Gates...")
    gate_results = run_quality_gates(os.getcwd())
    release_ready = len(failed_files) == 0
    if gate_results:
        build_report["quality_gates"] = gate_results
        for result in gate_results:
            gate = result.get("gate", "Unknown")
            status = result.get("status", "UNKNOWN")
            print(f"     - {gate}: {status}")
            if status == "REJECTED":
                release_ready = False
    else:
        print("     - Keine package.json gefunden, Gates übersprungen.")
        # Ohne Node-Projekt können diese Gates nicht bewertet werden.
        # Release-Ready bleibt dann vom Datei-Build-Erfolg abhängig.

    build_report["release_ready"] = release_ready
    print(f"\n  🚦 Release-Ready: {'JA' if release_ready else 'NEIN'}")

    write_file(BUILD_REPORT_PATH, json.dumps(build_report, ensure_ascii=False, indent=2))
    print(f"\n  📄 Build-Report gespeichert: {BUILD_REPORT_PATH}")

    print("\n  Nächster Schritt: 'npx expo start' um die App zu sehen.")
    print("█"*60 + "\n")
