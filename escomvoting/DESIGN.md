---
version: 2.0
name: ESCOM Voting — Oceanic
description: |
  A bright, trust-forward marketing identity for the ESCOM Voting platform. The home page is built as a vertical journey from a deep-navy cinematic hero (radial gradient orbs, dotted grid mask, parallax scroll) into clean white feature surfaces, an ocean-cyan process band, a saturated navy stats wall, an archive section of closed elections, and a navy→cyan gradient final CTA card. The system is anchored by a four-stop oceanic palette — navy `#050C9C`, electric blue `#3572EF`, sky cyan `#3ABEF9`, ice `#A7E6FF` — used as both UI chrome and as gradient material for every "moment" surface. Iconography is Lucide; motion is Framer Motion (parallax, orb drift, viewport-staggered entries). No emojis appear in the chrome.

colors:
  navy:          "#050C9C"   # deepest brand color · hero base · CTA card base · stats wall · primary text on white
  navy-deep:     "#040A7A"   # gradient hand-off shade between navy and the page surface
  blue:          "#3572EF"   # primary action · headings accent · link color · gradient mid-stop
  cyan:          "#3ABEF9"   # secondary accent · status dots · stat unit color · gradient hand-off
  ice:           "#A7E6FF"   # tertiary accent · hero body text on navy · ambient glow · soft card tint
  white:         "#ffffff"   # primary surface for content sections · CTA pill background
  ink:           "#050C9C"   # body headings on white surfaces (navy doubles as ink)
  body:          "#3a4a6b"   # default paragraph color on white surfaces (cool slate)
  mute:          "#6b7a99"   # metadata and tertiary copy on white surfaces
  error-bg:      "#fee"      # inline error banner background
  error-fg:      "#c00"      # inline error banner text
  navy-soft:     "rgba(5,12,156,0.10)"
  cyan-soft:     "rgba(58,190,249,0.20)"
  ice-soft:      "rgba(167,230,255,0.33)"
  hairline-cyan: "rgba(58,190,249,0.27)"   # card borders on white surfaces
  hairline-ice:  "rgba(167,230,255,0.33)"  # ambient borders on tinted surfaces
  glow-ice:      "rgba(167,230,255,0.55)"  # orb / CTA glow base
  overlay-white: "rgba(255,255,255,0.08)"  # translucent CTA on navy
  overlay-ice:   "rgba(167,230,255,0.07)"  # hero badge backdrop

gradients:
  hero:          "linear-gradient(135deg, #050C9C 0%, #0a1ab3 45%, #3572EF 100%)"
  cta-card:      "linear-gradient(135deg, #050C9C 0%, #3572EF 60%, #3ABEF9 100%)"
  step-bubble:   "linear-gradient(135deg, #050C9C 0%, #3572EF 100%)"
  text-cyan:     "linear-gradient(120deg, #3ABEF9 0%, #A7E6FF 100%)"   # used on the highlighted hero word
  process-bg:    "linear-gradient(180deg, rgba(167,230,255,0.33) 0%, #ffffff 100%)"
  feature-card:  "linear-gradient(135deg, rgba(167,230,255,0.13) 0%, rgba(58,190,249,0.07) 100%)"
  step-line:     "linear-gradient(90deg, #050C9C, #3572EF, #3ABEF9, #A7E6FF)"
  orb-cyan:      "radial-gradient(circle, rgba(58,190,249,0.4) 0%, transparent 70%)"
  orb-blue:      "radial-gradient(circle, rgba(53,114,239,0.4) 0%, transparent 70%)"
  orb-ice:       "radial-gradient(circle, rgba(167,230,255,0.33) 0%, transparent 70%)"

typography:
  display-xl:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   clamp(2.5rem, 6vw, 5.5rem)
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.04em
    use: hero headline
  display-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   clamp(2rem, 4.5vw, 3.5rem)
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.03em
    use: section headline, final CTA headline
  display-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   clamp(2rem, 4vw, 3.25rem)
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.03em
    use: features and process section headings
  display-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   clamp(1.75rem, 3vw, 2.75rem)
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.03em
    use: tertiary section headings (closed elections)
  stat-xl:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   clamp(2.5rem, 5vw, 4rem)
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
    fontVariantNumeric: tabular-nums
    use: stats band big numbers
  heading-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   1.25rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
    use: feature card titles, election card titles
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   1.15rem
    fontWeight: 400
    lineHeight: 1.6
    use: hero sub-paragraph (on navy)
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   1rem
    fontWeight: 400
    lineHeight: 1.65
    use: default paragraph on white
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   0.875rem
    fontWeight: 400
    lineHeight: 1.55
    use: step description, secondary copy
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   0.75rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.05em
    use: card metadata, status pill text
  eyebrow:
    fontFamily: Inter, system-ui, sans-serif
    fontSize:   0.75rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.18em
    textTransform: uppercase
    use: section eyebrow over each headline
  step-tag:
    fontFamily: ui-monospace, "JetBrains Mono", monospace
    fontSize:   0.75rem
    fontWeight: 600
    letterSpacing: 0.1em
    use: "PASO 01..04" labels under each step bubble

