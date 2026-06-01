import os
import time
import re
import ollama

# Wir bauen die Backticks dynamisch, damit die Chat-Oberfläche den Code sauber anzeigt
ticks = "\x60\x60\x60"

# ---------------------------------------------------------------------
# HILFSFUNKTIONEN (Sicher gegen unvollständige Code-Blöcke)
# ---------------------------------------------------------------------
def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def clean_code(raw: str) -> str:
    """
    Extrahiert verlässlich NUR den reinen Code-Block aus der LLM-Antwort.
    Sorgt dafür, dass keine Markdown-Erklärungen oder Backticks in die Datei geschrieben werden.
    """
    if not raw:
        return ""
        
    # Dynamischer Regex-Ausdruck ohne echte Backticks im Python-Code
    pattern = r"\x60\x60\x60(?:ts|tsx|typescript|javascript|js)?\s*\n(.*?)\x60\x60\x60"
    code_block_match = re.search(pattern, raw, re.DOTALL | re.IGNORECASE)
    
    if code_block_match:
        return code_block_match.group(1).strip()
    
    # Fallback: Falls keine Backticks vorhanden sind, säubere den rohen String zeilenweise
    lines = raw.strip().splitlines()
    if lines and lines[0].startswith("\x60\x60\x60"):
        lines = lines[1:]
    if lines and lines[-1].startswith("\x60\x60\x60"):
        lines = lines[:-1]
    return "\n".join(lines).strip()

# ---------------------------------------------------------------------
# AGENT 1: Der Coder (Lokal - Qwen3 Coder 30B)
# ---------------------------------------------------------------------
def ask_coder(task_description: str, file_path: str, past_critic_feedback: str = "") -> str:
    rules = read_file("instructions.md")

    feedback_block = ""
    if past_critic_feedback:
        feedback_block = f"""
VERGANGENES KRITIKER-FEEDBACK (ZWINGEND korrigieren!):
{past_critic_feedback}
"""

    prompt = f"""Du bist der Senior React Native / Expo / TypeScript Entwickler für StructAI.

DEINE AUFGABE:
Schreibe den vollständigen, lauffähigen Code für die Datei: {file_path}
Anforderung: {task_description}

STRIKTE REGELN AUS DEM GESETZBUCH:
{rules}
{feedback_block}
WICHTIG:
- Antworte AUSSCHLIESSLICH mit reinem Code. 
- Packe den Code zwingend in einen Markdown-Block mit {ticks}tsx und {ticks} am Ende.
- Keine Erklärungen vor oder nach dem Code-Block.
- Der Code muss zu 100% vollständig und lauffähig sein. Keine TODOs, keine Platzhalter.
"""

    # Korrigierte API-Rollen-Struktur für Ollama (nur system/user)
    response = ollama.chat(
        model='qwen3-coder:30b',
        messages=[
            {
                'role': 'system',
                'content': 'Du bist ein hochqualifizierter Senior React Native Entwickler. Schreibe präzisen, sauberen Code gemäß den Anweisungen.'
            },
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )
    
    raw_content = response['message']['content']
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

    response = ollama.chat(
        model='gemma4',
        messages=[
            {
                'role': 'system',
                'content': 'Du bist ein extrem kritischer Tech-Lead. Analysiere den Code tiefgründig und sei unnachgiebig.'
            },
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )
    return response['message']['content']

# ---------------------------------------------------------------------
# DIE ORCHESTRATOR-SCHLEIFE (Quality Gate)
# ---------------------------------------------------------------------
def build_file_with_quality_gate(task_description: str, file_path: str) -> bool:
    print(f"\n{'='*60}")
    print(f"🚀 BUILD: {file_path}")
    print(f"{'='*60}")

    feedback = ""
    max_attempts = 10

    for attempt in range(1, max_attempts + 1):
        print(f"\n  📝 [Versuch {attempt}/{max_attempts}] Coder generiert Code...")
        code = ask_coder(task_description, file_path, feedback)

        # Kurze Pause für VRAM Cooldown vor dem Wechsel zu Gemma
        time.sleep(3)

        print(f"  🔍 [Versuch {attempt}/{max_attempts}] Gemma 4 Kritiker prüft...")
        critic_result = ask_critic(code, file_path)

        print(f"\n  --- KRITIKER ERGEBNIS ---")
        print(f"  {critic_result.strip()}")
        print(f"  -------------------------")

        if "STATUS: PROVED" in critic_result:
            write_file(file_path, code)
            print(f"\n  ✅ APPROVED & GESPEICHERT: {file_path}")
            return True
        else:
            feedback = critic_result
            print(f"\n  ❌ REJECTED. Starte Korrekturversuch...")
            time.sleep(3)

    print(f"\n  💥 FEHLGESCHLAGEN: {file_path} nach {max_attempts} Versuchen.")
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
            "Definiere ein TypeScript-Objekt 'AppTypography' mit Schriftgrößen (xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, display: 36) "
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
    }
]

# ---------------------------------------------------------------------
# MAIN – Startet die autonome Produktionskette
# ---------------------------------------------------------------------
if __name__ == "__main__":
    print("\n" + "█"*60)
    print("█   STRUCTAI AUTONOMOUS BUILD SYSTEM – START              █")
    print("█"*60)
    print(f"\n  📋 {len(TASK_QUEUE)} Dateien in der Queue\n")

    failed_files = []
    current_phase = ""

    for i, task in enumerate(TASK_QUEUE):
        # Phase-Header ausgeben wenn neu
        if task.get("phase") != current_phase:
            current_phase = task.get("phase", "")
            print(f"\n\n{'▓'*60}")
            print(f"  PHASE: {current_phase}")
            print(f"{'▓'*60}")

        success = build_file_with_quality_gate(task["task"], task["path"])

        if not success:
            failed_files.append(task["path"])
            print(f"\n  ⚠️  Überspringe {task['path']} und fahre fort...")

        # Kurze Pause zwischen Dateien
        time.sleep(2)

    # Abschlussbericht
    print("\n\n" + "█"*60)
    print("█   BUILD ABGESCHLOSSEN                                   █")
    print("█"*60)
    print(f"\n  ✅ Erfolgreich: {len(TASK_QUEUE) - len(failed_files)}/{len(TASK_QUEUE)} Dateien")

    if failed_files:
        print(f"\n  ❌ Fehlgeschlagen ({len(failed_files)}):")
        for f in failed_files:
            print(f"     → {f}")
        print("\n  → Diese Dateien manuell prüfen oder Task-Beschreibung verfeinern.")
    else:
        print("\n  🎉 Alle Dateien erfolgreich gebaut!")

    print("\n  Nächster Schritt: 'npx expo start' um die App zu sehen.")
    print("█"*60 + "\n")