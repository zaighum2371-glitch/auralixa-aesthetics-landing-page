'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeftRight } from 'lucide-react'

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
          Real Results
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Drag the slider to see the transformation instantly.
        </p>

        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl group">
          {/* After Image (Background) */}
          <div className="absolute inset-0">
            <Image
              src="/treatments/hydrafacial-3-after.jpg"
              alt="After Treatment"
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 bg-accent text-zinc-900 text-sm font-bold px-4 py-1 rounded-full shadow-lg z-10 pointer-events-none">
              AFTER
            </div>
          </div>

          {/* Before Image (Foreground, clipped) */}
          <div 
            className="absolute inset-0 z-10"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <Image
              src="/treatments/hydrafacial-3-before.jpg"
              alt="Before Treatment"
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg z-10 pointer-events-none">
              BEFORE
            </div>
          </div>

          {/* Slider line & handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-border group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5 text-zinc-900" />
            </div>
          </div>

          {/* Invisible Range Input for accessibility & mobile dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>
      </div>
    </section>
  )
}