rounded:
  none:   0px
  sm:     6px       # pills, status dots
  md:     12px      # small inline buttons (none currently used)
  lg:     16px      # feature card icon tile (12px radius via rounded-xl)
  xl:     20px      # election card, feature card (rounded-2xl)
  hero:   32px      # the giant final CTA card (rounded-[2rem])
  pill:   9999px    # all CTAs, status chips, eyebrow badge

spacing:
  xxs:   2px
  xs:    4px
  sm:    8px
  md:    12px
  lg:    16px
  xl:    24px
  xxl:   32px
  section-sm: 64px
  section:    96px     # default vertical rhythm between sections
  section-lg: 128px    # used as py-32 (8rem) for white feature/process/closed/cta sections

motion:
  hero-parallax:     "useScroll → useTransform(scrollY, [0,400], [0,80]) on y; opacity [1 → 0.4] over [0,300]"
  hero-stagger:      "0.5s → 0.7s entry, delays 0 / 0.1 / 0.25 / 0.4 / 0.55"
  orb-drift:         "infinite x/y oscillation 18–25s easeInOut"
  card-enter:        "opacity 0→1, y 30→0 over 0.5s with stagger delay i * 0.08"
  step-enter:        "opacity 0→1, y 24→0 over 0.5s with stagger delay i * 0.12"
  card-hover:        "translate-y -1, shadow grows; group-hover scales icon tile 1.10x"
  link-arrow:        "icon translateX +4px on group-hover"
  gap-grow:          "Link gap 1.5→2.5 px on hover for archive 'Ver todas' link"

