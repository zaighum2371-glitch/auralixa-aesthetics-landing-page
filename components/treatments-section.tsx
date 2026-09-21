'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface TreatmentsSectionProps {
  onTreatmentSelect: (treatmentName: string) => void
  sessionTypes?: any[]
  sessions?: any[]
}

export function TreatmentsSection({ onTreatmentSelect, sessionTypes = [], sessions = [] }: TreatmentsSectionProps) {
  const [activeTabId, setActiveTabId] = useState<string>('')

  // Set initial active tab
  useEffect(() => {
    if (sessionTypes.length > 0 && !activeTabId) {
      setActiveTabId(sessionTypes[0].id)
    }
  }, [sessionTypes, activeTabId])

  const activeCategory = sessionTypes.find(c => c.id === activeTabId) || sessionTypes[0]
  const categoryTreatments = sessions.filter(s => s.session_type_id === activeCategory?.id)

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
        {sessionTypes.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {sessionTypes.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTabId(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTabId === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-secondary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="border border-border rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col"
            >
              {/* Card Header */}
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {treatment.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {treatment.description}
              </p>

              {/* Benefits List */}
              {treatment.benefits && treatment.benefits.length > 0 && (
                <div className="mb-6 pb-6 border-b border-border flex-grow">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {treatment.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => onTreatmentSelect(treatment.title)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
              >
                Book Treatment
              </Button>
            </div>
          ))}

          {categoryTreatments.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No active treatments found for this category.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
