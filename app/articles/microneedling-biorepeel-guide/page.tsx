import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Microneedling & BioRePeel Explained | Auralixa',
  description: 'Learn how combining advanced microneedling with medical-grade peels like BioRePeel can dramatically improve texture, scars, and pigmentation.',
  openGraph: {
    title: 'Microneedling & BioRePeel Explained | Auralixa',
    description: 'Learn how combining advanced microneedling with medical-grade peels like BioRePeel can dramatically improve texture, scars, and pigmentation.',
    url: 'https://auralixa.com/articles/microneedling-biorepeel-guide',
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 md:px-8 bg-primary text-primary-foreground flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold">Auralixa</Link>
        <Link href="/articles" className="text-sm underline hover:no-underline">Back to Articles</Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article className="prose prose-stone lg:prose-xl mx-auto">
          <span className="text-sm text-muted-foreground mb-2 block">June 5, 2024 • 4 min read</span>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">Transform Your Skin: Microneedling & BioRePeel Explained</h1>
          
          <p className="lead text-xl text-muted-foreground mb-8">
            Struggling with acne scars, pigmentation, or uneven texture? Discover how clinical treatments like Microneedling and Medical-Grade Peels are setting the gold standard for skin transformation.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">The Magic of Microneedling</h2>
          <p className="text-muted-foreground mb-6">
            Microneedling (also known as collagen induction therapy) involves using a device with fine needles to create controlled micro-injuries in the skin. This triggers the body's natural healing response, stimulating the production of collagen and elastin. Over a series of sessions, it effectively smooths out texture, tightens open pores, and reduces the appearance of stubborn acne scars.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">BioRePeel: Not Your Average Peel</h2>
          <p className="text-muted-foreground mb-6">
            BioRePeel is a revolutionary medical-grade chemical peel. Unlike traditional peels that can leave your skin red and peeling for days, BioRePeel uses a patented 2-phase technology. It deeply exfoliates and renews the skin, tackling active acne, hyperpigmentation, and signs of aging—often with zero to minimal downtime.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">Better Together</h2>
          <p className="text-muted-foreground mb-6">
            While both treatments are powerful on their own, they can often be combined in a strategic treatment plan. A chemical peel clears the top layer of dead skin and debris, allowing microneedling to penetrate more effectively and deliver regenerative serums (like Anti-Wrinkle Mesotherapy or PRP) deeper into the dermis.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">What to Expect Post-Treatment</h2>
          <p className="text-muted-foreground mb-6">
            Following a microneedling or peel session, your skin will be highly sensitive. You may experience redness akin to a mild sunburn for 24-48 hours. Strict sun protection and hydration are absolutely vital during this healing phase to ensure you achieve that coveted flawless, glass-skin finish.
          </p>
        </article>
      </main>
    </div>
  )
}