components:
  hero-band:
    background:   "{gradients.hero}"
    minHeight:    100vh
    decoration:   "three drifting radial orbs (cyan, blue, ice) + dotted SVG grid masked with radial fade"
    padding:      "pt-32 pb-24, max-w-7xl, center column"
    bottomFade:   "linear-gradient(180deg, transparent 0%, {colors.white} 100%) over absolute h-32 strip"
  hero-eyebrow-badge:
    background:   "{colors.overlay-ice}"
    border:       "1px solid rgba(167,230,255,0.33)"
    textColor:    "{colors.ice}"
    rounded:      "{rounded.pill}"
    padding:      "6px 16px"
    leadingIcon:  "Sparkles (lucide) 14px {colors.ice}"
    typography:   "{typography.eyebrow}"
  hero-headline:
    typography:   "{typography.display-xl}"
    textColor:    "{colors.white}"
    accentSpan:   "the word 'criptográfica' filled with {gradients.text-cyan} (background-clip:text)"
    maxWidth:     "20ch"
  hero-subcopy:
    typography:   "{typography.body-lg}"
    textColor:    "{colors.ice}"
    maxWidth:     "42rem"
  button-primary-light:
    background:   "{colors.white}"
    textColor:    "{colors.navy}"
    rounded:      "{rounded.pill}"
    padding:      "14px 28px"
    typography:   font-medium
    shadow:       "shadow-lg → shadow-xl on hover; translate-y -2px on hover"
    trailingIcon: "ArrowRight (lucide) 18px, translateX +4px on hover"
    use:          hero primary CTA · final CTA card primary CTA
  button-secondary-glass:
    background:   "{colors.overlay-white}"
    border:       "1px solid rgba(167,230,255,0.27)"
    textColor:    "{colors.white}"
    rounded:      "{rounded.pill}"
    padding:      "14px 28px"
    backdrop:     "blur-md"
    trailingIcon: "ArrowUpRight (lucide) 18px"
    use:          hero secondary CTA · final CTA card secondary CTA
  hero-trust-row:
    layout:       "flex wrap, gap-x-8 gap-y-3"
    textColor:    "rgba(167,230,255,0.8)"
    item:         "CheckCircle2 (lucide) 16px in {colors.cyan} + text {typography.body-sm}"
    use:          three trust statements under hero CTAs
  section-eyebrow:
    typography:   "{typography.eyebrow}"
    textColor:    "{colors.blue}"
  feature-grid:
    grid:         "md:grid-cols-2 gap-5"
    background:   "{colors.white}"
    padding:      "py-32 px-6, max-w-7xl"
  feature-card:
    background:   "{gradients.feature-card}"
    border:       "1px solid {colors.hairline-cyan}"
    rounded:      "{rounded.xl}"
    padding:      "p-8"
    iconTile:
      size:       48px
      background: "{colors.navy}"
      iconColor:  "{colors.ice}"
      rounded:    "{rounded.lg}"
      iconSize:   22px
    title:        "{typography.heading-lg} · {colors.navy}"
    body:         "{typography.body-md} · {colors.body}"
    decoration:   "absolute -bottom-16 -right-16 40x40 cyan blur orb at opacity 0.4, lifts to 0.7 on group-hover"
    hover:        "translate-y -1, icon tile scales 1.10x"
  process-band:
    background:   "{gradients.process-bg}"
    padding:      "py-32"
    timeline:     "absolute 2px hairline using {gradients.step-line}, positioned at the row of step bubbles"
  step-bubble:
    size:         56px
    background:   "{gradients.step-bubble}"
    color:        "{colors.white}"
    rounded:      "{rounded.pill}"
    shadow:       "shadow-lg"
    icon:         "lucide icon (KeyRound, Vote, BarChart3, Award) 22px"
  step-tag:
    typography:   "{typography.step-tag}"
    color:        "{colors.blue}"
    text:         "PASO 01..04"
  stats-band:
    background:   "{colors.navy}"
    decoration:   "radial gradient overlay: 20%/30% blue + 80%/70% cyan at opacity 0.3"
    padding:      "py-24, max-w-7xl"
    grid:         "grid-cols-2 md:grid-cols-4 gap-8"
  stat-figure:
    number:       "{typography.stat-xl} · {colors.white}"
    unit:         "{colors.cyan} · 0.5em relative size · 0.15em left margin"
    label:        "{typography.body-sm} · {colors.ice}"
  archive-section:
    background:   "{colors.white}"
    padding:      "py-32 px-6, max-w-7xl"
    headerLayout: "flex justify-between items-end with archive 'Ver todas' arrow link"
  election-card:
    background:   "{colors.white}"
    border:       "1px solid {colors.hairline-cyan}"
    rounded:      "{rounded.xl}"
    padding:      "p-7"
    hover:        "translate-y -1, shadow-xl"
    statusPill:
      tallied:    "background rgba(58,190,249,0.13), dot {colors.blue}"
      closed:     "background rgba(167,230,255,0.33), dot {colors.cyan}"
      text:       "{colors.navy} · {typography.caption}"
    title:        "{typography.heading-lg} · {colors.navy}, line-clamp-2"
    body:         "{typography.body-sm} · {colors.body}, line-clamp-2"
    meta:         "Calendar 13px {colors.mute} + locale date · 'Ver detalle' link {colors.blue} with ArrowUpRight 13px"
  election-skeleton:
    height:       208px
    background:   "{colors.ice-soft}"
    border:       "1px solid rgba(58,190,249,0.13)"
    rounded:      "{rounded.xl}"
    motion:       "animate-pulse"
  final-cta-card:
    background:   "{gradients.cta-card}"
    rounded:      "{rounded.hero}"
    padding:      "p-12 md:p-20"
    decoration:   "single drifting ice orb at top-right + dotted SVG grid mask"
    leadingIcon:  "Vote (lucide) 42px {colors.ice}"
    headline:     "{typography.display-lg} · {colors.white}, maxWidth 22ch"
    subcopy:      "{colors.ice} · 1.05rem · maxWidth 36rem"
  error-banner:
    background:   "{colors.error-bg}"
    textColor:    "{colors.error-fg}"
    rounded:      "{rounded.lg}"
    padding:      "p-4"
    typography:   "{typography.body-sm}"
---

## Overview

ESCOM Voting's marketing home is a **vertical journey from saturated navy to clean white and back**. Six bands stack in this order:

1. **Hero** — full-viewport navy → electric-blue gradient with drifting cyan/blue/ice radial orbs, a dotted SVG grid masked with a radial fade, a parallax-translated central column (`useScroll` → `useTransform`), an ice-tinted eyebrow badge, a `display-xl` headline whose accent word is filled with a cyan→ice text-clip gradient, a white pill primary CTA and a glassy ice-bordered secondary CTA, and a three-item trust row anchored by `CheckCircle2` glyphs in cyan.
2. **Features** — pure white surface with a 2-up grid of softly tinted cards (`feature-card` linear ice→cyan wash), each carrying a 48px navy icon tile in `rounded-lg`, a heading in navy, body in cool slate, and a cyan blur orb tucked into the bottom-right corner that brightens on group-hover.
3. **Process** — ice-tinted gradient surface fading back to white, with a 4-up step row connected by a thin horizontal `step-line` gradient (navy→blue→cyan→ice). Each step is a 56px navy→blue bubble with a Lucide glyph, a monospace `PASO 0n` tag in blue, a navy title, and a short body line.
4. **Stats** — full-bleed navy band with two radial gradient overlays (blue at 20/30, cyan at 80/70). Numbers render in tabular-nums white with their unit (`bit`, `%`, etc.) in cyan at 0.5em.
5. **Closed Elections (archive)** — white surface, 3-up grid of `election-card`s with cyan hairline borders and an ambient bottom-right glow on hover. Status is communicated through a colored dot pill (`TALLIED` → blue dot, `CLOSED` → cyan dot). Loading state is an `animate-pulse` ice-tinted skeleton.
6. **Final CTA** — a `rounded-[2rem]` hero-radius card filled with the navy→blue→cyan gradient, an ice orb drifting into the top-right corner, the dotted SVG grid layered on top, a 42px Lucide `Vote` icon as the visual anchor, and the same two-CTA pair as the hero (white primary pill + glassy secondary).

