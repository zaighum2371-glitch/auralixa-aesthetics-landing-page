// Mock Data & Store for Auralixa Aesthetics Clinic Admin UI
// Designed for client-side testing and review before binding live Supabase queries

export interface MockCategory {
  id: string
  name: string
  slug: string
  description: string
  default_duration_minutes: number
  buffer_minutes: number
  is_active: boolean
}

export interface MockSession {
  id: string
  session_type_id: string
  category_name: string
  title: string
  slug: string
  description: string
  benefits: string[]
  pricing: number
  currency: string
  duration_minutes: number
  buffer_minutes: number
  max_slots: number
  location: string
  status: 'active' | 'draft' | 'archived'
  is_ongoing: boolean
  image_url?: string
}

export interface MockClient {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url: string | null
  date_of_birth: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_allergies: string
  role: 'client' | 'user'
  status: 'active' | 'suspended' | 'banned'
  total_bookings: number
  total_spend: number
  last_visit: string
  created_at: string
}

export interface MockBooking {
  id: string
  booking_reference: string
  client_id: string
  client_name: string
  client_email: string
  client_phone: string
  session_id: string
  session_title: string
  category_name: string
  appointment_date: string
  start_time: string
  end_time: string
  total_price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_client' | 'cancelled_by_admin' | 'no_show'
  payment_status: 'pending_in_person' | 'paid_in_person' | 'waived' | 'refunded_in_person'
  payment_method_note: string | null
  client_notes: string | null
  admin_notes: string | null
  cancel_reason: string | null
}

export const INITIAL_CATEGORIES: MockCategory[] = [
  {
    id: 'deb913aa-6a66-43d1-9c62-aa98cb790e92',
    name: 'Facial Treatments & Peels',
    slug: 'facial-treatments',
    description: 'Advanced non-invasive clinical facials, dermaplaning, medical-grade peels, and pore extractions.',
    default_duration_minutes: 60,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '7e360892-99e9-4411-bb90-6b6d36ec74d7',
    name: 'Collagen Induction & Microneedling',
    slug: 'collagen-induction-microneedling',
    description: 'Precision clinical microneedling, Dermaroller collagen stimulation, and dermal remodeling for scarring and texture.',
    default_duration_minutes: 60,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '1b446d54-f3a7-40e0-a8f2-88ffe1fc03e5',
    name: 'Skin Brightening & Glow',
    slug: 'skin-brightening',
    description: 'High-potency Glutathione infusions, Nano Whitening facials, and melanin-regulating complexion therapies.',
    default_duration_minutes: 45,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '8816ef25-2fc9-4cca-befb-546742af4fbc',
    name: 'Injectables & Skin Boosters',
    slug: 'injectables-skin-boosters',
    description: 'Doctor-administered PDRN cellular repair, Mesoglow, PRP renewal, and targeted anti-wrinkle micro-injections.',
    default_duration_minutes: 45,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '282d45ee-e01d-497e-802c-435fc91ae8a1',
    name: 'Rejuvenation & BB Glow',
    slug: 'rejuvenation-therapy',
    description: 'Clinical diamond microdermabrasion, semi-permanent BB Glow peptide infusion, and deep cellular resurfacing.',
    default_duration_minutes: 60,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '2797d505-493e-4a8a-b73d-ed9f2e1c42ab',
    name: 'Body Contouring & Sculpting',
    slug: 'body-contouring',
    description: 'Targeted fat dissolving (Lemon Bottle), localized cryotherapy contouring, and metabolic lymphatic drainage.',
    default_duration_minutes: 60,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '7f10b96b-4a1c-4f12-82c0-dcadfc7e58c9',
    name: 'Wellness & Vitamin Injections',
    slug: 'wellness-vitamin-injections',
    description: 'Intramuscular nutrient shots including Vitamin B12, Vitamin D, Biotin, B-Complex, and high-potency Vitamin C.',
    default_duration_minutes: 30,
    buffer_minutes: 10,
    is_active: true,
  },
  {
    id: '5372b74e-ce86-44ce-a794-58d708d6ad31',
    name: 'Laser & LED Light Therapies',
    slug: 'laser-led-therapies',
    description: 'Medical-grade phototherapy, high-frequency antibacterial currents, and cellular collagen stimulation.',
    default_duration_minutes: 45,
    buffer_minutes: 15,
    is_active: true,
  },
  {
    id: '10122140-412a-408c-b116-26f2671b958f',
    name: 'Consultations & Skin Diagnostics',
    slug: 'consultations-diagnostics',
    description: 'Comprehensive digital skin health analysis, allergy review, and bespoke aesthetic treatment curation.',
    default_duration_minutes: 30,
    buffer_minutes: 10,
    is_active: true,
  },
  {
    id: 'b7d7a03f-c576-477c-ae66-3cca461e3e95',
    name: 'Bespoke Packages & Curations',
    slug: 'bespoke-packages',
    description: 'Multi-modality treatment sequences, bridal skin preparation, and intensive multi-week aesthetic courses.',
    default_duration_minutes: 90,
    buffer_minutes: 20,
    is_active: true,
  },
]

