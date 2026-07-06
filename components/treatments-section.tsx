'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TREATMENT_CATEGORIES, getAllCategories, getTreatmentsByCategory } from '@/lib/treatments'
import type { TreatmentCategory } from '@/lib/treatments'
import { Clock, DollarSign } from 'lucide-react'

interface TreatmentsSectionProps {
  onTreatmentSelect: (treatmentName: string) => void
}

export function TreatmentsSection({ onTreatmentSelect }: TreatmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<TreatmentCategory>('injectables')
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
              className="border border-border rounded-xl p-6 hover:shadow-lg transition-shadow bg-background"
            >
              {/* Card Header */}
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                {treatment.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {treatment.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span className="text-foreground font-medium">{treatment.price}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">{treatment.duration}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => onTreatmentSelect(treatment.name)}
                variant="outline"
                className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