**Key characteristics:**
- **Four-stop oceanic palette**: navy `#050C9C` → blue `#3572EF` → cyan `#3ABEF9` → ice `#A7E6FF`. Used in this exact order as the gradient progression on the hero and the final CTA card.
- **Two surface modes, alternated**: saturated navy/gradient (hero, stats, CTA card) and clean white (features, archive, page background). The process band is the sole transition surface (ice-tinted → white) bridging the two.
- **No emoji anywhere in chrome.** Iconography is exclusively Lucide React: `ShieldCheck`, `Lock`, `Vote`, `Eye`, `Fingerprint`, `Sparkles`, `ArrowRight`, `ArrowUpRight`, `CheckCircle2`, `KeyRound`, `BarChart3`, `Users`, `ChevronRight`, `Calendar`, `Award`.
- **CTA pill vocabulary is two-tone**: a white pill on navy (primary), a glass-tinted ice-bordered pill on navy (secondary). Both are `rounded-full` and consistent across the hero and the final CTA card.
- **All elevation is built from gradients and orb glows.** There are no plain drop shadows in the chrome — shadows are reserved for the white CTA pill and `election-card` hover state.
- **Framer Motion drives the page**: viewport-staggered entries on every grid, parallax on the hero, and three infinite-loop orb drifts behind the hero gradient. Motion is decorative, not load-bearing — the page is functional with motion disabled.

## Colors

### Brand palette (the four stops)
- **Navy** (`{colors.navy}` — `#050C9C`): the deep brand color. Hero base, stats wall, final CTA card base, primary headings on white, step bubble origin, election card title color.
- **Blue** (`{colors.blue}` — `#3572EF`): the primary action and link color. Section eyebrows, step-bubble gradient end-stop, "Ver todas" archive link, election-card "Ver detalle" link, hero-gradient mid-stop.
- **Cyan** (`{colors.cyan}` — `#3ABEF9`): the secondary accent and "alive" color. Trust-row glyphs in hero, stat-unit text, status dots, hairline color on white cards, gradient hand-off.
- **Ice** (`{colors.ice}` — `#A7E6FF`): the tertiary glow. Hero body text on navy, ambient orb glow, soft card tint, final CTA leading icon, all secondary text on navy surfaces.

### Surface
- **White** (`{colors.white}` — `#ffffff`): primary content surface for the features, archive, and outer wrapper of the final CTA. Also the primary CTA pill background.
- **Process gradient surface** (`{gradients.process-bg}`): a fading ice-tinted surface that softens the transition from the saturated stats band into the white archive surface.

### Text (on white)
- **Ink/Navy** (`{colors.navy}` — `#050C9C`): every heading on white surfaces — features, process, archive headlines.
- **Body** (`{colors.body}` — `#3a4a6b`): default paragraph color on white surfaces.
- **Mute** (`{colors.mute}` — `#6b7a99`): metadata, election-card date, "Aún no hay elecciones cerradas" empty-state.

### Text (on navy)
- **White** (`{colors.white}` — `#ffffff`): hero headline, stat numbers, all CTAs on navy.
- **Ice** (`{colors.ice}` — `#A7E6FF`): hero subcopy, stat label, final CTA subcopy, hero eyebrow.
- **Ice 80%** (`rgba(167,230,255,0.8)`): hero trust-row text — slightly translucent for hierarchy.

### Semantic
- **Error** (`{colors.error-bg}` / `{colors.error-fg}`): inline error banner inside the archive section when the elections fetch fails.

### Borders
- **Hairline Cyan** (`{colors.hairline-cyan}` — `rgba(58,190,249,0.27)`): the universal card border on white surfaces — feature cards and election cards.
- **Hairline Ice** (`{colors.hairline-ice}` — `rgba(167,230,255,0.33)`): ambient borders on translucent overlays (the hero eyebrow badge, the glass secondary CTA).

