  # Implementation Plan: Full Backend & Dashboards Architecture for Auralixa Aesthetics

A comprehensive technical blueprint and phased implementation plan to transform the Auralixa Aesthetics web application from a static marketing landing page into a full-featured luxury aesthetic clinic platform powered by **Supabase** (PostgreSQL, Auth, Storage, Edge Functions) and **Next.js App Router** (React 19, Tailwind CSS v4, Shadcn UI).

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions for Approval:**
> 1. **Payments Handling:** All payments will be registered as **in-person / on-premises** (`pending_in_person`, `paid_in_person`, `waived`, `refunded_in_person`). The schema is built to be forward-compatible with Stripe without requiring structural refactoring later.
> 2. **Role Progression Flow:** 
>    - New signups default to role: `user`.
>    - When a user submits their first booking, an automated Supabase trigger/function updates their role to `client`.
>    - Admins have full authority to override roles (`user`, `client`, `admin`), as well as account statuses (`active`, `suspended`, `banned`, `rejected`).
> 3. **Navigation & UI Philosophy:** 
>    - Full pages with URL slugs (e.g., `/book/[slug]`, `/bookings/[id]`, `/admin/sessions/[id]/edit`, `/admin/clients/[id]`) for workflows and deep-linking.
>    - Modals (Dialogs) are reserved strictly for destructive/critical confirmations (cancellations, bans) and quick micro-edits.
>    - Toast notifications rendered exclusively at **top-left** using Sonner styled to Auralixa's warm bronze & gold palette.

---

## Open Questions

> [!NOTE]
> Please review these design and workflow questions. You can provide feedback on any of them, or we can proceed with the recommended defaults noted below:

1. **Practitioner/Staff Assignment:** 
   - *Question:* In the future, will sessions be assigned to specific practitioners/doctors, or is Auralixa currently a single-practitioner/unified clinic schedule?
   - *Recommendation:* We will include an optional `practitioner_id` (foreign key to `profiles`) in `sessions` and `bookings` so it effortlessly scales to multiple specialists when needed.
2. **Cancellation Policy Window:**
   - *Question:* Should clients be prevented from cancelling online within a specific timeframe (e.g., within 24 or 48 hours of the appointment)?
   - *Recommendation:* Add a configurable `cancellation_notice_hours` (default: 24h) in Clinic Settings. If inside the window, clients are instructed to call the clinic directly.
3. **Email & SMS Notifications:**
   - *Question:* Would you like automated email confirmations dispatched via Supabase Edge Functions using a transactional provider like Resend or SendGrid?
   - *Recommendation:* We will create the Supabase Edge Function infrastructure w  ith a webhook hook ready for Resend integration.
4. **Timezone:**
   - *Question:* What is the clinic's primary timezone for calendar calculations?
   - *Recommendation:* Store all timestamps in UTC with a clinic-wide default timezone setting (e.g., `Europe/London` or `America/New_York`).

---

## Auralixa Luxury Branding & UI System (Shadcn + Tailwind v4)

To maintain an elevated, high-end medical spa aesthetic across all new pages, tables, and dashboards, the existing brand tokens will be standardized across the application:

### Color Palette Tokens
| Token Name | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| **Parchment / Background** | `#F5F1EA` | Primary page canvas, warm, serene, anti-clinical feel |
| **Espresso Bronze / Foreground** | `#533C2E` | Primary typography, dark buttons, active navigation states |
| **Champagne Gold / Accent** | `#B2967D` | Focus rings, highlight badges, icons, active tab underlines |
| **Sandstone / Secondary** | `#D7C9B8` | Card borders, table dividers, input borders, disabled chips |
| **Warm Mocha / Muted** | `#8A6950` | Subtitles, timestamp metadata, table column headers |
| **Pure / Elevated Card** | `#FFFFFF` / `#FAF8F5` | Dashboard cards, surface panels, modal backdrops |
| **Status - Confirmed / Active** | `#3D654C` / `#EAF2EC` | Elegant sage green for confirmed appointments |
| **Status - Pending** | `#9B6E23` / `#FAF4E8` | Warm antique amber for pending in-person check-in |
| **Status - Cancelled / Banned**| `#8A3333` / `#F8EEEE` | Muted deep crimson for cancellations and restrictions |

