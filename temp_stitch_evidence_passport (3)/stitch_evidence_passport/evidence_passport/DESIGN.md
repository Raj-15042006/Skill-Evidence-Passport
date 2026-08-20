---
name: Evidence Passport
colors:
  surface: '#FFFFFF'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#4a1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c2e00'
  on-tertiary-container: '#ff8e49'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#F8FAFC'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  primary-hover: '#1E40AF'
  surface-alt: '#F1F5F9'
  border: '#E2E8F0'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  text-muted: '#94A3B8'
  success-text: '#15803D'
  success-fill: '#DCFCE7'
  warning-text: '#B45309'
  warning-fill: '#FEF3C7'
  error-text: '#B91C1C'
  error-fill: '#FEE2E2'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  gutter: 24px
  margin: 32px
---

DESIGN.md — Skills Evidence Passport
Brand & Style
Brand personality: Credible, precise, and quietly confident — the platform behaves like a notary, not a social feed. It never shouts; it verifies.
Design philosophy: "Evidence over claims." Every visual decision reinforces trust and traceability — verification states are always visible, never hidden behind vague labels, and the UI privileges clarity over decoration.
Target audience: Four distinct personas sharing one system —
Students (18–26) submitting evidence, expecting something as polished as LinkedIn but as functional as a dashboard.
Faculty verifiers (30–55) who need speed and low cognitive load — they review dozens of submissions per sitting.
Recruiters/placement teams (25–45) who scan and filter quickly, comparing candidates side by side.
Admins who need system-wide visibility (taxonomy, audit, telemetry) without noise.
Visual style: Clean institutional-modern — closer to a fintech/credentialing product (Credly, DocuSign, Notion) than a social or gamified app. Structured grids, restrained color, purposeful use of a single accent for "verified" states.
Product positioning: A trust layer between raw student work and hiring decisions — positioned as infrastructure, not a portfolio toy. Every screen should feel audit-ready.
Overall UX goals: Reduce time-to-verify, make verification status legible at a glance (color + icon + label, never color alone), and make a recruiter's search-to-shortlist path near-instant.
Colors
Token Hex Usage Primary #1E3A8A (Indigo 900) Primary actions, active nav, links, header Primary Hover #1E40AF Hover/active state of primary Secondary #0F766E (Teal 700) Verification/"trust" accents, secondary CTAs Accent #B45309 (Amber 700) Growth/achievement highlights, timeline markers — used sparingly Background #F8FAFC (Slate 50) App canvas Surface #FFFFFF Cards, panels, modals Surface Alt #F1F5F9 (Slate 100) Nested panels, table stripes, code/quote blocks Border #E2E8F0 (Slate 200) Dividers, card outlines, input borders Text Primary #0F172A (Slate 900) Headings, primary body text Text Secondary #475569 (Slate 600) Supporting text, captions Text Muted #94A3B8 (Slate 400) Placeholders, disabled text Success #15803D (Green 700) on #DCFCE7 fill Approved / Verified states Warning #B45309 (Amber 700) on #FEF3C7 fill In-review / Needs-info states Error #B91C1C (Red 700) on #FEE2E2 fill Rejected / failed states, destructive actions
Accessibility: All text/background pairs meet WCAG AA (4.5:1 for body, 3:1 for large text). Verification status is never conveyed by color alone — always paired with an icon (✓ / ⏳ / ✕) and a text label.
Typography
Font family: Inter for all UI text (body, labels, tables); Plus Jakarta Sans for headings/display text to give the brand a touch of warmth without sacrificing legibility. System-ui fallback stack.
Heading hierarchy:
H1 — 32px / 40px line-height / 700 weight — page titles ("Your Skills Passport")
H2 — 24px / 32px / 700 — section headers ("Pending Verifications")
H3 — 20px / 28px / 600 — card/module titles
H4 — 16px / 24px / 600 — subsection labels
Body typography: Base 16px / 24px line-height / 400 weight (Text Primary). Secondary body 14px / 20px (Text Secondary).
Labels: 12px / 16px, 600 weight, uppercase, 0.04em letter-spacing — used for form labels, table headers, status chips.
Font weights used: 400 (body), 500 (emphasis/links), 600 (labels, subheads), 700 (headings only) — no lighter-than-400 weights, for readability.
Readability principles: Max line length ~72ch for prose blocks (evidence descriptions, verifier comments); generous line-height on dense screens (verifier queue, recruiter tables) to reduce scan fatigue during long review sessions.
Layout & Spacing
Grid system: 12-column responsive grid, 24px gutters.
Container width: Max 1280px centered for dashboards; full-bleed for tables/search results with internal 24–32px padding.
Responsive behavior: Sidebar collapses to a bottom tab bar (mobile) or icon-only rail (tablet). Tables convert to stacked cards below 768px. Multi-step evidence upload becomes a single-column wizard on mobile.
Navigation layout: Persistent left sidebar (Verifier, Recruiter, Admin roles) + slim top header (search, notifications, profile). Student-facing portfolio view uses a top nav only, since it's browsed like a profile page, not worked in like a queue.
Sidebar: 240px expanded / 72px collapsed (icon rail), fixed, role-scoped menu items, active item marked with a left indigo bar + tinted background.
Header: 64px height, houses global search (recruiter/admin), status/notification bell, avatar menu. Sticky on scroll.
Spacing scale: 4px base unit — 4, 8, 12, 16, 24, 32, 48, 64, 96. Cards use 24px internal padding; page sections separated by 48–64px.
Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px.
Whitespace usage: Generous around verification-decision zones (approve/reject) to prevent misclicks; denser in data tables where scan speed matters (recruiter search, verifier queue).
Elevation & Depth
Shadow philosophy: Minimal and functional — shadows indicate interactivity or temporary layers (dropdowns, modals), not decoration. Flat cards by default.
Border usage: 1px Border token outlines are the primary way to separate surfaces on the base canvas (cheaper visually than shadows, keeps dense screens calm).
Surface hierarchy: Background (Slate 50) → Card/Panel (White, 1px border) → Elevated (dropdown/popover, soft shadow 0 4px 12px rgba(15,23,42,0.08)) → Modal/Dialog (stronger shadow 0 20px 40px rgba(15,23,42,0.16) + scrim overlay rgba(15,23,42,0.4)).
Hover elevation: Interactive cards (evidence cards, candidate cards) lift with a subtle shadow (0 2px 8px rgba(15,23,42,0.08)) and 1px border color shift to Primary on hover — no scale/transform, to keep dense lists stable.
Shapes
Border radius: 8px for cards/panels, 6px for buttons/inputs, 4px for small chips/tags, 16px for modals, full-round (9999px) for avatars, badges, and pill status tags.
Button shapes: Rectangular with 6px radius, medium height (40px default, 32px compact, 48px prominent CTAs).
Card shapes: 8px radius, 1px border, no shadow at rest.
Input styles: 6px radius, 1px border (Slate 200), Primary-colored 2px focus ring with no default browser outline; 40px height for text inputs, larger drag-and-drop zone (min 160px) for file/evidence upload with dashed border at rest.
Icon style: Outline icons (Lucide/Feather-style), 20px default, 16px in dense tables, 24px in empty states — never filled/glyph icons except for the verification checkmark, which is a filled circle-check to make it unambiguous at a glance.
Components
Buttons
Primary: filled Indigo 900, white text, 6px radius, subtle Primary Hover darken on hover, disabled state at 40% opacity with no pointer.
Secondary: white fill, 1px Primary border, Primary text.
Ghost/Tertiary: transparent, Text Secondary, background tint on hover.
Destructive (reject/delete): filled Error red, used only for irreversible or high-consequence actions, always paired with a confirm dialog.
Icon buttons: 36px square, ghost style, used in tables/toolbars.
Cards
Evidence Card: thumbnail/file-type icon, skill tag, submission date, status badge (top-right), truncated description, "Review" or "View" CTA.
Skill Card (portfolio): skill name, proficiency level (visual meter or stars), verifier name + date, small "verified" seal icon.
Candidate Card (recruiter view): avatar, name, top 3–5 verified skills as tags, match score, "Shortlist" action.
Inputs
Standard text/select inputs per Shapes spec above.
File upload: dashed-border dropzone, drag-active state switches border to Primary + tinted background, shows per-file progress bars, accepted-format hint text below.
Forms
Multi-step wizard for evidence submission (Skill → Evidence Type → Upload → Description → Review) with a persistent step indicator at top; inline validation (never only on submit); autosave draft state.
Navigation
Role-scoped left sidebar with sectioned groups (e.g., Verifier: "Queue," "History," "Rubrics"); active state = tinted background + left accent bar; badge counters (e.g., "12") pending in Warning color.
Sidebar — see Layout section; icon + label, collapsible, tooltip-on-hover when collapsed.
Header — global search (recruiter/admin only), notification bell with unread dot (Error red), avatar/role switcher.
Tables
Used in Verifier Queue and Recruiter Search. Sticky header row, zebra striping (Surface Alt on alternate rows), sortable column headers (chevron indicator), row hover = Surface Alt tint, row click opens detail panel/modal rather than navigating away (keeps queue context).
Charts
Growth Timeline: horizontal timeline/line chart, Accent-colored markers per verified milestone, tooltip on hover with evidence detail.
Skill Radar (student portfolio summary): radar/spider chart across skill categories, Secondary teal fill at low opacity.
Verification Turnaround (admin dashboard): bar/line chart in Primary, target-threshold line in Warning dashed style.
Badges
Status badges: pill-shaped, tinted background + matching text color + icon — Verified (green), In Review (amber), Rejected (red), Draft (slate/gray).
Tags
Skill tags: small pill, Surface Alt background, Text Secondary, 4px radius corners are acceptable here (slightly less rounded than status badges to visually distinguish "attribute" from "state").
Search
Recruiter faceted search: prominent search bar + filter chips below (skill, proficiency level, role, verification date range); active filters shown as removable pills; result count always visible.
Modals
Evidence Review Modal (verifier): evidence preview (file/PDF viewer or link embed) on the left, rubric scoring form + approve/reject/needs-info actions on the right; comments thread at bottom.
Dialogs
Confirmation dialogs for destructive/high-consequence actions (reject evidence, delete taxonomy node) — title, one-line consequence explanation, Cancel (ghost) + confirm (destructive/primary) buttons.
Notifications
Toasts: top-right, auto-dismiss 4–6s for informational, persistent (manual dismiss) for errors; icon + short message + optional action link ("View").
Empty States
Friendly but restrained illustration (line-art, on-brand indigo/teal), one-sentence explanation, single clear CTA (e.g., "No evidence submitted yet — Upload your first skill").
Loading States
Skeleton screens matching final layout shape (cards, table rows) rather than spinners, to reduce perceived latency on data-heavy screens (verifier queue, recruiter search).
Error States
Inline field errors: Error-red text + icon directly below the input.
Page-level errors (failed load): centered icon, short explanation, "Retry" primary button.
System-degraded banners (e.g., "AI scoring temporarily unavailable — evidence routed to manual review"): full-width Warning-colored banner at top of affected screen, non-blocking.