'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function seedCatalogIfEmpty() {
  const supabase = await createClient()

  // Check if categories already exist
  const { count: catCount } = await supabase
    .from('session_types')
    .select('*', { count: 'exact', head: true })

  if (catCount && catCount > 0) {
    return { success: true, message: 'Catalog already populated', seeded: false }
  }

  // 1. Seed Categories
  const categoriesToSeed = [
    {
      name: 'Facial Treatments & Peels',
      slug: 'facial-treatments',
      description: 'Advanced non-invasive clinical facials, dermaplaning, medical-grade peels, and pore extractions.',
      default_duration_minutes: 60,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Collagen Induction & Microneedling',
      slug: 'collagen-induction-microneedling',
      description: 'Precision clinical microneedling, Dermaroller collagen stimulation, and dermal remodeling for scarring and texture.',
      default_duration_minutes: 60,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Skin Brightening & Glow',
      slug: 'skin-brightening',
      description: 'High-potency Glutathione infusions, Nano Whitening facials, and melanin-regulating complexion therapies.',
      default_duration_minutes: 45,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Injectables & Skin Boosters',
      slug: 'injectables-skin-boosters',
      description: 'Doctor-administered PDRN cellular repair, Mesoglow, PRP renewal, and targeted anti-wrinkle micro-injections.',
      default_duration_minutes: 45,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Rejuvenation & BB Glow',
      slug: 'rejuvenation-therapy',
      description: 'Clinical diamond microdermabrasion, semi-permanent BB Glow peptide infusion, and deep cellular resurfacing.',
      default_duration_minutes: 60,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Body Contouring & Sculpting',
      slug: 'body-contouring',
      description: 'Targeted fat dissolving (Lemon Bottle), localized cryotherapy contouring, and metabolic lymphatic drainage.',
      default_duration_minutes: 60,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Wellness & Vitamin Injections',
      slug: 'wellness-vitamin-injections',
      description: 'Intramuscular nutrient shots including Vitamin B12, Vitamin D, Biotin, B-Complex, and high-potency Vitamin C.',
      default_duration_minutes: 30,
      buffer_minutes: 10,
      is_active: true,
    },
    {
      name: 'Laser & LED Light Therapies',
      slug: 'laser-led-therapies',
      description: 'Medical-grade phototherapy, high-frequency antibacterial currents, and cellular collagen stimulation.',
      default_duration_minutes: 45,
      buffer_minutes: 15,
      is_active: true,
    },
    {
      name: 'Consultations & Skin Diagnostics',
      slug: 'consultations-diagnostics',
      description: 'Comprehensive digital skin health analysis, allergy review, and bespoke aesthetic treatment curation.',
      default_duration_minutes: 30,
      buffer_minutes: 10,
      is_active: true,
    },
    {
      name: 'Bespoke Packages & Curations',
      slug: 'bespoke-packages',
      description: 'Multi-modality treatment sequences, bridal skin preparation, and intensive multi-week aesthetic courses.',
      default_duration_minutes: 90,
      buffer_minutes: 20,
      is_active: true,
    },
  ]

  const { data: seededCats, error: catError } = await supabase
    .from('session_types')
    .insert(categoriesToSeed)
    .select('id, slug, name')

  if (catError || !seededCats) {
    console.error('Failed to seed categories:', catError)
    throw new Error(`Failed to seed categories: ${catError?.message}`)
  }

  const catMap = Object.fromEntries(seededCats.map((c) => [c.slug, c.id]))

  // 2. Seed Treatments
  const sessionsToSeed = [
    {
      session_type_id: catMap['facial-aesthetics'],
      title: 'Microneedling Collagen Infusion',
      slug: 'microneedling-collagen-infusion',
      description: 'Medical-grade precision micro-channelling stimulates dermal fibroblasts and natural collagen production. Infused with sterile clinical hyaluronic acid and revitalizing peptides for comprehensive skin renewal.',
      benefits: [
        'Stimulates endogenous collagen & elastin synthesis',
        'Softens fine lines, acne scarring, and enlarged pores',
        'Enhances transdermal absorption of active peptides',
      ],
      pricing: 185.0,
      currency: 'GBP',
      duration_minutes: 60,
      buffer_minutes: 15,
      max_slots: 4,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['skin-brightening'],
      title: 'High-Potency Vitamin C Glow',
      slug: 'high-potency-vitamin-c-glow',
      description: 'Ultra-concentrated 20% L-Ascorbic acid infusion combined with medical glutathione and ferulic acid. Formulated to neutralize UV-induced oxidative damage, lift stubborn pigmentation, and restore luminous skin tone.',
      benefits: [
        'Dramatically reduces hyperpigmentation and sun spots',
        'Protects against free-radical cellular oxidation',
        'Instant radiance and uniform luminous tone',
      ],
      pricing: 150.0,
      currency: 'GBP',
      duration_minutes: 45,
      buffer_minutes: 15,
      max_slots: 5,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['facial-aesthetics'],
      title: 'Nano-Peptide Lift & Sculpt',
      slug: 'nano-peptide-lift-and-sculpt',
      description: 'High-performance bio-mimetic peptides coupled with microcurrent contouring. Tightens facial fascia, sculpts the jawline and cheek contours, and softens deep expression lines with zero downtime.',
      benefits: [
        'Sculpts jawline, cheekbones, and periorbital contours',
        'Firms lax skin with multi-molecular weight peptides',
        'Zero downtime red-carpet readiness',
      ],
      pricing: 260.0,
      currency: 'GBP',
      duration_minutes: 75,
      buffer_minutes: 15,
      max_slots: 3,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['rejuvenation-therapy'],
      title: 'BB Glow Semi-Permanent Glow',
      slug: 'bb-glow-semi-permanent-glow',
      description: 'Nano-needling infusion of tinted plant-based mineral pigments and niacinamide. Provides sheer, poreless foundation coverage lasting weeks while treating underlying discoloration.',
      benefits: [
        'Lightweight tinted mineral luminescence',
        'Smooths superficial imperfections and redness',
        'Enriched with botanical stem cells and vitamins',
      ],
      pricing: 195.0,
      currency: 'GBP',
      duration_minutes: 60,
      buffer_minutes: 15,
      max_slots: 4,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['rejuvenation-therapy'],
      title: 'Clinical Diamond Microdermabrasion',
      slug: 'clinical-diamond-microdermabrasion',
      description: 'Precision diamond-tipped vacuum exfoliation to remove dead stratum corneum cells, stimulate lymphatic drainage, and prepare tissue for high-potency topical infusion.',
      benefits: [
        'Mechanical resurfacing of coarse skin texture',
        'Clears congested follicular debris and blackheads',
        'Boosts cellular turnover and product penetration',
      ],
      pricing: 140.0,
      currency: 'GBP',
      duration_minutes: 45,
      buffer_minutes: 15,
      max_slots: 5,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['injectable-enhancements'],
      title: 'Profhilo Cellular Hydration',
      slug: 'profhilo-cellular-hydration',
      description: 'Ultra-pure thermal hyaluronic acid bioremodelling treatment administered across 5 Bio-Aesthetic Points (BAP). Hydrates tissue from within and stimulates 4 types of collagen.',
      benefits: [
        'Highest concentration of pure hyaluronic acid',
        'Bioremodels skin laxity across face and neck',
        'Restores deep tissue hydration without changing facial volume',
      ],
      pricing: 320.0,
      currency: 'GBP',
      duration_minutes: 45,
      buffer_minutes: 15,
      max_slots: 4,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
    {
      session_type_id: catMap['body-contouring'],
      title: 'Cryo-Sculpt Advanced Contouring',
      slug: 'cryo-sculpt-advanced-contouring',
      description: 'Thermal shock cryolipolysis induces targeted adipocyte apoptosis while stimulating microcirculation and dermal tightening across abdomen, flanks, or submental areas.',
      benefits: [
        'Non-invasive localized fat cell reduction',
        'Stimulates collagen and microcirculation',
        'Painless treatment with zero downtime',
      ],
      pricing: 290.0,
      currency: 'GBP',
      duration_minutes: 75,
      buffer_minutes: 15,
      max_slots: 3,
      location: 'Harley Street Clinic, Suite 4B',
      status: 'active' as const,
      is_ongoing: true,
    },
  ]

  const { data: seededSessions, error: sessionError } = await supabase
    .from('sessions')
    .insert(sessionsToSeed)
    .select('id, title, pricing')

  if (sessionError) {
    console.error('Failed to seed sessions:', sessionError)
    throw new Error(`Failed to seed sessions: ${sessionError.message}`)
  }

  // 3. Seed initial sample appointments for test client if test_user exists
  const { data: testClient } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .eq('email', 'test_user@gmail.com')
    .single()

  if (testClient && seededSessions && seededSessions.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    const sampleBookings = [
      {
        booking_reference: 'AUR-91823',
        client_id: testClient.id,
        session_id: seededSessions[0].id,
        appointment_date: today,
        start_time: '11:00:00',
        end_time: '12:00:00',
        total_price: seededSessions[0].pricing,
        status: 'confirmed' as const,
        payment_status: 'pending_in_person' as const,
        payment_method_note: null,
        client_notes: 'Repeat appointment, please apply mild topical numbing.',
        admin_notes: 'Initial clinical assessment completed.',
      },
      {
        booking_reference: 'AUR-84291',
        client_id: testClient.id,
        session_id: seededSessions[1]?.id || seededSessions[0].id,
        appointment_date: '2026-09-14',
        start_time: '14:30:00',
        end_time: '15:15:00',
        total_price: seededSessions[1]?.pricing || 150.0,
        status: 'pending' as const,
        payment_status: 'pending_in_person' as const,
        payment_method_note: null,
        client_notes: null,
        admin_notes: null,
      },
    ]

    await supabase.from('bookings').insert(sampleBookings)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/sessions')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/clients')

  return {
    success: true,
    message: `Seeded ${seededCats.length} categories and ${seededSessions?.length || 0} treatments.`,
    seeded: true,
  }
}