### Typography Hierarchy
* **Headings (`font-serif`):** `Playfair Display` (Weights: 500, 600, 700) for page headlines, dashboard greetings, metric titles, and modal headers.
* **Body & Data (`font-sans`):** `Inter` (Weights: 400, 500, 600) for high-density data tables, form inputs, status tags, and calendar blocks.

### Component Guidelines (Shadcn Reference)
* **Corner Radius:** Soft, luxurious curvature: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for buttons/inputs, `rounded-2xl` for modals and stat summaries.
* **Elevation & Borders:** Low-contrast borders (`border border-border/70`) combined with subtle ambient shadows (`shadow-sm`, `shadow-md`), avoiding harsh flat borders.
* **Toast Notification Engine:** Sonner configured with `position="top-left"`, styled using `#F5F1EA` background, `#533C2E` text, and `#B2967D` border accents.

---

## Database Architecture & Schema (Supabase / PostgreSQL)

### 1. Core Profiles & Access Control
* **`profiles`**
  * `id`: UUID (Primary Key, references `auth.users.id` on delete cascade)
  * `role`: Enum (`'user'`, `'client'`, `'admin'`) - defaults to `'user'`
  * `status`: Enum (`'active'`, `'suspended'`, `'banned'`, `'rejected'`) - defaults to `'active'`
  * `first_name`: Text
  * `last_name`: Text
  * `phone`: Text
  * `email`: Text
  * `avatar_url`: Text (stored in Supabase bucket `avatars`)
  * `date_of_birth`: Date (nullable)
  * `emergency_contact_name`: Text (nullable)
  * `emergency_contact_phone`: Text (nullable)
  * `medical_allergies`: Text (nullable)
  * `ban_reason`: Text (nullable)
  * `banned_at`: Timestamptz (nullable)
  * `banned_by`: UUID (references `profiles.id`, nullable)
  * `created_at`, `updated_at`: Timestamptz

### 2. Session Catalog & Session Types
* **`session_types`** (Categories / Treatment Classifications)
  * `id`: UUID (Primary Key)
  * `name`: Text (e.g., "Facial Treatments", "Injectables", "Body Contouring", "Wellness")
  * `slug`: Text (Unique, e.g., "facial-treatments")
  * `description`: Text
  * `default_duration_minutes`: Integer (e.g., 45, 60, 90)
  * `buffer_minutes`: Integer (cleaning / preparation buffer, default: 15)
  * `is_active`: Boolean (default: true)
  * `created_at`: Timestamptz

* **`sessions`** (Specific Offerings & Treatment Services)
  * `id`: UUID (Primary Key)
  * `session_type_id`: UUID (references `session_types.id`)
  * `title`: Text (e.g., "Microneedling Deep Collagen Infusion")
  * `slug`: Text (Unique, e.g., "microneedling-collagen-infusion")
  * `description`: Text
  * `benefits`: Text[] (array of key clinical benefits)
  * `pricing`: Numeric(10, 2) (e.g., 185.00)
  * `currency`: Text (default: "GBP")
  * `duration_minutes`: Integer
  * `max_slots`: Integer (default: 1 for 1-on-1 private appointments, or N for masterclasses)
  * `location`: Text (e.g., "Room 2 - Aesthetic Suite A", or Clinic Main Address)
  * `is_ongoing`: Boolean (default: true; if false, bound to date range below)
  * `active_from`: Timestamptz (nullable)
  * `active_until`: Timestamptz (nullable)
  * `image_url`: Text (media bucket path)
  * `status`: Enum (`'draft'`, `'active'`, `'archived'`, `'cancelled'`)
  * `cancel_reason`: Text (nullable)
  * `cancelled_at`: Timestamptz (nullable)
  * `created_at`, `updated_at`: Timestamptz

