# RentMyCar Design System

This document defines the locked design system to be used for the Phase 2 implementation pass. It preserves the current blue-based identity and refines it into a more coherent marketplace product without replacing the brand idea.

## 1. Semantic colors

### Base palette
- `ink`: `#020617` — primary text color for headings and strong product content
- `ink-secondary`: `#0F172A` — secondary text and deep neutral surfaces
- `surface`: `#F8FAFC` — primary page background
- `surface-0`: `#FFFFFF` — elevated cards and main content surfaces
- `border`: `#E2E8F0` — default border and dividers
- `brand`: `#2563EB` — core action color and primary emphasis
- `brand-dark`: `#1D4ED8` — pressed or more dominant brand states
- `brand-light`: `#DBEAFE` — subdued emphasis backgrounds
- `brand-tint`: `#EFF6FF` — soft brand backgrounds and support surfaces

### Neutral token extensions
- `body-muted`: `#475569` - supporting body copy
- `body-subtle`: `#64748B` - metadata and secondary labels
- `body-faint`: `#94A3B8` - placeholders and low-emphasis UI text
- `border-strong`: `#CBD5E1` - stronger separators and disabled outlines
- `surface-muted`: `#F1F5F9` - disabled controls and subtle neutral fills

These tokens preserve the existing Slate values while replacing direct palette references with reusable semantic roles.
### Semantic usage
- Primary actions: `brand`
- Hover/pressed states: `brand-dark`
- Soft support backgrounds: `brand-tint` or `brand-light`
- App background: `surface`
- Elevated cards: `surface-0`
- Strong text: `ink`
- Muted text: `body-muted`, `body-subtle`, or `body-faint` according to emphasis
- Dividers and neutral cards: `border`

### Support colors
- Success: `emerald-600 / emerald-100`
- Warning: `amber-500 / amber-100`
- Error: `red-600 / red-100`
- Neutral muted: `body-subtle / surface-muted`

The legacy `--button` variable remains as a compatibility alias for destructive button styling and resolves to the semantic danger color. New UI should use `danger` tokens directly.

Do not replace the product with a completely new palette. The system retains a clean blue-led identity while using neutral surfaces for legibility and trust.

## 2. Typography scale

### Font families
- Headings: `Manrope` via `--font-manrope`
- Body/UI: `Inter` via `--font-inter`

### Type scale
- Hero heading: `text-3xl sm:text-4xl md:text-5xl` with `font-bold`, tight tracking, line-height `tight`
- Section heading: `text-2xl md:text-3xl` with `font-bold`
- Card heading: `text-base md:text-lg` with `font-semibold`
- Body: `text-sm md:text-base` with line-height `6` or `7`
- Small metadata: `text-xs` with uppercase tracking when used as labels
- Button labels: `text-sm font-semibold`
- Input labels: `text-xs font-semibold`

### Typography principles
- Headings should be decisive and minimal.
- Metadata should be readable but unobtrusive.
- Keep uppercase labels focused on function, not long copy.
- Use a single type rhythm across cards, forms, dialogs, and nav.

## 3. Spacing rhythm

Use a consistent 4px-based rhythm for all layout systems:
- `4px` for tight inline spacing
- `8px` for compact UI groups
- `12px` for small card pads and compact form controls
- `16px` for default padding and relationship spacing
- `24px` for section separation and larger card padding
- `32px` for main product-group spacing
- `48px+` for page hero and large layout blocks

### Layout rules
- Use larger separation between sections than between card elements.
- Let content breathe without becoming airy or disconnected.
- Keep mobile spacing slightly tighter than desktop spacing, but never cramped.

## 4. Content and container widths

- Default large layout width: `max-w-7xl`
- Inner cards and panels: `max-w-xl`, `max-w-2xl`, or `max-w-3xl` depending on context
- Search and list surfaces should use strong content boundaries, never bleed edge-to-edge by default
- Preserve comfortable left/right insets on mobile and desktop for readability

## 5. Border-radius hierarchy

- Small controls: `rounded-lg` (`12px`)
- Standard cards and inputs: `rounded-xl` (`16px`)
- Major panels and hero surfaces: `rounded-2xl` (`20px`)
- Large media blocks and featured cards: `rounded-3xl` (`24px`)

### Radius principles
- Use a consistent but not overly rounded language.
- Keep cards and controls soft enough to feel modern without becoming generic.
- Avoid making every surface the same radius.

## 6. Shadow and elevation hierarchy

- Level 0: flat surfaces on `surface` or `surface-0`
- Level 1: subtle shadow for standard cards and controls (`shadow-sm`)
- Level 2: elevated floating components or featured panels (`shadow-md`)
- Level 3: modals and overlays with stronger but controlled shadow (`shadow-xl`)