### Gradients
The palette is used as gradient material in six specific places. All are oceanic — they progress from navy through blue/cyan into ice, never reversing.
- **Hero band** (`{gradients.hero}`): the 135° navy → 0a1ab3 → blue diagonal that fills the entire first viewport.
- **Final CTA card** (`{gradients.cta-card}`): a tighter 135° navy → blue → cyan inside the `rounded-[2rem]` card.
- **Step bubble** (`{gradients.step-bubble}`): 135° navy → blue inside each 56px step circle.
- **Cyan text fill** (`{gradients.text-cyan}`): a 120° cyan → ice gradient, clipped to the highlighted hero word via `WebkitBackgroundClip:text`.
- **Process surface** (`{gradients.process-bg}`): a vertical ice→white fade that bridges the stats wall and the archive section.
- **Step line** (`{gradients.step-line}`): a horizontal navy → blue → cyan → ice 2px line connecting the four step bubbles.
- **Feature card wash** (`{gradients.feature-card}`): a 135° ice-13% → cyan-7% wash giving the feature cards their soft tint without making them feel like flat panels.
- **Orbs** (`{gradients.orb-cyan}`, `{gradients.orb-blue}`, `{gradients.orb-ice}`): three radial gradients used as decorative drifting blur orbs in the hero. Same orb pattern reappears at smaller scale on the final CTA card.

## Typography

### Font family
Inter, system-ui sans-serif. No custom font features required. Numbers in the stats band use `tabular-nums` so the four-stat row aligns vertically.

### Hierarchy

| Token | Size | Weight | Line H. | Letter Sp. | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | clamp(2.5rem, 6vw, 5.5rem) | 600 | 1.02 | -0.04em | Hero headline |
| `{typography.display-lg}` | clamp(2rem, 4.5vw, 3.5rem) | 600 | 1.05 | -0.03em | Final CTA headline |
| `{typography.display-md}` | clamp(2rem, 4vw, 3.25rem) | 600 | 1.05 | -0.03em | Section headlines (features, process) |
| `{typography.display-sm}` | clamp(1.75rem, 3vw, 2.75rem) | 600 | 1.1 | -0.03em | Archive section heading |
| `{typography.stat-xl}` | clamp(2.5rem, 5vw, 4rem) | 600 | 1 | -0.04em | Stat numbers (tabular-nums) |
| `{typography.heading-lg}` | 1.25rem | 600 | 1.3 | -0.02em | Feature & election card titles |
| `{typography.body-lg}` | 1.15rem | 400 | 1.6 | 0 | Hero subcopy |
| `{typography.body-md}` | 1rem | 400 | 1.65 | 0 | Default body on white |
| `{typography.body-sm}` | 0.875rem | 400 | 1.55 | 0 | Step body, secondary copy |
| `{typography.caption}` | 0.75rem | 500 | 1.4 | 0.05em | Status pill text, metadata |
| `{typography.eyebrow}` | 0.75rem | 600 | 1.2 | 0.18em UPPER | Section eyebrow ("Por qué", "Cómo funciona", "Archivo público", "ESCOM · Voto digital seguro") |
| `{typography.step-tag}` | 0.75rem | 600 mono | 1.4 | 0.1em | "PASO 01..04" step labels |

### Principles
- **Aggressively tight letter-spacing on display sizes (-0.03 to -0.04em).** Display headlines are dense and confident, in contrast to the open `0.18em` eyebrows that label each section above the headline.
- **Hierarchy is built through size + color, not weight.** Every heading is 600; differentiation comes from the navy↔white inversion and the absolute scale jump from `display-xl` (hero) down to `heading-lg` (card titles).
- **Tabular nums on the stats wall** so the four numbers visually align even with different glyph widths.

## Layout

### Spacing tokens
`{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section-sm}` 64px · `{spacing.section}` 96px · `{spacing.section-lg}` 128px.

### Section rhythm
The four white/tinted sections (features, process, archive, final CTA) use `py-32` (128px vertical). The stats band uses `py-24` (96px). The hero is `min-h-screen` with `pt-32 pb-24` inside its parallax column. Inside any section, the column is capped to `max-w-7xl` with `px-6` outer gutters.

### Grids
- **Features**: `md:grid-cols-2 gap-5` — 2-up at desktop, 1-up at mobile.
- **Process**: `md:grid-cols-4 gap-6` — 4-up at desktop with the step-line gradient connecting bubbles, 1-up stacked at mobile (step line hides on `md` breakpoint).
- **Stats**: `grid-cols-2 md:grid-cols-4 gap-8` — 4-up at desktop, 2-up at mobile.
- **Closed Elections**: `md:grid-cols-3 gap-5` — 3-up at desktop, 1-up at mobile.
- **Hero, final CTA**: single centered column, no grid.

### Whitespace philosophy
Whitespace is generous (`py-32` between content bands) but the transitions are choreographed. The page never just drops from saturated navy onto white — there's always a `bottom-fade` strip on the hero blending into the next section's background, or an `ice-tinted` process surface acting as the bridge from the stats wall into the white archive. The result is one continuous vertical scroll, not six disconnected cards.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for canvas-on-canvas blocks, stats band, hero copy |
| 1 — Hairline cyan | 1px solid `{colors.hairline-cyan}` | Feature cards, election cards on white |
| 2 — Hairline ice | 1px solid `{colors.hairline-ice}` | Hero eyebrow badge, glass secondary CTA |
| 3 — Drop shadow | `shadow-lg` → `shadow-xl` on hover | White CTA pills only; election cards on hover only |
| 4 — Orb glow | Radial gradient blur orb behind the chrome | Hero (3 drifting), feature card corner, final CTA corner |

