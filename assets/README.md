# StructAI – Design-Referenz-Assets

> **Status (2026-06-08):** Externer Nachreich geplant. Dieser Ordner ist die verbindliche
> Ablage für Design-Referenz-Mockups, die in `orchestrator/contracts/design-reference.contract.md`
> und `orchestrator/contracts/product.contract.md` referenziert werden.

## Zweck

Die Mockups in diesem Ordner dienen **ausschließlich** als Layout-, Hierarchie- und
Gamification-Vorlage (Karten, Streak-Kreise, Progress-Balken, dunkle Tab-Bar). **Kein**
Branding, **kein** Produktname, **kein** Copy wird aus den Referenzen übernommen.

## Erwartete Dateien

| Datei | Zweck | Status |
|-------|-------|--------|
| `dashboard-mockup.png` | Profil-Screen-Hierarchie | offen |
| `courses-mockup.png` | Akademie-Karten-Muster | offen |
| `lab-mockup.png` | Prompt-Lab-Input + Score-Karte | offen |
| `tabbar-mockup.png` | Dunkle Tab-Bar mit Ionicons | offen |
| `streak-week.png` | Wochen-Streak-Kreise | offen |
| `orb-system.png` | Energie-Orb-Reihe | offen |
| `splash.png` | App-Splash (1024×1024) | offen |
| `icon.png` | App-Icon (1024×1024) | offen |
| `adaptive-icon.png` | Android adaptive foreground | offen |
| `favicon.png` | Web-Favicon | offen |

## Markensicherheit (bindend)

- NIEMALS Branding aus externen Mockups in `src/` übernehmen.
- Alle UI-Copies sprechen **StructAI**: „Master Prompting. Build Real Intelligence."
- Farben NUR aus `src/shared/theme/colors.ts` (kein Hex in UI-Dateien).
- Akzentfarben: Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`.

## Workflow

1. Designer exportiert Mockups aus Figma/Sketch in 3×-Auflösung.
2. Exportiere mit transparentem Hintergrund (außer Splash/Icon).
3. Lege Datei mit sprechendem Namen in `assets/` ab.
4. Commit mit Prefix `assets:` (kein Code-Touch).
5. Wenn ein Mockup keinen Mehrwert bringt, lösche die Referenz im entsprechenden Contract
   und passe `design-reference.contract.md` an.

## Asset-Specs

- **App-Icon:** 1024×1024 PNG, kein Alpha (App-Store-konform).
- **Adaptive Icon (Android):** 1024×1024 PNG, Safe-Area 66 % Mitte.
- **Splash:** 1242×2436 PNG (iPhone X), Hintergrund `#0F172A` (theme.colors.background.primary).
- **Mockups:** PNG oder JPG, mind. 1242×2688 (iPhone-Pro-Größe).

## Lizenz

Alle Mockups müssen selbst erstellt oder lizenzfrei sein. Fremdmarken-Mockups nur als
**interne** Studien-Vorlage, niemals eingecheckt.
