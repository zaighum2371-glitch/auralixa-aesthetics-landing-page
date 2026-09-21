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
    name: 'Zaheeda',
    role: 'Microneedling Client',
    content: 'I have had 4 sessions of microneedling and I am impressed with the end results. My skin is now left looking fresh, plumped and smooth. Sadaf is very friendly and easy going. Would highly recommend her service.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Kathryn Miller',
    role: 'Facial Treatment',
    content: 'I had such a fantastic experience all thanks to Sadaf. I had really dry and tired skin but after my facial my face felt so soft and hydrated. I highly recommend this lovely lady she made me feel so welcome and relaxed.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Tahira Parveen',
    role: 'HydraFacial Client',
    content: 'I had a HydraFacial and honestly, my skin has never felt this clean and refreshed. The treatment was gentle, relaxing, and completely pain-free. It deeply cleansed my pores and left my face feeling super smooth and hydrated.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Samea Fatima',
    role: 'Aesthetic Treatment',
    content: 'I had an excellent experience with Sadaf. She was professional, knowledgeable and made me feel completely comfortable throughout my treatments. The results look natural and exactly what I was hoping for.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Subeeha Rafiq',
    role: 'Microdermabrasion Client',
    content: 'Had microdermabrasion done. My skin felt soft and glowy after my treatment. Sadaf did a great job, she talked through the products she used and made sure I was ok as she was going along. Great experience.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Saira Usman',
    role: 'HydraFacial Client',
    content: 'Highly recommend very friendly lady who knew exactly what she was doing. The hydra facial was superb, will definitely be a regular. A*',
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">
              100+
            </div>
            <p className="text-lg text-foreground font-medium">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">
              100%
            </div>
            <p className="text-lg text-foreground font-medium">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">
              2+
            </div>
            <p className="text-lg text-foreground font-medium">Years Experience</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
        <div id="gallery" className="pt-12 border-t border-border">
          <h3 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            Transformation Gallery
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              { type: 'pair', before: '/treatments/hydrafacial-1-before.png', after: '/treatments/hydrafacial-1-after.jpg', label: 'Hydrafacial' },
              { type: 'pair', before: '/treatments/hydrafacial-2-before.jpg', after: '/treatments/hydrafacial-2-after.png', label: 'Hydrafacial' },
              { type: 'pair', before: '/treatments/hydrafacial-3-before.jpg', after: '/treatments/hydrafacial-3-after.jpg', label: 'Hydrafacial' },
              { type: 'single', image: '/treatments/korean-lash-lift.jpg', label: 'Korean Lash Lift' },
              { type: 'single', image: '/treatments/halal-brows.jpg', label: 'Halal Brows' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                {item.type === 'pair' ? (
                  <>
                    <div className="relative rounded-lg overflow-hidden h-64">
                      <Image
                        src={item.before!}
                        alt={`Before - ${item.label}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded">
                        Before
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden h-64">
                      <Image
                        src={item.after!}
                        alt={`After - ${item.label}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-accent text-black text-xs font-medium px-3 py-1 rounded">
                        After
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative rounded-lg overflow-hidden h-[33rem]">
                    <Image
                      src={item.image!}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
