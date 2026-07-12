export type TreatmentCategory = 'facial' | 'injectables' | 'body' | 'wellness'

export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  description: string
  benefits: string[]
}

export const TREATMENT_CATEGORIES: Record<TreatmentCategory, string> = {
  facial: 'Facial Treatments',
  injectables: 'Injectables',
  body: 'Body Contouring',
  wellness: 'Wellness',
}

export const TREATMENTS: Treatment[] = [
  // Facial Treatments
  {
    id: 'microneedling',
    name: 'Microneedling',
    category: 'facial',
    description: 'A minimally invasive treatment suitable for all skin tones. It uses tiny sterile needles to create controlled micro-injuries in the skin. These micro-channels stimulate the dermis to regenerate and boost collagen production, helping the skin repair and renew itself. Improves skin texture and tone.',
    benefits: ['Reduces acne scars', 'Boosts collagen production', 'Improves surgical and injury scars', 'Helps with burn marks', 'Minimizes stretch marks', 'Tightens enlarged pores', 'Lightens pigmentation', 'Reduces sun damage and dark spots', 'Softens fine lines and wrinkles', 'Brightens dull skin', 'Leaves skin smoother, firmer & more supple'],
  },
  {
    id: 'glutathione-skin-brightening',
    name: 'Glutathione Skin Brightening',
    category: 'facial',
    description: 'Glutathione is a powerful antioxidant that supports cell protection, assists with nutrient processing, and helps keep the immune system functioning well. (4 to 6 treatments are required)',
    benefits: ['Brightens overall complexion', 'Helps fade dark spots', 'Reduces pigmentation', 'Supports anti-ageing', 'Promotes healthy glowing skin', 'Helps reduce inflammation', 'Protects against oxidative stress', 'Supports skin elasticity'],
  },
  {
    id: 'nano-whitening-facial',
    name: 'Nano Whitening Facial',
    category: 'facial',
    description: 'The Nano Whitening Facial is a high-performance brightening treatment that uses nano-technology to deliver powerful whitening and antioxidant ingredients deep into the skin. Designed to target dullness, pigmentation, and uneven skin tone, this facial helps reduce dark spots, inhibit excess melanin production, and enhance overall radiance. Its gentle, non-invasive nano-infusion process boosts absorption, allowing the skin to appear clearer, smoother, and noticeably more luminous after each session.',
    benefits: ['Skin care product absorption', 'Minimizes large pores', 'Improves skin texture & tone', 'Improves hydration', 'Reduces pigmentation', 'Reduces dark undereyes'],
  },
  {
    id: 'bb-glow',
    name: 'BB Glow',
    category: 'facial',
    description: 'BB Glow is a semi-permanent makeup in which a tinted serum is introduced into the skin using micro-needling technology. It promotes skin rejuvenation and collagen production. It hides pigmentation making skin brighter. Serums contain peptides and natural growth factors. Non-invasive treatment. Results last 3 months with proper aftercare. Longevity of results may require multiple treatments.',
    benefits: ['Gives youthful and radiant complexion', 'Moisturises the skin', 'Gives you non-makeup, makeup look', 'Reduces the appearance of fine lines/wrinkles', 'Reduces visibility of pores, black heads', 'Hides blemishes & covers up redness'],
  },
  {
    id: 'dermaroller',
    name: 'Dermaroller',
    category: 'facial',
    description: 'Dermaroller is handheld device with tiny needles that\'s used to improves skins appearance and texture. Needles are punctured in skin to cause minor injuries in skin which then heals. It stimulates the production of collagen and elastin. Also helps hair regrowth.',
    benefits: ['Acne scars', 'Stretch marks', 'Helps with fine lines and wrinkles', 'Loss of skin firmness', 'Skin texture', 'Hyperpigmentation', 'Large pores', 'Helps absorb skin care products', 'Promotes hair growth'],
  },
  {
    id: 'microdermabrasion',
    name: 'Microdermabrasion',
    category: 'facial',
    description: 'A gentle, non-invasive exfoliation treatment that removes dead skin cells to reveal a smoother, brighter complexion. Microdermabrasion helps improve skin texture, reduce fine lines, lighten dark spots, and minimize clogged pores, leaving the skin refreshed and revitalized.',
    benefits: ['Gently exfoliates and smooths skin texture', 'Brightens dull, tired-looking skin', 'Helps reduce fine lines and wrinkles', 'Lightens dark spots and sun damage', 'Minimizes the appearance of pores', 'Improves congestion and clogged pores', 'Enhances product absorption for better results'],
  },
  {
    id: 'dermaplaning',
    name: 'Dermaplaning',
    category: 'facial',
    description: 'Dermaplaning is a skin rejuvenation treatment using a sterile scalpel tool. It will remove 21 days worth of dead skin cells by gently removing the top layer of the dermis in a safe and controlled manner. It cleans the skin in way of exfoliation and stimulates cell turnover. Also removes vellus hair (peach fuzz). The removal of vellus hair makes makeup application smooth. Skin is more brighter and youthful. Non-invasive',
    benefits: ['Reduces fine lines and wrinkles', 'Removes peach fuzz', 'Helps with acne scarring', 'Removes dead skin cells', 'Removes trapped dirt and oil from skin', 'Stimulates production of collagen', 'Exfoliates skin', 'Helps sun damaged skin'],
  },
  {
    id: 'led-light-therapy',
    name: 'LED Light Therapy',
    category: 'facial',
    description: 'LED therapy emits low light wave lengths through the skin. It stimulates the body\'s production of ATP while igniting your body\'s synthesis of collagen and elastin. As we age the, production of ATP dimishes. Also supports normal cell growth and stimulates the production of new vessels for improved flow to the skin. RED light can be used for SKIN CANCER',
    benefits: ['Anti-Aging', 'Detoxifying', 'Pigmentation', 'Helps, Rosacea, Dermatitis, Eczema, Psoriasis', 'Congested Acne', 'Inflammatory Acne', 'Healing Wounds', 'Sun Damage', 'Skin Cancer'],
  },
  {
    id: 'hydrafacial',
    name: 'Hydrafacial',
    category: 'facial',
    description: 'Hydrafacial is non invasive treatment using water and oxygen. The pores are vacuumed out while the active ingredients are pushed in skin. Results are instant & visible after 1 treatment. Step 1: Lactic acid and glucosamine based serum is used to extract debris from skin. Step 2: Glycolic acid & salicylic acid is used to peel debris in blocked pores from acne/oily prone skin. Step 3: Delivering key ingredients to hydrate deeper layers of the skin.',
    benefits: ['Helps textured skin', 'Advanced signs of aging', 'Oily and congested skin', 'Enlarged pores', 'Removes dirt from pores', 'Hydrates skin', 'Fine lines/wrinkles'],
  },
  {
    id: 'high-frequency-facial',
    name: 'High Frequency Tools Facial',
    category: 'facial',
    description: 'This targeted facial uses high-frequency technology to oxygenate the skin and eliminate acne-causing bacteria. The gentle electrical current boosts circulation, reduces inflammation, and supports faster healing, leaving the complexion clearer, calmer, and more radiant.',
    benefits: ['Helps kill acne-causing bacteria', 'Reduces active breakouts and heals skin', 'Minimizes inflammation', 'Reduces redness, and puffiness', 'Boosts circulation for a healthier, brighter glow', 'Stimulates collagen and elastin production', 'Improves product absorption', 'Reduce excess oil', 'Promotes clearer, smoother, more balanced skin'],
  },

  // Injectables
  {
    id: 'platelet-rich-plasma-hair',
    name: 'Platelet Rich Plasma (PRP) Hair Regrowth',
    category: 'injectables',
    description: 'Hair PRP is a treatment that uses your own blood to help stimulate natural hair growth. The process involves taking a small sample of your blood, spinning it in a centrifuge to separate the plasma that contains a high concentration of growth factors, and then injecting that plasma into areas of the scalp where hair is thinning.',
    benefits: ['Strengthen existing hair', 'Improve blood supply to hair follicles', 'Promote thicker, healthier hair', 'Encourage inactive hair follicles to grow again'],
  },
  {
    id: 'mesotherapy-anti-wrinkle',
    name: 'Mesotherapy|Anti Wrinkle Injection',
    category: 'injectables',
    description: 'Mesotherapy is a non surgical cosmetic treatment that involves injection small amounts of vitamins, minerals, amino acids, hyaluronic acid, or other therapeutic substances directly into the middle layer of the skin (mesoderm). Promotes collagen and elastin production, gives skin a youthful appearance, brightens, pigmentation, tightens loose skin',
    benefits: [],
  },
  {
    id: 'advanced-boosters-pdrn',
    name: 'Advanced Boosters with Microneedling - PDRN Rejuvenation',
    category: 'injectables',
    description: 'PDRN (Polydeoxyribonucleotide) is a DNA-based regenerative ingredient derived from salmon DNA, known for its skin healing & rejuvenating properties.',
    benefits: ['Stimulates collagen and elastin production for firmer skin', 'Improves skin texture, tone, and elasticity', 'Reduces fine lines, wrinkles, and acne scars', 'Enhances skin hydration and suppleness', 'Promotes cellular regeneration and skin repair', 'Restores a radiant, youthful glow', 'Safe, natural, and biocompatible'],
  },
  {
    id: 'advanced-boosters-prp',
    name: 'Advanced Boosters with Microneedling - PRP Renewal Therapy',
    category: 'injectables',
    description: 'Stimulates collagen and elastin production, smooths fine lines and wrinkles, reduces acne scars and enlarged pores, improves skin texture and tone, restores a radiant, youthful glow, boosts skin hydration and firmness, uses your body\'s own growth factors for natural rejuvenation, minimizes signs of aging with minimal downtime',
    benefits: [],
  },
  {
    id: 'advanced-boosters-mesoglow',
    name: 'Advanced Boosters with Microneedling - Mesoglow',
    category: 'injectables',
    description: 'Nourishes and hydrates the skin, boosts collagen production, smooths fine lines and wrinkles, reduces enlarged pores',
    benefits: ['Improves skin texture and tone', 'Restores a radiant, youthful glow', 'Enhances elasticity and firmness', 'Helps pigmentation & evens skin tone'],
  },

  // Body Contouring
  {
    id: 'fat-dissolving-lemon-bottle',
    name: 'Fat Dissolving (Lemon Bottle)',
    category: 'body',
    description: 'The solution is injected directly into targeted fat areas, where it works by breaking down fat cells. These fat cells are then naturally eliminated by the body through the lymphatic and metabolic systems. The treatment focuses on contouring and sculpting rather than weight loss.',
    benefits: ['Double chin', 'Upper arms', 'Love handles', 'Tummy', 'Inner/outer thighs', 'Buttocks'],
  },

  // Wellness
  {
    id: 'vitamin-shots',
    name: 'Vitamin Shots',
    category: 'wellness',
    description: 'Customized vitamin injections tailored to your wellness needs',
    benefits: [
      'VITAMIN D - Supports immune system, strong bones, healthy muscles, strong teeth, helps hair growth, brain health, helps with dementia, reduce the risk of cancers.',
      'VITAMIN B12 - Promotes healthy DNA, helps prevent anemia, reduces tiredness, helps sensitive nerves, helps with insomnia, converts food into energy.',
      'BIOTIN - Keeps your skin, hair, nails & liver healthy, manages blood sugar levels.',
      'B COMPLEX - Boosts metabolism, burns fat, increase energy levels, aids in the normal maintenance of thyroid hormone production, maintains skin health, maintains heart health.',
      'VITAMIN C - Antioxidant, works with enzymes to make collagen, brightens skin & complexion, vitamin C can reach higher levels in the blood instead of taken by mouth. Boosts immune system, lowers Hypertension, maintains healthy skin & bones. Vitamin C along with cancer drugs could improve treatment of cancer.'
    ],
  },
]

export function getTreatmentsByCategory(category: TreatmentCategory): Treatment[] {
  return TREATMENTS.filter(t => t.category === category)
}

export function getAllCategories(): TreatmentCategory[] {
  return ['facial', 'injectables', 'body', 'wellness']
}