The system has no surface-color ladder. Depth is instead built from **gradients and ambient glow**: the navy→blue hero gradient feels like infinite depth behind the parallax content; the cyan corner orbs on feature cards visually push the card forward without a shadow. Shadow is reserved exclusively for the white CTA pill and the election card hover state — both moments where the user is actively interacting and a physical lift is appropriate.

### Decorative depth
- **Hero orbs** — three independent infinite-loop radial-gradient blur orbs (cyan, blue, ice) drift across the hero band at 18s / 22s / 25s easing.
- **Grid mask** — a 28px-pitch dotted SVG pattern masked with a radial fade. Used on the hero band and the final CTA card.
- **Final-CTA orb** — a single ice radial orb drifts in the top-right of the CTA card on a 14s loop.
- **Feature card glow** — a stationary cyan blur orb tucked into the `-bottom-16 -right-16` corner of every feature card, scaling its opacity from 0.4 to 0.7 on group-hover.

## Shapes

### Border radius scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands (hero gradient, stats wall, page wrapper) |
| `{rounded.sm}` | 6px | Small inline elements, status dots |
| `{rounded.md}` | 12px | Soft inline buttons (currently reserved) |
| `{rounded.lg}` | 16px | Feature-card icon tile (`rounded-xl` in Tailwind) |
| `{rounded.xl}` | 20px | Feature cards, election cards (`rounded-2xl` in Tailwind) |
| `{rounded.hero}` | 32px | Final CTA card (`rounded-[2rem]`) |
| `{rounded.pill}` | 9999px | Every CTA pill, status chip, eyebrow badge, step bubble |

The vocabulary clusters tight (12–20px on cards) with the final CTA card jumping to 32px to act as the visual "anchor" before the footer. Every CTA is `rounded-full` — pills are the system's primary action vocabulary.

### Iconography geometry
- **Lucide React** is the only icon set in the chrome. Stroke icons, 1.5px default stroke.
- **Sizes used**: 13px (election-card meta), 14px (hero eyebrow Sparkles), 16px (trust row CheckCircle2 + chevrons), 18px (CTA arrows), 22px (feature icon tile + step bubble + Users on election card), 42px (final CTA Vote icon).
- No emojis appear in the chrome.

## Components

> Default and active/pressed states only. Hover behavior is documented per component.

### Buttons / CTAs

**`button-primary-light`** — the universal hero & final CTA primary action.
- Background `{colors.white}`, text `{colors.navy}`, `{rounded.pill}`, padding `14px 28px`, `shadow-lg`.
- Trailing icon: Lucide `ArrowRight` at 18px that translates +4px on group-hover.
- Hover: `shadow-xl` + `-translate-y-0.5`.
- Labels: "Emitir mi voto" (hero), "Acceder al sistema" (final CTA).

**`button-secondary-glass`** — the secondary action that pairs with the primary on every navy surface.
- Background `{colors.overlay-white}`, 1px `{colors.hairline-ice}` border, text `{colors.white}`, `backdrop-blur-md`, same padding and radius as the primary.
- Trailing icon: Lucide `ArrowUpRight` at 18px.
- Labels: "Ver resultados públicos" (hero), "Explorar resultados" (final CTA).

### Section eyebrows & headlines
Every section opens with a `{typography.eyebrow}` label in `{colors.blue}` followed by a `{typography.display-md}` or `{typography.display-sm}` headline in `{colors.navy}`. The headlines on dark sections (hero, final CTA) instead use `{colors.white}` with the accent word filled by `{gradients.text-cyan}`.

### Feature cards
**`feature-card`** — 2-up grid card.
- Background `{gradients.feature-card}`, 1px `{colors.hairline-cyan}` border, `{rounded.xl}`, padding 32px (`p-8`).
- Icon tile: 48×48 `{colors.navy}` background with Lucide icon at 22px in `{colors.ice}`, `{rounded.lg}` (`rounded-xl`).
- Title: `{typography.heading-lg}` `{colors.navy}`.
- Body: `{typography.body-md}` `{colors.body}`.
- Decoration: cyan blur orb at `-bottom-16 -right-16` at opacity 0.4.
- Hover: card `-translate-y-1`, icon tile `scale-1.10`, decoration orb opacity 0.4 → 0.7.

