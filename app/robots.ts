import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/api/', '/not-authorized', '/unauthorized'],
    },
    sitemap: 'https://auralixa.com/sitemap.xml',
  }
}
