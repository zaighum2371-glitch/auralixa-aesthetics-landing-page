import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://auralixa.com'),
  title: 'Auralixa Aesthetics | Premium Aesthetic Treatments',
  description: 'Discover luxury aesthetic treatments at Auralixa. Expert procedures in injectables, skincare, body contouring, and wellness.',
  generator: 'v0.app',
  openGraph: {
    title: 'Auralixa Aesthetics | Premium Aesthetic Treatments',
    description: 'Discover luxury aesthetic treatments at Auralixa. Expert procedures in injectables, skincare, body contouring, and wellness.',
    url: 'https://auralixa.com',
    siteName: 'Auralixa Aesthetics',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Auralixa Aesthetics',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auralixa Aesthetics | Premium Aesthetic Treatments',
    description: 'Discover luxury aesthetic treatments at Auralixa. Expert procedures in injectables, skincare, body contouring, and wellness.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    other: {
      'msvalidate.01': '2692BBC3308EF2D59A7004A7EE7CC7E0',
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F5F1EA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Auralixa Aesthetics',
    image: 'https://auralixa.com/og-image.png',
    '@id': 'https://auralixa.com',
    url: 'https://auralixa.com',
    telephone: '07448297154',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Castlemere Community Centre, 60 Tweedale St',
      addressLocality: 'Rochdale',
      addressRegion: 'Greater Manchester',
      postalCode: 'OL11 1HH',
      addressCountry: 'GB'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '10:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday'
        ],
        opens: '10:00',
        closes: '17:00'
      }
    ],
  }

  return (
    <html lang="en" className="bg-background scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
