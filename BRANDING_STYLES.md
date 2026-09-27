# Auralixa Aesthetics - Branding Styles

This document contains the core branding styles, colors, and typography used in the Auralixa Aesthetics landing page. Use these guidelines when creating new pages, emails, or marketing materials to maintain brand consistency.

## 🎨 Color Palette

### Primary Colors
*   **Background (Light Beige):** `#F5F1EA` - Used for the main body background, providing a warm, soft foundation.
*   **Foreground / Primary Text (Dark Brown):** `#533C2E` - Used for main text, headings, and primary buttons. Provides strong contrast against the light background while remaining softer than pure black.
*   **Pure White:** `#FFFFFF` - Used for cards, popovers, and overlapping elements to create depth.

### Accent & Secondary Colors
*   **Accent / Gold:** `#B2967D` - Used for highlights, active states, focus rings, and accent buttons.
*   **Secondary / Muted Background:** `#D7C9B8` - Used for secondary sections, borders, inputs, and muted container backgrounds.
*   **Muted Foreground:** `#8A6950` - Used for secondary text, descriptions, and subtle UI elements.

### Status Colors
*   **Destructive / Error:** `#DC2626`

---

## 🔤 Typography

We use Google Fonts for our typography to ensure cross-platform consistency.

### Primary Font (Headings & Display)
*   **Font Family:** `Playfair Display`, serif
*   **Weights:** Regular (400), Medium (500), Semi-Bold (600), Bold (700)
*   **Usage:** Hero sections, section titles, large pull quotes, and anywhere an elegant, premium aesthetic is required.

### Secondary Font (Body Text & UI)
*   **Font Family:** `Inter`, system-ui, sans-serif
*   **Weights:** Variable / Normal
*   **Usage:** All body copy, paragraphs, buttons, navigation links, and small UI elements for maximum readability.

---

## 📐 Styling Guidelines

### Border Radius
The brand uses soft, rounded corners to maintain a gentle and inviting aesthetic.
*   **Default Radius:** `0.625rem` (10px) - Applied to cards, buttons, and inputs.

### Theming
*   **Color Scheme:** The default and primary scheme is **Light** (`color-scheme: light`).
*   **Theme Color (Meta):** `#F5F1EA`

### CSS Variables Reference (Tailwind v4)
If you are developing inside the main application, these variables are exposed in `globals.css`:
*   `var(--background)` / `bg-background`
*   `var(--foreground)` / `text-foreground`
*   `var(--primary)` / `bg-primary`
*   `var(--secondary)` / `bg-secondary`
*   `var(--accent)` / `bg-accent`
*   `var(--muted)` / `bg-muted`
*   `var(--gold)` / `text-gold` / `bg-gold`
