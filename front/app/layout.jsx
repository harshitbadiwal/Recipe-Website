import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Recipe Master - Authentic Recipes & Culinary Inspiration',
    template: '%s | Recipe Master',
  },
  description:
    'Your ultimate destination for authentic chef-crafted recipes, step-by-step cooking videos, secret culinary techniques, and food guides.',
  keywords: [
    'recipes',
    'cooking',
    'Indian cuisine',
    'chef recipes',
    'dinner ideas',
    'authentic recipes',
    'quick meals',
    'vegetarian recipes',
    'non-veg dishes',
    'dessert recipes',
  ],
  authors: [{ name: 'Chef Master & Culinary Team', url: SITE_URL }],
  creator: 'Recipe Master Team',
  publisher: 'Recipe Master',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Recipe Master',
    title: 'Recipe Master - Authentic Recipes & Culinary Inspiration',
    description:
      'Discover delicious chef-crafted recipes, step-by-step cooking videos, and culinary tutorials.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Recipe Master - Delicious Culinary Creations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipe Master - Authentic Recipes & Culinary Inspiration',
    description:
      'Discover delicious chef-crafted recipes, step-by-step cooking videos, and culinary tutorials.',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=630&fit=crop'],
    creator: '@recipemaster',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
