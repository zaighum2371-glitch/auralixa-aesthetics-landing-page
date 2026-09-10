<<<<<<< HEAD
# Auralixa Aesthetics 🌿✨

> A luxury medical spa and aesthetic clinic web platform, combining high-converting editorial aesthetics with a medical-grade booking and clinic administration engine.

---

## 📖 About The Project

**Auralixa Aesthetics** is a web application designed for a high-end medical aesthetics clinic offering specialized treatments such as Microneedling, Glutathione Skin Brightening, Nano Whitening Facials, BB Glow, Dermarollers, and Microdermabrasion.

Originally bootstrapped as an editorial-grade landing page, the codebase is structured to scale into a full clinical operating system featuring:
- **Luxury Marketing Experience:** High-impact hero, interactive treatment catalog with categorical breakdowns, real client before-and-after transformation galleries, FAQs, and a multi-step consultation booking flow.
- **Client Portal (In Progress):** Appointment history, upcoming schedule with countdowns, intake notes (allergies/concerns), and profile management.
- **Admin Management Suite (In Progress):** Comprehensive appointment ledger, calendar agenda, capacity/blackout date management, client CRM with audit logs, and in-person payment processing desk.

> [!NOTE]
> For the complete technical architecture, database schema, RLS policies, and 10-phase roadmap, refer to [`IMPLEMENTATION/IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION/IMPLEMENTATION_PLAN.md).

---

## 🛠️ Tech Stack

### Core Framework & Runtime
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) — Server Components, optimized image rendering, metadata API.
- **Library:** [React 19](https://react.dev/) / React DOM 19
- **Language:** [TypeScript 5.7](https://www.typescriptlang.org/) — Strict type safety across components and data schemas.
- **Package Manager:** `pnpm` (configured with lockfile version 9).

### Styling & Design System
- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`, PostCSS 8)
- **Component Primitives:** [Base UI (`@base-ui/react`)](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) (`base-nova` style)
- **Class Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
- **Animations:** `tw-animate-css`
- **Iconography:** [Lucide React](https://lucide.dev/) (`lucide-react`)
- **Typography:** Google Fonts loaded via `next/font`:
  - Headings / Editorial: **Playfair Display** (Serif)
  - Body & High-density UI: **Inter** (Sans-serif)

### Backend & Database (Connected via Supabase MCP)
- **Backend-as-a-Service:** [Supabase](https://supabase.com/)
  - **Database:** PostgreSQL 17 (`eu-west-1`)
  - **Active Project ID:** `usjjskmucdwnfkdjbtgw`
  - **API Endpoint:** `https://usjjskmucdwnfkdjbtgw.supabase.co`
  - **Services:** Supabase Auth (RBAC), Row-Level Security (RLS), Edge Functions, Storage buckets (`treatment-media`, `client-avatars`, `clinical-records`).

### Analytics & Performance
- **Telemetry:** `@vercel/analytics`

---

## 🎨 Luxury Brand Design System

Auralixa uses an intentional, anti-clinical warm palette evoking calm and modern luxury:

| Token Name | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **Parchment (Background)** | `#F5F1EA` | Primary page background, soft, serene canvas |
| **Espresso Bronze (Foreground)** | `#533C2E` | Typography, primary interactive states, buttons |
| **Champagne Gold (Accent)** | `#B2967D` | Highlights, badges, focus rings, active indicators |
| **Sandstone (Border)** | `#D7C9B8` | Card borders, dividers, subtle separators |
| **Warm Mocha (Muted)** | `#8A6950` | Subtitles, meta dates, secondary details |
| **Pure White (Elevated)** | `#FFFFFF` | Modal dialogs, elevated cards, popovers |
| **Status: Confirmed** | `#3D654C` | Muted sage green for active/confirmed sessions |
| **Status: Pending** | `#9B6E23` | Warm antique amber for in-person arrival/pending |
| **Status: Cancelled / Alert**| `#8A3333` | Deep crimson for restrictions and cancellations |

---

## 📂 Project Structure

```text
auralixa-aesthetics-landing-page/
├── app/
│   ├── globals.css                # Tailwind v4 theme variables & brand tokens
│   ├── layout.tsx                 # Root layout, Google Fonts (Playfair + Inter), SEO
│   └── page.tsx                   # Main entry point rendering <PageContent />
├── components/
│   ├── booking-modal.tsx          # 3-step consultation & treatment booking wizard
│   ├── faq.tsx                    # Interactive expandable accordion FAQ section
│   ├── footer.tsx                 # Clinic hours, contact details, legal links
│   ├── header.tsx                 # Sticky navigation, brand wordmark, mobile drawer
│   ├── hero.tsx                   # Editorial luxury hero with primary CTAs
│   ├── page-content.tsx           # Client-side coordinator for landing sections
│   ├── social-proof.tsx           # Before/after transformations & client metrics
│   ├── treatments-section.tsx     # Filterable treatment catalog cards
│   └── ui/                        # Reusable shadcn/Base UI components
│       ├── accordion.tsx
│       ├── button.tsx
│       └── dialog.tsx
├── IMPLEMENTATION/
│   └── IMPLEMENTATION_PLAN.md     # 10-phase architecture plan & database blueprint
├── lib/
│   ├── treatments.ts              # Treatment catalog data & category definitions
│   └── utils.ts                   # Tailwind merge utility (cn)
├── public/
│   ├── before-after/              # High-resolution clinical comparison imagery
│   ├── apple-icon.png             # Mobile home screen icon
│   └── icon.svg                   # Brand favicon
├── components.json                # shadcn configuration (base-nova style)
├── next.config.mjs                # Next.js configuration
├── package.json                   # Project scripts and dependencies
├── postcss.config.mjs             # PostCSS Tailwind plugins
└── tsconfig.json                  # TypeScript compiler settings
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v20.x` or later recommended
- **pnpm:** `v9.x` (`npm install -g pnpm`)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd auralixa-aesthetics-landing-page
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root of the project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://usjjskmucdwnfkdjbtgw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App URL (optional for local dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `next dev` | Launches local development server with Hot Module Replacement |
| `pnpm build` | `next build` | Compiles and builds production bundle |
| `pnpm start` | `next start` | Runs the compiled production server |
| `pnpm lint` | `eslint .` | Runs ESLint over project files |

---

## 🏛️ Architecture & Roadmap Highlights

1. **In-Person Payment Protocol:**
   All booking transactions default to on-premises settlement (`pending_in_person`, `paid_in_person`, `waived`, `refunded_in_person`), with schema hooks ready for future Stripe integration.
2. **User-to-Client Lifecycle:**
   - Account signup initializes users with `role: 'user'`.
   - Creating a confirmed booking promotes the profile automatically to `role: 'client'`.
   - Administrators manage role overrides and clinic blacklists (`active`, `suspended`, `banned`).
3. **Toast Notifications:**
   - Standardized to **top-left** via Sonner styled to match the warm Parchment/Espresso Bronze brand identity.

---

## 🤝 Contributing & Code Guidelines

- **Component Creation:** Use `@/components/ui` for primitives. Add new shadcn components using standard Tailwind v4 CSS variables.
- **Styling Discipline:** Avoid raw inline colors; utilize theme variables (`bg-background`, `text-foreground`, `text-gold`, `border-border`).
- **Type Safety:** Maintain strict TypeScript typing. Treatment models must be typed against `Treatment` and `TreatmentCategory` in `@/lib/treatments`.
=======
# auralixa-aesthetics-landing-page

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_Zu0luOo0SwbxwGo2JKRYVjSAwn0o)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
>>>>>>> 07de66ffa5a305eb27e6ebc417329b3656e33fd0