### Process steps
**`step-bubble`** + **`step-tag`** + **step-body** — a single step in the 4-up process row.
- 56×56 bubble with `{gradients.step-bubble}` background and `shadow-lg`. Lucide icon at 22px in white.
- Below: monospace `{typography.step-tag}` "PASO 0n" in `{colors.blue}`.
- Below: title in `{typography.heading-lg}` `{colors.navy}`, body in `{typography.body-sm}` `{colors.body}`.
- A 2px `{gradients.step-line}` runs horizontally behind the bubbles (`absolute top-7 left-[12%] right-[12%]`). Hidden at mobile breakpoint.

### Stat figure
**`stat-figure`** — one of the four numbers on the navy stats band.
- Number: `{typography.stat-xl}` `{colors.white}` with `tabular-nums`.
- Unit: same number wrapper, font-size 0.5em, color `{colors.cyan}`, margin-left 0.15em.
- Label: `{typography.body-sm}` `{colors.ice}` rendered below the number.
- Layout: text-center at mobile, text-left at md+.

### Election cards (archive)
**`election-card`** — 3-up grid card in the archive section.
- Background `{colors.white}`, 1px `{colors.hairline-cyan}` border, `{rounded.xl}`, padding 28px (`p-7`).
- Top row: status pill at left, Lucide `Users` icon at right.
- Status pill: `rounded-full` 6×10px padding with a 6px dot at the leading edge. Dot color = `{colors.blue}` for `TALLIED`, `{colors.cyan}` for `CLOSED`. Pill background tinted accordingly.
- Title: `{typography.heading-lg}` `{colors.navy}`, 2-line clamp.
- Body: `{typography.body-sm}` `{colors.body}`, 2-line clamp.
- Footer row: `Calendar` 13px + locale date in `{colors.mute}`; "Ver detalle" link in `{colors.blue}` with `ArrowUpRight` 13px.
- Hover: card `-translate-y-1`, `shadow-xl`, link gap grows.

**`election-skeleton`** — placeholder while elections load.
- 208px tall block with `{colors.ice-soft}` background, `{colors.hairline-cyan}` border (lighter variant), `{rounded.xl}`, `animate-pulse`.

### Final CTA card
**`final-cta-card`** — the closing surface before the footer.
- `rounded-[2rem]` card with `{gradients.cta-card}` background, 80–96px inner padding (`p-12 md:p-20`).
- Decoration: drifting ice orb (top-right), dotted SVG grid mask layered on top.
- Leading icon: Lucide `Vote` at 42px in `{colors.ice}`.
- Headline: `{typography.display-lg}` `{colors.white}`, maxWidth 22ch.
- Subcopy: 1.05rem `{colors.ice}` line-height 1.6, maxWidth 36rem.
- CTAs: the same pair as the hero (`button-primary-light` + `button-secondary-glass`).

### Inline banners
**`error-banner`** — only used when the archive fetch fails.
- `{colors.error-bg}` background, `{colors.error-fg}` text, `{typography.body-sm}`, `rounded-lg`, padding 16px (`p-4`).

## Motion

Framer Motion drives every section. All entries respect `viewport={{ once: true }}` so they fire once on scroll-into-view.

| Surface | Behavior |
|---|---|
| Hero column | `useScroll` → `useTransform(scrollY, [0,400], [0,80])` on `y` and `[1, 0.4]` on opacity — gentle parallax fade as the user scrolls past |
| Hero entry stack | Eyebrow → headline → subcopy → CTAs → trust row, with delays 0 / 0.1 / 0.25 / 0.4 / 0.55 |
| Hero orbs | Three infinite-loop translations: orb-cyan (18s), orb-blue (22s), orb-ice (25s), all `easeInOut` |
| Feature card grid | `opacity 0→1, y 30→0` over 0.5s with stagger delay `i * 0.08` |
| Process steps | `opacity 0→1, y 24→0` over 0.5s with stagger delay `i * 0.12` |
| Stats band | `opacity 0→1, y 20→0` over 0.5s with stagger delay `i * 0.08` |
| Election cards | `opacity 0→1, y 20→0` over 0.4s with stagger delay `i * 0.08` |
| Final CTA orb | Single infinite-loop ice orb drift, 14s `easeInOut` |
| CTA arrow icons | `translate-x +4px` on group-hover |
| Link gap | Tailwind `gap-1.5 → gap-2.5` on hover for the "Ver todas" archive link |

Motion is decorative. The page reads cleanly with `prefers-reduced-motion` honored by Framer Motion's defaults.

## Do's and Don'ts

### Do
- Use the four-stop palette **in order**: navy → blue → cyan → ice. Gradients should never reverse the order.
- Anchor every "primary moment" surface (hero, final CTA card) with a saturated gradient + drifting orbs + dotted grid mask + a single white CTA pill.
- Use **Lucide React** for all iconography. No emoji in the chrome.
- Build elevation from gradients and blur orbs first; reach for `shadow-lg/xl` only on interactive CTAs and card hover.
- Pair every primary CTA with a glassy ice-bordered secondary CTA. The two-CTA pattern is the universal call-to-action vocabulary.
- Keep section eyebrows in `{colors.blue}` with `0.18em` tracking and `uppercase`. Always above the headline, never below.
- Use `tabular-nums` on numeric grids (the stats wall) so figures align vertically.
- Mask the dotted SVG grid with a radial-fade so it never extends to the section edge.

