import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Skincare Routines to Enhance Clinic Treatments | Auralixa',
  description: 'Maximize the longevity of your aesthetic treatments with a solid home skincare regimen.',
  openGraph: {
    title: 'Skincare Routines to Enhance Clinic Treatments | Auralixa',
    description: 'Maximize the longevity of your aesthetic treatments with a solid home skincare regimen.',
    url: 'https://auralixaaesthetics.com/articles/skincare-routines',
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
          <span className="text-sm text-muted-foreground mb-2 block">July 20, 2024 • 6 min read</span>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-8">Skincare Routines to Enhance Your Clinic Treatments</h1>
          
          <p className="lead text-xl text-muted-foreground mb-8">
            Aesthetic treatments in the clinic are only half the battle. Whether you've just had a HydraFacial, BioRePeel, or Microneedling session, a targeted at-home skincare routine is essential to maximize your results.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">The Holy Trinity: Cleanse, Protect, Hydrate</h2>
          <p className="text-muted-foreground mb-6">
            Regardless of what treatments you receive, your skin needs these three foundational pillars. A gentle cleanser removes environmental pollutants, a medical-grade moisturizer repairs the skin barrier, and a broad-spectrum SPF (factor 30 or higher) is non-negotiable for protecting your investment against UV degradation.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">Post-Treatment Care</h2>
          <p className="text-muted-foreground mb-6">
            Immediately following regenerative treatments like Microneedling, PRP, or Algea Peels, your skin barrier is highly permeable and compromised. 
            <br/><br/>
            <strong>Do:</strong> Use gentle, fragrance-free moisturizers enriched with ceramides and hyaluronic acid to soothe the skin.<br/>
            <strong>Don't:</strong> Apply active ingredients like retinoids, AHAs, or BHAs for at least 3-5 days, as this can cause severe irritation and disrupt the healing process.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">Incorporating Actives</h2>
          <p className="text-muted-foreground mb-6">
            Once your skin has healed, introducing active ingredients can powerfully complement your clinic treatments:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
            <li><strong>Vitamin C (Morning):</strong> A potent antioxidant that brightens the skin and boosts collagen production, enhancing the glow from your HydraFacial or BB Glow treatments.</li>
            <li><strong>Hyaluronic Acid:</strong> Plumps and hydrates from the outside in, perfectly complementing injectable Skin Boosters and Anti-Wrinkle Mesotherapy.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary mt-12 mb-4">Consistency is Key</h2>
          <p className="text-muted-foreground mb-6">
            Great skin doesn't happen overnight. By treating your skin gently but consistently with medical-grade products, you'll find your clinic results look better and last significantly longer. Always consult your aesthetician before starting new powerful actives to ensure they align with your treatment plan.
          </p>
        </article>
      </main>
    </div>
  )
}
