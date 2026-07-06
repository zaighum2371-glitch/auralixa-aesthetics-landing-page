export type TreatmentCategory = 'injectables' | 'skincare' | 'body' | 'wellness'

export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  description: string
  price: string
  duration: string
}

export const TREATMENT_CATEGORIES: Record<TreatmentCategory, string> = {
  injectables: 'Injectables',
  skincare: 'Skincare',
  body: 'Body Contouring',
  wellness: 'Wellness',
}

export const TREATMENTS: Treatment[] = [
  // Injectables
  {
    id: 'botox',
    name: 'Botox',
    category: 'injectables',
    description: 'Smooth dynamic wrinkles and prevent new lines for a refreshed appearance.',
    price: '$250-400',
    duration: '10-15 mins',
  },
  {
    id: 'dermal-fillers',
    name: 'Dermal Fillers',
    category: 'injectables',
    description: 'Restore volume and enhance facial contours with hyaluronic acid fillers.',
    price: '$400-800',
    duration: '30-45 mins',
  },
  {
    id: 'lip-enhancement',
    name: 'Lip Enhancement',
    category: 'injectables',
    description: 'Create fuller, more defined lips with natural-looking results.',
    price: '$400-600',
    duration: '20-30 mins',
  },
  {
    id: 'tear-trough',
    name: 'Tear Trough Treatment',
    category: 'injectables',
    description: 'Reduce under-eye hollows and dark circles for a refreshed look.',
    price: '$500-700',
    duration: '30-40 mins',
  },
  {
    id: 'chin-augmentation',
    name: 'Chin Augmentation',
    category: 'injectables',
    description: 'Define and enhance your chin profile without surgery.',
    price: '$400-600',
    duration: '20-30 mins',
  },
  {
    id: 'cheek-lift',
    name: 'Cheek Lift',
    category: 'injectables',
    description: 'Elevate and define your cheekbones for a lifted appearance.',
    price: '$450-650',
    duration: '25-35 mins',
  },

  // Skincare
  {
    id: 'hydrafacial',
    name: 'HydraFacial',
    category: 'skincare',
    description: 'Deep cleansing and hydrating facial using vortex fusion technology.',
    price: '$150-250',
    duration: '30-45 mins',
  },
  {
    id: 'microneedling',
    name: 'Microneedling',
    category: 'skincare',
    description: 'Stimulate collagen production and improve skin texture and tone.',
    price: '$200-350',
    duration: '45-60 mins',
  },
  {
    id: 'chemical-peel',
    name: 'Chemical Peel',
    category: 'skincare',
    description: 'Exfoliate and renew skin surface for a brighter, smoother complexion.',
    price: '$150-300',
    duration: '30-45 mins',
  },
  {
    id: 'laser-resurfacing',
    name: 'Laser Resurfacing',
    category: 'skincare',
    description: 'Remove damaged skin and stimulate collagen for youthful glow.',
    price: '$300-600',
    duration: '30-60 mins',
  },
  {
    id: 'oxygen-therapy',
    name: 'Oxygen Therapy Facial',
    category: 'skincare',
    description: 'Infuse oxygen and serums deep into skin for luminous results.',
    price: '$180-280',
    duration: '45-60 mins',
  },
  {
    id: 'acne-treatment',
    name: 'Acne Treatment',
    category: 'skincare',
    description: 'Target acne and prevent breakouts with professional-grade treatments.',
    price: '$150-300',
    duration: '45-60 mins',
  },

  // Body Contouring
  {
    id: 'coolsculpting',
    name: 'CoolSculpting',
    category: 'body',
    description: 'Non-invasive fat reduction through controlled cooling technology.',
    price: '$500-1500',
    duration: '60 mins',
  },
  {
    id: 'ultrasound-therapy',
    name: 'Ultrasound Therapy',
    category: 'body',
    description: 'Tighten and lift skin using advanced ultrasound technology.',
    price: '$600-1200',
    duration: '60-90 mins',
  },
  {
    id: 'radiofrequency',
    name: 'Radiofrequency Treatment',
    category: 'body',
    description: 'Tighten and contour body with radiofrequency energy.',
    price: '$400-900',
    duration: '45-60 mins',
  },
  {
    id: 'cellulite-reduction',
    name: 'Cellulite Reduction',
    category: 'body',
    description: 'Reduce appearance of cellulite with advanced treatments.',
    price: '$300-600',
    duration: '45-60 mins',
  },
  {
    id: 'stretch-marks',
    name: 'Stretch Marks Treatment',
    category: 'body',
    description: 'Improve the appearance of stretch marks safely and effectively.',
    price: '$250-500',
    duration: '30-45 mins',
  },
  {
    id: 'body-tightening',
    name: 'Body Tightening',
    category: 'body',
    description: 'Firm and tighten loose skin on body areas.',
    price: '$400-800',
    duration: '60 mins',
  },

  // Wellness
  {
    id: 'iv-therapy',
    name: 'IV Therapy',
    category: 'wellness',
    description: 'Boost energy and immunity with customized IV nutrient infusions.',
    price: '$150-300',
    duration: '30-45 mins',
  },
  {
    id: 'vitamin-injection',
    name: 'Vitamin Injections',
    category: 'wellness',
    description: 'Enhance energy, metabolism, and wellness with targeted vitamins.',
    price: '$50-150',
    duration: '10-15 mins',
  },
]

export function getTreatmentsByCategory(category: TreatmentCategory): Treatment[] {
  return TREATMENTS.filter(t => t.category === category)
}

export function getAllCategories(): TreatmentCategory[] {
  return ['injectables', 'skincare', 'body', 'wellness']
}
