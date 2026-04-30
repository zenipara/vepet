---
name: Clinical Vitality
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The visual identity of this design system centers on the intersection of medical precision and empathetic care. It is built to project an image of an established, reliable institution that prioritizes both the technical health of the animal and the emotional peace of the owner.

The aesthetic follows a **Modern Professional** direction, characterized by high-density information architecture balanced by generous whitespace. It avoids the coldness of traditional clinical software by using soft geometry and a calming palette, ensuring that the internal administrative tools feel efficient while the customer-facing portals feel welcoming and accessible.

## Colors

The palette is anchored by a calming medical teal, selected to inspire confidence and stability. This is supported by a vibrant health-focused green used exclusively for positive outcomes, recovery status, and primary calls to action related to wellness.

- **Primary (Teal):** Used for navigation, headers, and core brand elements.
- **Secondary (Green):** Reserved for "Health," "Active," and "Success" states.
- **Neutral (Slate):** A sophisticated range of grays used for typography and UI borders to maintain a high-contrast, legible environment.
- **Surface:** The background utilizes an off-white tint (#F8FAFC) to reduce eye strain during long shifts for clinical staff.

## Typography

The design system utilizes **Inter** for all applications. Inter’s tall x-height and systematic design make it ideal for the high-density data required in medical records, lab results, and scheduling charts.

Headlines use a tighter letter-spacing and heavier weights to establish a clear hierarchy, while body text maintains a generous line height (1.6) to ensure readability of patient notes and prescriptions. For internal tools, the "body-sm" and "label-sm" variants are prioritized to maximize information density without sacrificing clarity.

## Layout & Spacing

This design system employs an **8px baseline grid** to maintain mathematical harmony across all components. 

The layout utilizes a **12-column fluid grid** for the internal dashboard, allowing the interface to adapt from tablets (used during rounds) to large desktop monitors (used at reception). For the customer portal, a **fixed-width central container** (max-width: 1200px) is preferred to create a more intimate, focused experience for pet owners booking appointments or viewing records.

## Elevation & Depth

Depth is conveyed through **ambient shadows** and **tonal layering** rather than heavy borders. The system uses three distinct elevation levels:

1.  **Level 0 (Flat):** Used for the main background and decorative elements.
2.  **Level 1 (Subtle):** Used for data cards and table rows. Features a soft 1px border (#E2E8F0) and a light shadow (0 1px 3px rgba(0,0,0,0.05)).
3.  **Level 2 (Raised):** Used for interactive elements like buttons and active dropdowns.
4.  **Level 3 (Overlay):** Used for modals and pet profile overlays. Employs a diffused shadow (0 20px 25px -5px rgba(0,0,0,0.1)) to focus user attention.

Transparent overlays with a light backdrop-blur (4px) are used in the customer portal to maintain a sense of lightness and modernism.

## Shapes

The shape language is consistently **Rounded**, using an 8px base radius for standard components like buttons and input fields. Larger containers, such as pet profile cards or dashboard widgets, utilize a 16px (rounded-lg) radius to feel more approachable and friendly.

Sharp corners are entirely avoided to maintain the "warm professional" aesthetic. For specialized UI like status badges (e.g., "Vaccinated," "Overdue"), a full pill-shape (32px+) is used to differentiate them from interactive buttons.

## Components

### Buttons
Primary buttons use the Teal base with white text. Hover states should darken the teal slightly. The "Secondary" button style uses a ghost-style teal outline to maintain a clean appearance in data-heavy views.

### Input Fields
Fields feature a subtle gray border (#CBD5E1) that shifts to Teal on focus. Error states must use a soft red, accompanied by a small icon for accessibility.

### Data Tables
Tables are designed for high density. They should include:
- **Zebra Striping:** Alternating rows using a very faint teal-gray (#F1F5F9).
- **Sticky Headers:** Essential for long patient logs.
- **Row Hover:** A soft highlight color to help doctors track data across wide screens.

### Pet Status Chips
Small, pill-shaped indicators using the secondary Green for "Healthy," an amber for "Pending," and the primary Teal for "In-Patient."

### Cards
Customer-facing cards (for the owner portal) should have a slightly larger padding (24px) and more prominent drop shadows compared to the internal clinical cards.