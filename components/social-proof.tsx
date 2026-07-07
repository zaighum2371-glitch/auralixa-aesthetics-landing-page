'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Marketing Executive',
    content: 'Auralixa completely transformed my appearance with their Botox treatment. The results are natural and stunning. I couldn\'t be happier!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Jessica Chen',
    role: 'Entrepreneur',
    content: 'The HydraFacial was an absolute game-changer for my skin. I saw immediate results and the staff was incredibly professional.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Amanda Rodriguez',
    role: 'Fashion Designer',
    content: 'I\'ve tried many aesthetic clinics, but Auralixa stands out. The practitioners truly care about achieving natural-looking results.',
    rating: 5,
  },
]

export function SocialProof() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Trusted by Hundreds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real clients. See what our satisfied patients have to say about their Auralixa experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-foreground mb-4 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <p className="font-serif font-bold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Before/After Gallery */}
        <div className="pt-12 border-t border-border">
          <h3 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            Transformation Gallery
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { before: '/before-after/before-1.png', after: '/before-after/after-1.png', label: 'Skin Rejuvenation' },
              { before: '/before-after/before-2.png', after: '/before-after/after-2.png', label: 'Facial Contouring' },
              { before: '/before-after/before-3.png', after: '/before-after/after-3.png', label: 'Lip Enhancement' },
              { before: '/before-after/before-4.png', after: '/before-after/after-4.png', label: 'Under-Eye Treatment' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                {/* Before */}
                <div className="relative rounded-lg overflow-hidden h-64">
                  <Image
                    src={item.before}
                    alt={`Before - ${item.label}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded">
                    Before
                  </div>
                </div>

                {/* After */}
                <div className="relative rounded-lg overflow-hidden h-64">
                  <Image
                    src={item.after}
                    alt={`After - ${item.label}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-accent text-black text-xs font-medium px-3 py-1 rounded">
                    After
                  </div>
                </div>

                {/* Label */}
                <p className="text-center text-sm font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Results may vary. Photos are of actual clients with permission.
          </p>
        </div>
      </div>
    </section>
  )
}
