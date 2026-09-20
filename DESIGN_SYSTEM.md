# Rafeeq · رفيق — Design System

Built by the Saudi Gastroenterology Association. The single source of truth for the IBD companion app's visual language.

## How to get this into Figma (free)
The Figma file **Rafeeq Design System (SGA)** exists at https://www.figma.com/design/kBhreEDJEYQHK5oqttnGrB but is empty — authoring it through the connector hit the **Figma Starter-plan MCP tool-call limit** (a hard cap that needs a paid Figma plan to lift). Instead, recreate every variable in seconds with the free **Tokens Studio for Figma** plugin:

1. Open the file → Plugins → run **Tokens Studio for Figma**.
2. In the plugin: ⚙ → *Import* → upload `design-tokens.json`.
3. It creates three sets — `global` (primitives, spacing, radius, type), `light`, `dark` — and two themes.
4. Click *Create variables / styles* to push them to native Figma variables.

The same tokens already power the live app via `tokens.css`, so Figma and code stay in lockstep.

## Color

### Primitives
| Token | Hex |
|---|---|
| teal/300 | #1FB6A6 |
| teal/500 | #00897B |
| teal/600 | #006B61 |
| navy/700 | #17406F |
| navy/900 | #0E2A47 |
| ink/900 | #16202B |
| gray/500 | #5B6B79 |
| gray/200 | #E2EAE8 |
| surface/0 | #FBFDFC |
| bg/0 | #F4F8F7 |
| amber/500 | #E0A23D |
| green/500 | #2E9E6B |
| red/500 | #CC5B45 |
| purple/500 | #7C5CFF |

### Semantic (aliased — switch by mode)
| Token | Light | Dark |
|---|---|---|
| color/accent | teal/500 | teal/500 |
| color/accent-strong | teal/600 | teal/300 |
| color/bg | bg/0 | navy/900 |
| color/surface | surface/0 | navy/700 |
| color/text | ink/900 | white |
| color/text-muted | gray/500 | gray/500 |
| color/border | gray/200 | navy/700 |
| color/success | green/500 | green/500 |
| color/warning | amber/500 | amber/500 |
| color/danger | red/500 | red/500 |
| color/disk | purple/500 | purple/500 |

`disk` is reserved for the IBD-Disk instrument so it never collides with status colors.

## Typography
Headings use a serif (Georgia) for warmth; UI/body uses a sans (Arial). Arabic falls back to the system Arabic stack with the same sizes.

| Style | Font | Size / line |
|---|---|---|
| display | Georgia Bold | 30 / 1.2 |
| h2 | Georgia Bold | 20 / 1.3 |
| title | Arial Bold | 16 / 1.4 |
| body | Arial | 14 / 1.55 |
| small | Arial | 12 / 1.5 |
| caption | Arial | 11 / 1.5 |

## Spacing & radius
Spacing: xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 (px).
Radius: sm 8 · md 12 · lg 16 · full 999 (px). Cards use `lg`; chips/pills use `full`.

## Components (recipes)
- **Card** — surface fill, 1px border, radius lg, padding lg. The base container for every screen section.
- **Button (primary)** — accent fill, white text, radius md, padding md/lg. Hover → accent-strong.
- **Chip / pill** — surface fill, border, radius full, small text. Used for food tags, filters, language toggle.
- **Tab bar** — bottom nav, surface fill, top border; active item uses accent.
- **Scale selector** — 0–10 button row for IBD-Disk (purple/`disk`), 0 always selectable, higher = worse.
- **Sheet** — bottom-anchored surface, radius lg top corners, used for loggers and detail views.

## Rules
- RTL is first-class: every layout mirrors for Arabic via `dir="rtl"`.
- Never hardcode a color in a component — bind to a semantic token.
- Non-medical: no color should imply a diagnosis or risk verdict; status colors describe logged values only.
