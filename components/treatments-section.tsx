'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TREATMENT_CATEGORIES, getAllCategories, getTreatmentsByCategory } from '@/lib/treatments'
import type { TreatmentCategory } from '@/lib/treatments'
import { ChevronRight } from 'lucide-react'

interface TreatmentsSectionProps {
  onTreatmentSelect: (treatmentName: string) => void
}

export function TreatmentsSection({ onTreatmentSelect }: TreatmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<TreatmentCategory>('facial')
  const treatments = getTreatmentsByCategory(activeTab)
  const categories = getAllCategories()

  return (
    <section id="treatments" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Our Treatments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of premium aesthetic and wellness treatments tailored to your unique needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-secondary'
              }`}
            >
              {TREATMENT_CATEGORIES[category]}
            </button>
          ))}
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              className="border border-border rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col"
            >
              {/* Card Header */}
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {treatment.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {treatment.description}
              </p>

              {/* Benefits List */}
              {treatment.benefits.length > 0 && (
                <div className="mb-6 pb-6 border-b border-border flex-grow">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {treatment.benefits.slice(0, 4).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                    {treatment.benefits.length > 4 && (
                      <li className="text-xs text-accent font-medium mt-2">
                        +{treatment.benefits.length - 4} more benefits
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => onTreatmentSelect(treatment.name)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Book Consultation
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