export const INITIAL_SESSIONS: MockSession[] = [
  {
    id: 'ses-1',
    session_type_id: 'cat-1',
    category_name: 'Facial Aesthetics',
    title: 'Microneedling Collagen Infusion',
    slug: 'microneedling-collagen-infusion',
    description: 'Precision automated micro-punctures paired with targeted pure hyaluronic and peptide serums to stimulate fibroblast collagen genesis.',
    benefits: ['Stimulates natural collagen', 'Minimizes pore diameter', 'Softens fine lines & texture'],
    pricing: 185.00,
    currency: 'GBP',
    duration_minutes: 60,
    buffer_minutes: 15,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 1',
    status: 'active',
    is_ongoing: true,
  },
  {
    id: 'ses-2',
    session_type_id: 'cat-2',
    category_name: 'Skin Brightening',
    title: 'Glutathione Radiance Complex',
    slug: 'glutathione-radiance-complex',
    description: 'Intensive transdermal brightening therapy utilizing medical-grade reduced glutathione and pure ascorbic acid to reverse hyperpigmentation.',
    benefits: ['Inhibits melanin synthesis', 'Even skin tone & radiance', 'Combats oxidative stress'],
    pricing: 220.00,
    currency: 'GBP',
    duration_minutes: 45,
    buffer_minutes: 15,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 2',
    status: 'active',
    is_ongoing: true,
  },
  {
    id: 'ses-3',
    session_type_id: 'cat-1',
    category_name: 'Facial Aesthetics',
    title: 'Nano-Peptide Lift & Sculpt',
    slug: 'nano-peptide-lift-sculpt',
    description: 'Targeted micro-channeling with bio-mimetic peptides designed to firm the jawline, plump cheek contours, and restore structural firmness.',
    benefits: ['Lifts contour & firming', 'Intense cellular hydration', 'Immediate event radiance'],
    pricing: 260.00,
    currency: 'GBP',
    duration_minutes: 75,
    buffer_minutes: 15,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 1',
    status: 'active',
    is_ongoing: true,
  },
  {
    id: 'ses-4',
    session_type_id: 'cat-4',
    category_name: 'Rejuvenation Therapy',
    title: 'BB Glow Semi-Permanent Glow',
    slug: 'bb-glow-semi-permanent-glow',
    description: 'Infusion of nourishing plant extracts and tinted light-reflecting serums using nano-needling for an airbrushed, foundation-free complexion.',
    benefits: ['Camouflages redness & blemishes', 'Unified glowing finish', 'Zero recovery downtime'],
    pricing: 195.00,
    currency: 'GBP',
    duration_minutes: 60,
    buffer_minutes: 15,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 3',
    status: 'active',
    is_ongoing: true,
  },
  {
    id: 'ses-5',
    session_type_id: 'cat-4',
    category_name: 'Rejuvenation Therapy',
    title: 'Clinical Diamond Microdermabrasion',
    slug: 'clinical-diamond-microdermabrasion',
    description: 'Mechanical vacuum exfoliation using medical-grade diamond tips to sweep away keratinized cells and decongest congested skin barriers.',
    benefits: ['Deep pore purification', 'Smooths irregular texture', 'Enhances serum penetration'],
    pricing: 140.00,
    currency: 'GBP',
    duration_minutes: 45,
    buffer_minutes: 15,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 2',
    status: 'active',
    is_ongoing: true,
  },
  {
    id: 'ses-6',
    session_type_id: 'cat-3',
    category_name: 'Advanced Peels',
    title: 'TCA Bio-Renew Chemical Resurfacing',
    slug: 'tca-bio-renew-resurfacing',
    description: 'Controlled medium-depth chemical peeling solution targeting solar damage, stubborn post-acne marks, and photodamage.',
    benefits: ['Rapid cellular turnover', 'Clears stubborn hyperpigmentation', 'Refines deep skin texture'],
    pricing: 245.00,
    currency: 'GBP',
    duration_minutes: 60,
    buffer_minutes: 20,
    max_slots: 1,
    location: 'Auralixa Clinic - Suite 1',
    status: 'draft',
    is_ongoing: true,
  },
]

