import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Articles & Aesthetics Insights | Auralixa',
  description: 'Read the latest insights, tips, and news about aesthetic treatments, dermal fillers, and skincare from the experts at Auralixa Aesthetics.',
  openGraph: {
    title: 'Articles & Aesthetics Insights | Auralixa',
    description: 'Read the latest insights, tips, and news about aesthetic treatments, dermal fillers, and skincare from the experts at Auralixa Aesthetics.',
    url: 'https://auralixa.com/articles',
  }
}

const articles = [
  {
    title: "The Ultimate Guide to Skin Boosters & Polynucleotides",
    slug: "skin-boosters-polynucleotides-guide",
    description: "Discover how Skin Boosters and Polynucleotides can deeply hydrate, smooth fine lines, and restore a youthful glow from within.",
    date: "2024-05-12",
    author: "Auralixa Aesthetics"
  },
  {
    title: "Transform Your Skin: Microneedling & BioRePeel Explained",
    slug: "microneedling-biorepeel-guide",
    description: "Learn how combining advanced microneedling with medical-grade peels like BioRePeel can dramatically improve texture, scars, and pigmentation.",
    date: "2024-06-05",
    author: "Auralixa Aesthetics"
  },
  {
    title: "Skincare Routines to Enhance Your Clinic Treatments",
    slug: "skincare-routines",
    description: "Maximize the longevity of your aesthetic treatments with a solid home skincare regimen. Learn which ingredients to use and which to avoid.",
    date: "2024-07-20",
    author: "Auralixa Aesthetics"
  }
]

export default function ArticlesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        author: {
          '@type': 'Organization',
          name: article.author
        },
        datePublished: article.date,
      }
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Basic Nav/Header Space */}
      <header className="py-6 px-4 md:px-8 bg-primary text-primary-foreground flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold">Auralixa</Link>
        <Link href="/" className="text-sm underline hover:no-underline">Back to Home</Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Aesthetics Insights & Articles</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Stay up to date with the latest trends in aesthetics, detailed treatment guides, and expert skincare advice.
        </p>

        <div className="space-y-12">
          {articles.map((article, i) => (
            <article key={i} className="border-b border-primary/20 pb-12 last:border-0">
              <span className="text-sm text-muted-foreground mb-2 block">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <h2 className="text-2xl font-semibold text-primary mb-4">{article.title}</h2>
              <p className="text-base text-muted-foreground mb-4">
                {article.description}
              </p>
              <Link href={`/articles/${article.slug}`} className="text-primary font-medium hover:underline inline-block">
                Read Full Article →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