### Elevation principles
- Use shadow to reinforce hierarchy, not to decorate the layout.
- Avoid excessive shadow depth on every card.
- Keep the product practical and trustworthy rather than overly glossy.

## 7. Button variants

### Primary
- Background: `bg-brand`
- Text: white
- Hover: `bg-brand-dark`
- Radius: `rounded-xl`
- Height: `h-10` default, `h-11` large

### Secondary
- Background: `bg-surface-muted`
- Text: `ink-secondary`
- Hover: `bg-border`

### Outline
- Border: `border border-border`
- Background: white or `surface-0`
- Text: `ink`
- Hover: subtle tinted fill

### Ghost
- Transparent background
- Text: muted neutral or brand
- Hover: subtle brand-tint or neutral fill

### Destructive
- Background: red danger palette
- Text: white
- Border and focus states should remain clear and consistent

### Interaction states
- Focus ring: `ring-2 ring-brand ring-offset-2`
- Disabled: lowered opacity with no hover interactions

## 8. Card variants

### Standard listing card
- White or neutral surface
- Subtle border
- Soft shadow
- Clear image area with consistent aspect ratio
- Title, price, metadata, and actions separated into readable blocks

### Feature card / stat card
- Light blue-tinted or neutral background
- Border with subtle brand emphasis
- Simple icon and short body text

### Status card / badge block
- Soft tinted backgrounds with high contrast text
- Use semantic success/warning/neutral states, not arbitrary gray-only labels

## 9. Form controls

- Inputs/selects/textareas should share the same base pattern: neutral background, soft border, rounded corners, clear focus ring, consistent heights.
- Labels should read as system labels, not decorative text.
- Default form surfaces must be readable on white and soft neutral panels.
- Validation states should use semantic color with clear explanatory text.

### Form pattern
- `labelClass`: `text-xs font-semibold text-body-muted`
- `inputClass`: neutral surface, border, rounded-input, focus ring
- Keep desktop and mobile control density aligned to avoid mismatch

## 10. Dialogs and modals

- Use a clear content hierarchy: heading, summary, key information, and actions
- Keep the modal surface elevated and narrow enough to feel contained
- Use a consistent footer action pattern: destructive or neutral support + primary confirmation
- Keep pricing and date summary blocks visually anchored and easy to scan

## 11. Navigation

### Desktop navigation
- Clear brand lockup at left
- Simple navigation links with muted default color and blue hover emphasis
- Primary CTA as one strong action, not competing with multiple large prompts

### Mobile navigation
- Use a fixed bottom tab bar with three or four high-value destinations
- Keep icons and labels legible with subtle active state
- Maintain a consistent active color tied to the brand rather than a generic dark mode aesthetic

### Shared principle
- The app shell should feel like one product across desktop and mobile.

## 12. Badges and status labels

Badges should be concise and consistent. Status design should emphasize meaning without claiming too much visual weight.

Recommended patterns:
- Available: `emerald-100` / `emerald-700`
- Booked / unavailable: `amber-100` / `amber-700`
- Inactive: neutral muted palette
- Product-only pill states: soft brand tint when used as sales/feature labels

## 13. Feedback, error, and empty states

### Error states
- Use red border and red text with short, actionable copy
- Keep the state readable without overwhelming the page

### Success states
- Use green support backgrounds for positive completion states
- Limit green to meaningful actions only

### Empty states
- Use a neutral card or section with icon, heading, and a single action
- Keep the layout calm and product-oriented

### Loading states
- Use skeletons with consistent card proportions and soft neutral movement
- Keep motion subtle; do not animate unrelated surfaces

## 14. Skeletons and empty states

- Skeleton blocks should mirror real card and form proportions exactly
- Avoid random placeholder sizes or floating blocks
- Keep the skeleton palette close to the neutral surface language

## 15. Responsive principles

- Design with mobile first, then scale up to desktop
- Preserve a single design language across breakpoints
- Treat mobile as a real product surface, not a simplified fallback
- Avoid using desktop patterns that become cramped or noisy on small screens
- Ensure tap targets remain comfortable and readable

## 16. Interaction states

- Hover: subtle brand tint or darker border, not a dramatic color shift
- Focus: strong, visible ring with consistent offset
- Active/pressed: slightly darker brand or neutral state
- Disabled: reduced contrast and no hover interactions

## 17. Motion principles

- Keep motion functional and subtle
- Use transitions for state changes, not decoration
- Avoid heavy motion in search, cards, or standard navigation
- Favor quick, concise transitions over large motion effects

## 18. Final product direction

The RentMyCar design system should feel:
- clean
- modern
- trustworthy
- practical
- blue-led
- marketplace-oriented
- easy to scan on desktop and mobile

It should feel like one carefully designed product instead of a collection of independent UI fragments.