export const INITIAL_CLIENTS: MockClient[] = [
  {
    id: 'cli-1',
    first_name: 'Lady Eleanor',
    last_name: 'Vance',
    email: 'eleanor.vance@mayfairluxury.co.uk',
    phone: '+44 7700 900123',
    avatar_url: null,
    date_of_birth: '1988-04-12',
    address_line1: '14 Grosvenor Square',
    address_line2: 'Apartment 4B',
    city: 'London',
    state: 'Greater London',
    postal_code: 'W1K 2HP',
    country: 'United Kingdom',
    emergency_contact_name: 'Lord Arthur Vance',
    emergency_contact_phone: '+44 7700 900124',
    medical_allergies: 'Mild topical latex sensitivity. No active medications.',
    role: 'client',
    status: 'active',
    total_bookings: 6,
    total_spend: 1110.00,
    last_visit: '2026-09-10',
    created_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'cli-2',
    first_name: 'Dr. Alexander',
    last_name: 'Sterling',
    email: 'alexander.sterling@harleyst.org',
    phone: '+44 7700 900456',
    avatar_url: null,
    date_of_birth: '1984-11-23',
    address_line1: '92 Harley Street',
    city: 'London',
    state: 'Greater London',
    postal_code: 'W1G 7HY',
    country: 'United Kingdom',
    emergency_contact_name: 'Dr. Clara Sterling',
    emergency_contact_phone: '+44 7700 900457',
    medical_allergies: 'None reported. Pre-treatment numbing agent approved.',
    role: 'client',
    status: 'active',
    total_bookings: 4,
    total_spend: 880.00,
    last_visit: '2026-09-12',
    created_at: '2026-05-18T14:30:00Z',
  },
  {
    id: 'cli-3',
    first_name: 'Charlotte',
    last_name: 'Hughes',
    email: 'charlotte.hughes@chelseadesign.com',
    phone: '+44 7700 900789',
    avatar_url: null,
    date_of_birth: '1993-07-08',
    address_line1: '28 King’s Road',
    address_line2: 'The Mews Studio',
    city: 'London',
    state: 'Greater London',
    postal_code: 'SW3 4UD',
    country: 'United Kingdom',
    emergency_contact_name: 'Julian Hughes',
    emergency_contact_phone: '+44 7700 900790',
    medical_allergies: 'Avoid heavy glycolic peels; prone to post-treatment flushing.',
    role: 'client',
    status: 'active',
    total_bookings: 3,
    total_spend: 575.00,
    last_visit: '2026-09-02',
    created_at: '2026-06-21T09:15:00Z',
  },
  {
    id: 'cli-4',
    first_name: 'Sophia',
    last_name: 'Laurent',
    email: 'sophia.laurent@kensington.paris',
    phone: '+44 7700 900999',
    avatar_url: null,
    date_of_birth: '1991-02-17',
    address_line1: '7 Kensington Palace Gardens',
    city: 'London',
    state: 'Greater London',
    postal_code: 'W8 4QP',
    country: 'United Kingdom',
    emergency_contact_name: 'Marc Laurent',
    emergency_contact_phone: '+33 6 12 34 56 78',
    medical_allergies: 'Sensitive to fragrance oils. Prefers organic botanical serums.',
    role: 'client',
    status: 'active',
    total_bookings: 5,
    total_spend: 1045.00,
    last_visit: '2026-09-13',
    created_at: '2026-05-02T11:45:00Z',
  },
  {
    id: 'cli-5',
    first_name: 'Marcus',
    last_name: 'Blackwood',
    email: 'marcus.blackwood@hedgefund.co.uk',
    phone: '+44 7700 900333',
    avatar_url: null,
    date_of_birth: '1979-09-30',
    address_line1: '55 Bishopsgate',
    city: 'London',
    state: 'Greater London',
    postal_code: 'EC2N 3AS',
    country: 'United Kingdom',
    emergency_contact_name: 'Helena Blackwood',
    emergency_contact_phone: '+44 7700 900334',
    medical_allergies: 'Late cancellation violation hold.',
    role: 'client',
    status: 'suspended',
    total_bookings: 2,
    total_spend: 380.00,
    last_visit: '2026-08-14',
    created_at: '2026-07-10T16:00:00Z',
  },
]