### Don't
- Don't introduce a fifth brand color. The system has exactly four stops.
- Don't use any saturated accent (navy, blue, cyan, ice) on solid CTA buttons. CTAs are white on navy, or glass on navy. Never blue-fill.
- Don't reverse gradient direction. The page is a navy → blue → cyan → ice ocean; reversing breaks the visual rhythm.
- Don't drop the parallax / orb motion on the hero. The hero feels static without it.
- Don't use emojis. The brand vocabulary is Lucide React glyphs.
- Don't add a drop shadow to feature cards or stat figures. Their depth is built from gradient washes and corner orbs.
- Don't pad cards past 32px on all sides — the system runs tight at `p-7` to `p-8` for cards and `p-12 → p-20` only for the final CTA hero card.
- Don't introduce a light-mode/dark-mode dichotomy. The page is intentionally one mode with alternating saturated/white surfaces.

## Responsive behavior

### Breakpoints (Tailwind)

| Name | Width | Key changes |
|---|---|---|
| `2xl` | 1536px+ | Hero headline lands at 5.5rem; outer gutters relax via `max-w-7xl` |
| `xl` | 1280px | Default — 2-up features, 4-up process, 4-up stats, 3-up archive |
| `lg` | 1024px | Same; outer gutters tighten via `px-6` |
| `md` | 768px | Maintains multi-column grids; hero column stays single |
| `<md` | <768px | Feature grid → 1-up; process step-line **hides**, steps stack; stats → 2-up; archive → 1-up; CTA pills wrap; hero headline clamps to 2.5rem |

### Touch targets
All CTAs (`button-primary-light`, `button-secondary-glass`) sit at ~52px tall (14px vertical padding + 16px line-height + 18px icon) — comfortably above WCAG AAA. Status pills are decorative-only and not interactive. Cards (`feature-card`, `election-card`) are 200px+ tappable areas.

### Collapsing strategy
- **Hero CTAs**: flex-wrap at narrow widths, retaining the primary above the secondary.
- **Hero headline**: `clamp(2.5rem, 6vw, 5.5rem)` so the headline gracefully scales between 40px and 88px without breakpoints.
- **Stats**: 4-up → 2-up at `<md`; text-alignment shifts left → center.
- **Process step-line**: hidden at `<md` (`hidden md:block`). Steps stack vertically with the bubble centered.
- **Final CTA card**: padding `p-12` → `p-20` at `md+`.
- **Footer fade strip**: an absolute 128px gradient strip at the hero's bottom blends into the next section regardless of breakpoint.

## Iteration guide

1. Operate one section at a time. The six sections of `HomePage.tsx` (`Hero`, `FeaturesGrid`, `Process`, `StatsBand`, `ClosedElections`, `FinalCta`) are independent — change one without touching the others.
2. Always reference palette stops by token (`{colors.navy}`, `{colors.blue}`, `{colors.cyan}`, `{colors.ice}`) and gradient by ID (`{gradients.hero}`, `{gradients.cta-card}`, etc.).
3. Add new icons by importing from `lucide-react`. Do not introduce custom SVGs unless adding a new decorative pattern (e.g., a second `GridDots` variant).
4. New sections should follow the rhythm: section eyebrow → display headline → grid or content → optional CTA row. Keep `py-32` vertical and `max-w-7xl` width unless there's a structural reason to break it.
5. New CTAs must use one of the two pill variants (`button-primary-light` or `button-secondary-glass`). Do not create a third CTA style.
6. When introducing motion, keep entries staggered (delay `i * 0.08–0.12`) and respect `viewport={{ once: true }}`. Infinite loops are reserved for ambient orb drift only.
7. When in doubt, reach for gradient depth before reaching for a drop shadow. The brand identity is "oceanic gradient," not "card elevation."

## Known gaps

- **Light/dark dichotomy** — the system is single-mode by design. Existing `globals.css` defines `:root` and `.dark` tokens for the wider app, but the home page intentionally renders the same chrome in any mode.
- **Reduced-motion** — Framer Motion respects `prefers-reduced-motion` by default; explicit alternate-state copy hasn't been authored for users who disable motion. The page degrades cleanly to a static layout.
- **Empty-state copy** — only one empty state ("Aún no hay elecciones cerradas.") exists in the archive section. Future archive variants (filtered views, no-results-after-search) are not yet specified.
- **Authenticated chrome** — this document covers the marketing home only. The voter/admin/urn surfaces are not described here.
- **Localization** — copy is currently Spanish (es-MX). No English variant exists for the home page yet.
