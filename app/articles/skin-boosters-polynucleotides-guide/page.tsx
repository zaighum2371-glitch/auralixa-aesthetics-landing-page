import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Skin Boosters & Polynucleotides Guide | Auralixa',
  description: 'Discover how Skin Boosters and Polynucleotides can deeply hydrate, smooth fine lines, and restore a youthful glow from within.',
  openGraph: {
    title: 'Skin Boosters & Polynucleotides Guide | Auralixa',
    description: 'Discover how Skin Boosters and Polynucleotides can deeply hydrate, smooth fine lines, and restore a youthful glow from within.',
    url: 'https://auralixa.com/articles/skin-boosters-polynucleotides-guide',
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
          <span className="text-sm text-muted-foreground mb-2 block">May 12, 2024 • 5 min read</span>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">The Ultimate Guide to Skin Boosters & Polynucleotides</h1>
          
          <p className="lead text-xl text-muted-foreground mb-8">
            Move over traditional fillers—modern aesthetics is all about regenerating your skin from the inside out. Skin Boosters and Polynucleotides are leading the charge in deep hydration and cellular repair.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">What Are Skin Boosters?</h2>
          <p className="text-muted-foreground mb-6">
            Skin Boosters are micro-injections of hyaluronic acid, vitamins, and minerals delivered directly into the dermis. Unlike traditional dermal fillers that add volume or contour the face, skin boosters act like an injectable moisturizer. They deeply hydrate, improve elasticity, and give your skin an incredible, long-lasting, luminous glow.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">The Power of Polynucleotides</h2>
          <p className="text-muted-foreground mb-6">
            Polynucleotides take skin rejuvenation a step further. They are biological molecules (derived from salmon DNA) that communicate directly with your skin cells. When injected, particularly as an under-eye booster, they stimulate fibroblasts to produce collagen and elastin. This smooths out fine lines, thickens the skin, and dramatically brightens dark circles—making them the ultimate regenerative treatment.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">Which is Right For You?</h2>
          <p className="text-muted-foreground mb-6">
            If your primary goal is instant hydration and a radiant, dewy complexion, Skin Boosters are your best bet. If you are looking for long-term structural repair, tightening of crepey skin, or targeted improvement in the under-eye area, Polynucleotides are the superior choice. Many clients actually benefit from a combination of both!
          </p>
          
          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-serif text-primary mb-2">Ready to rejuvenate your skin?</h3>
            <p className="text-muted-foreground mb-4">Book a consultation with our expert practitioners today.</p>
            <Link href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded hover:opacity-90 transition-opacity">
              Book a Consultation
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