### 3. Calendar Availability & Exception Rules
* **`availability_rules`** (Weekly Recurring Working Hours)
  * `id`: UUID (Primary Key)
  * `day_of_week`: Integer (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  * `start_time`: Time (e.g., "09:00:00")
  * `end_time`: Time (e.g., "18:00:00")
  * `session_id`: UUID (nullable; if null, applies clinic-wide)
  * `is_active`: Boolean (default: true)

* **`availability_exceptions`** (Holidays, Sick Days, Maintenance, Custom Hours)
  * `id`: UUID (Primary Key)
  * `date`: Date
  * `start_time`: Time (nullable; if null and `is_unavailable`=true, whole day blocked)
  * `end_time`: Time (nullable)
  * `is_unavailable`: Boolean (default: true)
  * `reason`: Text (e.g., "Bank Holiday", "Clinic Sanitization", "Special VIP Hours")
  * `created_at`: Timestamptz

### 4. Bookings & In-Person Payments
* **`bookings`**
  * `id`: UUID (Primary Key)
  * `booking_reference`: Text (Unique human-friendly code, e.g., "AUR-89214")
  * `client_id`: UUID (references `profiles.id`)
  * `session_id`: UUID (references `sessions.id`)
  * `appointment_date`: Date
  * `start_time`: Time
  * `end_time`: Time
  * `slot_count`: Integer (default: 1)
  * `status`: Enum:
    * `'pending'`: Awaiting clinic confirmation / scheduled
    * `'confirmed'`: Confirmed by clinic
    * `'completed'`: Treatment rendered in clinic
    * `'cancelled_by_client'`: Cancelled by user via dashboard
    * `'cancelled_by_admin'`: Cancelled by clinic administrator
    * `'no_show'`: Client missed appointment
  * `payment_status`: Enum:
    * `'pending_in_person'`: Will pay upon arrival
    * `'paid_in_person'`: Paid at clinic desk (cash, card terminal)
    * `'waived'`: Complimentary / promotional
    * `'refunded_in_person'`: Refunded in clinic
  * `payment_method_note`: Text (e.g., "Chip & PIN Terminal", "Cash", "Gift Voucher")
  * `total_price`: Numeric(10, 2)
  * `client_notes`: Text (concerns, requests submitted during booking)
  * `admin_notes`: Text (internal clinic notes)
  * `cancel_reason`: Text (nullable)
  * `cancelled_at`: Timestamptz (nullable)
  * `cancelled_by`: UUID (references `profiles.id`, nullable)
  * `created_at`, `updated_at`: Timestamptz

### 5. Historical & Audit Logging Tables
* **`user_login_history`**
  * `id`: UUID (Primary Key)
  * `user_id`: UUID (references `profiles.id`)
  * `ip_address`: Text
  * `user_agent`: Text
  * `auth_method`: Text (e.g., "email_password", "magic_link", "oauth")
  * `status`: Enum (`'success'`, `'failed'`)
  * `created_at`: Timestamptz

* **`session_history`** (Audit of Session & Treatment modifications)
  * `id`: UUID (Primary Key)
  * `session_id`: UUID (references `sessions.id`)
  * `changed_by`: UUID (references `profiles.id`)
  * `action`: Enum (`'created'`, `'updated'`, `'archived'`, `'cancelled'`)
  * `diff_snapshot`: JSONB (captures before & after values)
  * `change_summary`: Text
  * `created_at`: Timestamptz

* **`booking_history`** (Audit of Booking transitions)
  * `id`: UUID (Primary Key)
  * `booking_id`: UUID (references `bookings.id`)
  * `changed_by`: UUID (references `profiles.id`)
  * `old_status`: Text
  * `new_status`: Text
  * `old_payment_status`: Text
  * `new_payment_status`: Text
  * `reason`: Text (nullable)
  * `created_at`: Timestamptz

* **`user_status_history`** (Audit of Role Promotions, Bans, Rejections)
  * `id`: UUID (Primary Key)
  * `user_id`: UUID (references `profiles.id`)
  * `changed_by`: UUID (references `profiles.id`)
  * `old_role`: Text
  * `new_role`: Text
  * `old_status`: Text
  * `new_status`: Text
  * `reason`: Text
  * `created_at`: Timestamptz

* **`clinical_treatment_records`** *(Suggested Addition)*
  * `id`: UUID (Primary Key)
  * `booking_id`: UUID (references `bookings.id`)
  * `client_id`: UUID (references `profiles.id`)
  * `practitioner_id`: UUID (references `profiles.id`)
  * `clinical_notes`: Text (confidential skin analysis, needle depth, serums used)
  * `before_photo_url`: Text (secure storage)
  * `after_photo_url`: Text (secure storage)
  * `aftercare_instructions_sent`: Boolean
  * `created_at`: Timestamptz

---

## Supabase Storage Buckets & Edge Functions

### Storage Buckets
1. **`treatment-media`** (Public Read, Admin Write): High-resolution session imagery, treatment demonstration assets.
2. **`client-avatars`** (Public Read, Authenticated User Write): Profile avatars.
3. **`clinical-records`** (Private, Restricted by RLS): Private before/after treatment documentation only accessible by the respective client and administrators.

### Edge Functions
1. **`record-login-event`**: Triggered via Supabase auth hook to securely capture IP, User Agent, and timestamp into `user_login_history`.
2. **`handle-booking-created`**: Promotes user role from `'user'` to `'client'` upon their first booking, logs the booking history, and triggers email notifications.
3. **`dispatch-appointment-reminders`**: Scheduled cron function (runs every morning) to send appointment reminders for upcoming sessions in the next 24-48 hours.

---

## Page Route Map & UI Architecture

All user-specific flows use dedicated slugged routes rather than cluttering modals:

```
app/
├── (public)/
│   ├── page.tsx                               # Luxury landing page (updated with dynamic CTAs)
│   ├── treatments/
│   │   ├── page.tsx                           # Catalog of all active treatments
│   │   └── [slug]/page.tsx                    # Detailed treatment showcase page
│   └── book/
│       └── [slug]/page.tsx                    # Dedicated slugged booking page (date/time picker, intake)
│
├── (auth)/
│   ├── login/page.tsx                         # Client & Admin sign in
│   ├── signup/page.tsx                        # New account registration
│   ├── forgot-password/page.tsx               # Password reset request
│   ├── reset-password/page.tsx                # Password update callback
│   └── auth/callback/route.ts                 # Supabase OAuth/email auth handler
│
├── (client)/
│   ├── dashboard/page.tsx                     # Client Home: upcoming appointments, recent care, quick book
│   ├── bookings/
│   │   ├── page.tsx                           # Full list of active & completed bookings
│   │   └── [id]/page.tsx                      # Booking detail: directions, in-person payment guide, cancel action
│   └── profile/page.tsx                       # Profile settings, medical allergies, emergency contact
│
├── (admin)/admin/
│   ├── layout.tsx                             # Admin sidebar (Auralixa gold & bronze styling), breadcrumbs
│   ├── page.tsx                               # Executive Dashboard (daily appointments, revenue, quick actions)
│   ├── sessions/
│   │   ├── page.tsx                           # Sessions inventory list (search, filters, capacity, status)
│   │   ├── new/page.tsx                       # Create session page
│   │   ├── [id]/page.tsx                      # View session details & performance
│   │   └── [id]/edit/page.tsx                 # Full session editor (pricing, duration, availability)
│   ├── session-types/page.tsx                 # CRUD for categories (Facial, Injectables, etc.)
│   ├── calendar/page.tsx                      # Full visual calendar (day/week/month slot schedule)
│   ├── availability/page.tsx                  # Working hours manager & holiday/blackout exceptions
│   ├── bookings/
│   │   ├── page.tsx                           # Master bookings ledger with status/date filters
│   │   └── [id]/page.tsx                      # Booking detail: mark paid in-person, reschedule, clinical notes
│   ├── clients/
│   │   ├── page.tsx                           # Client directory (search, filter by active/banned)
│   │   └── [id]/page.tsx                      # Client 360: booking history, total spend, notes, ban/unban
│   ├── reporting/page.tsx                     # Business intelligence: popular sessions, revenue, cancellations
│   ├── history/page.tsx                       # Audit log explorer: login logs, session edits, booking changes
│   └── settings/page.tsx                      # Clinic parameters, cancellation window, email templates
│
└── unauthorized/page.tsx                      # Access denied screen for role mismatch or banned accounts
```

---

## Step-by-Step Implementation Roadmap

### Phase 1: Supabase Setup, Database Migration & Environment
* Install Supabase packages (`@supabase/supabase-js`, `@supabase/ssr`).
* Create environment variables template (`.env.example`) with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
* Author initial SQL migration script:
  * Extensions (`uuid-ossp`).
  * Enums for roles, statuses, and payments.
  * Tables: `profiles`, `session_types`, `sessions`, `availability_rules`, `availability_exceptions`, `bookings`.
  * Audit tables: `user_login_history`, `session_history`, `booking_history`, `user_status_history`, `clinical_treatment_records`.
  * Row Level Security (RLS) policies enforcing client data isolation and admin privileges.
  * Database triggers for auto-creating `profiles` on auth signup and auto-updating `updated_at` timestamps.

### Phase 2: Supabase Client, Auth & Role-Based Middleware
* Create server, browser, and middleware Supabase client utilities in `lib/supabase/`.
* Implement `middleware.ts` to enforce:
  * Route protection for `/admin/*` (requires `role === 'admin'`).
  * Route protection for `/dashboard`, `/bookings/*`, `/profile` (requires authenticated user).
  * Redirection to `/unauthorized` or `/login` if session is missing or user status is `'banned'`/`'rejected'`.
* Build Auth pages:
  * `/login`: Email + password with Auralixa luxury styling.
  * `/signup`: Registration page setting initial role `'user'`.
  * `/forgot-password` and `/reset-password`.

### Phase 3: Brand UI System, Top-Left Toast & Shared Shells
* Integrate `Sonner` toaster configured specifically to `position="top-left"` with custom styling matching `#F5F1EA`, `#533C2E`, and `#B2967D`.
* Scaffold Shadcn components needed for dashboards:
  * `Table`, `Badge`, `Card`, `Select`, `DropdownMenu`, `Tabs`, `Calendar`, `Popover`, `Sheet`, `Textarea`, `Skeleton`.
* Create reusable admin navigation layout (`app/(admin)/admin/layout.tsx`) with collapsible sidebar and clinic header.
* Create client portal navigation layout (`app/(client)/layout.tsx`).

### Phase 4: Public Catalog & Dedicated Slug Booking Flow
* Build `/treatments` and `/treatments/[slug]` showcase pages.
* Build `/book/[slug]` as a dedicated full-page booking experience:
  1. Date selection via dynamic calendar showing actual clinic availability.
  2. Time slot picker respecting buffer times and existing bookings.
  3. Client contact & skin concern intake fields.
  4. Summary step highlighting: **"Payment will be collected on premises upon treatment."**
* Implement the first-booking promotion logic:
  * If a user with role `'user'` successfully creates their first booking, immediately promote role to `'client'` and record in `user_status_history`.

### Phase 5: Client Dashboard & Booking Management
* Build `/dashboard`:
  * Welcome banner with client's name.
  * Upcoming appointments card with countdown and directions.
  * Past treatments history summary.
* Build `/bookings` and `/bookings/[id]`:
  * Detailed appointment view with reference code (`AUR-XXXXX`).
  * In-person payment instructions and preparation notes.
  * Cancellation dialog with reason input (respecting the 24h cancellation rule).
* Build `/profile`:
  * Personal information, contact numbers, emergency contact.
  * Skin allergies / medical intake notes for future appointments.

### Phase 6: Admin Session & Category Management (CRUD)
* Build `/admin/session-types`:
  * Add, edit, archive treatment categories.
* Build `/admin/sessions`:
  * Filterable table (active, ongoing, limited-time, archived).
* Build `/admin/sessions/new` and `/admin/sessions/[id]/edit`:
  * Full-page form with pricing, max slots, duration, buffer times, location, and ongoing/date-range controls.
  * Cancellation/deactivation trigger capturing `cancel_reason` and logging to `session_history`.

### Phase 7: Admin Calendar & Availability Engine
* Build `/admin/availability`:
  * Manage standard weekly operating hours per day.
  * Add holiday and blackout date exceptions with custom notes.
* Build `/admin/calendar`:
  * Rich visual agenda (Day, Week, Month views).
  * Color-coded appointment blocks based on status (`pending`, `confirmed`, `completed`, `cancelled`).
  * Click to view quick details or jump to `/admin/bookings/[id]`.

### Phase 8: Admin Bookings, Payment Desk & Client CRM
* Build `/admin/bookings`:
  * Master bookings table with date range picker, search by client/code, status filters.
* Build `/admin/bookings/[id]`:
  * Complete booking ledger sheet.
  * Status transition controls (`Confirm`, `Complete`, `Mark No-Show`, `Cancel with Reason`).
  * Payment Desk action: **"Mark Paid In-Person"** with payment method selector (Cash, Card Terminal, Voucher).
  * Audit trail sidebar displaying all status transitions from `booking_history`.
* Build `/admin/clients`:
  * Client directory showing visit counts and account status.
* Build `/admin/clients/[id]`:
  * Comprehensive client file: contact info, all past and upcoming bookings, clinical notes.
  * User moderation controls: **Ban User** / **Reject User** / **Reinstate** with mandatory reason prompt, logged to `user_status_history`.

### Phase 9: Reporting, Analytics & Audit History
* Build `/admin/reporting`:
  * Key Performance Indicators: Total Bookings, In-Person Revenue Collected, Cancelled Rate, Top 5 Treatments.
  * Visual distribution charts (appointments by day of week, peak hours).
* Build `/admin/history`:
  * Unified audit explorer with filter tabs:
    * Login Activity (IP, browser, timestamps).
    * Session Modifications (before/after JSON diffs).
    * Booking Status Transitions.
    * User Role / Moderation Changes.

### Phase 10: Verification, Security Hardening & Edge Cases
* Test and verify RLS isolation:
  * Ensure clients can only read/edit their own bookings and profiles.
  * Ensure public users can view active sessions and availability slots without accessing private client data.
  * Ensure only admins can access `/admin/*` and perform mutations on sessions, availability, and moderation.
* Validate all top-left toast responses across forms, errors, and actions.
* Verify responsive styling on mobile, tablet, and desktop viewports.

---

## Verification Plan

### Automated Tests & Linting
* Run TypeScript type checking: `pnpm tsc --noEmit`
* Run Next.js build verification: `pnpm build`
* Run ESLint checks: `pnpm lint`

### Manual End-to-End Verification Scenarios
1. **User Signup to Client Promotion Flow:**
   - Sign up a new user via `/signup`. Verify initial role is `'user'` in database.
   - Navigate to `/book/microneedling` and submit a booking.
   - Confirm role transitions to `'client'` and booking appears in `/bookings`.
2. **In-Person Payment Cycle:**
   - Client books session (marked `'pending_in_person'`).
   - Admin logs into `/admin/bookings/[id]`, marks treatment as `'completed'` and payment as `'paid_in_person'`.
   - Client views `/bookings/[id]` and sees updated payment status.
3. **Availability & Blackout Conflict Test:**
   - Admin sets blackout date for tomorrow in `/admin/availability`.
   - Client attempts to book tomorrow on `/book/[slug]` and verifies date is blocked out.
4. **Admin Moderation Flow:**
   - Admin navigates to `/admin/clients/[id]` and bans a test user with a reason.
   - Test user tries to access `/dashboard` or make a new booking; verifies access is denied with proper messaging.
5. **Toast Placement:**
   - Trigger success and error actions across public, client, and admin pages to ensure toasts always display on the top-left with Auralixa branding.