export const INITIAL_BOOKINGS: MockBooking[] = [
  {
    id: 'bk-1',
    booking_reference: 'AUR-89210',
    client_id: 'cli-1',
    client_name: 'Lady Eleanor Vance',
    client_email: 'eleanor.vance@mayfairluxury.co.uk',
    client_phone: '+44 7700 900123',
    session_id: 'ses-1',
    session_title: 'Microneedling Collagen Infusion',
    category_name: 'Facial Aesthetics',
    appointment_date: '2026-09-14',
    start_time: '10:00:00',
    end_time: '11:00:00',
    total_price: 185.00,
    status: 'confirmed',
    payment_status: 'pending_in_person',
    payment_method_note: 'Chip & PIN upon arrival',
    client_notes: 'Preparing for upcoming charity gala; please emphasize periorbital area.',
    admin_notes: 'VIP Client. Prepare botanical recovery ampoules.',
    cancel_reason: null,
  },
  {
    id: 'bk-2',
    booking_reference: 'AUR-19284',
    client_id: 'cli-2',
    client_name: 'Dr. Alexander Sterling',
    client_email: 'alexander.sterling@harleyst.org',
    client_phone: '+44 7700 900456',
    session_id: 'ses-2',
    session_title: 'Glutathione Radiance Complex',
    category_name: 'Skin Brightening',
    appointment_date: '2026-09-14',
    start_time: '11:30:00',
    end_time: '12:15:00',
    total_price: 220.00,
    status: 'pending',
    payment_status: 'pending_in_person',
    payment_method_note: null,
    client_notes: 'Repeat session 3 of 6 in brightening cycle.',
    admin_notes: null,
    cancel_reason: null,
  },
  {
    id: 'bk-3',
    booking_reference: 'AUR-74129',
    client_id: 'cli-4',
    client_name: 'Sophia Laurent',
    client_email: 'sophia.laurent@kensington.paris',
    client_phone: '+44 7700 900999',
    session_id: 'ses-3',
    session_title: 'Nano-Peptide Lift & Sculpt',
    category_name: 'Facial Aesthetics',
    appointment_date: '2026-09-14',
    start_time: '14:00:00',
    end_time: '15:15:00',
    total_price: 260.00,
    status: 'confirmed',
    payment_status: 'pending_in_person',
    payment_method_note: 'Requested card terminal payment',
    client_notes: 'Focus on jawline and nasolabial folds.',
    admin_notes: null,
    cancel_reason: null,
  },
  {
    id: 'bk-4',
    booking_reference: 'AUR-65231',
    client_id: 'cli-3',
    client_name: 'Charlotte Hughes',
    client_email: 'charlotte.hughes@chelseadesign.com',
    client_phone: '+44 7700 900789',
    session_id: 'ses-4',
    session_title: 'BB Glow Semi-Permanent Glow',
    category_name: 'Rejuvenation Therapy',
    appointment_date: '2026-09-13',
    start_time: '15:30:00',
    end_time: '16:30:00',
    total_price: 195.00,
    status: 'completed',
    payment_status: 'paid_in_person',
    payment_method_note: 'Chip & PIN Terminal - Barclaycard',
    client_notes: 'Loved previous result, refreshing tone.',
    admin_notes: 'Procedure rendered smoothly. Scheduled next appointment.',
    cancel_reason: null,
  },
  {
    id: 'bk-5',
    booking_reference: 'AUR-43921',
    client_id: 'cli-2',
    client_name: 'Dr. Alexander Sterling',
    client_email: 'alexander.sterling@harleyst.org',
    client_phone: '+44 7700 900456',
    session_id: 'ses-5',
    session_title: 'Clinical Diamond Microdermabrasion',
    category_name: 'Rejuvenation Therapy',
    appointment_date: '2026-09-12',
    start_time: '16:00:00',
    end_time: '16:45:00',
    total_price: 140.00,
    status: 'completed',
    payment_status: 'paid_in_person',
    payment_method_note: 'Cash Settlement (£140.00)',
    client_notes: null,
    admin_notes: 'Settled in full at front desk.',
    cancel_reason: null,
  },
  {
    id: 'bk-6',
    booking_reference: 'AUR-30219',
    client_id: 'cli-5',
    client_name: 'Marcus Blackwood',
    client_email: 'marcus.blackwood@hedgefund.co.uk',
    client_phone: '+44 7700 900333',
    session_id: 'ses-1',
    session_title: 'Microneedling Collagen Infusion',
    category_name: 'Facial Aesthetics',
    appointment_date: '2026-09-11',
    start_time: '09:30:00',
    end_time: '10:30:00',
    total_price: 185.00,
    status: 'no_show',
    payment_status: 'pending_in_person',
    payment_method_note: null,
    client_notes: null,
    admin_notes: 'Client did not attend or provide prior 24h cancellation notice. Account placed under review.',
    cancel_reason: 'Client did not attend scheduled slot',
  },
]
