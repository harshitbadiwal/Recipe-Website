import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import AppProviders from '@/components/Providers/AppProviders'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sonia Sharma Recipes - Authentic Culinary Inspiration',
    template: '%s | Sonia Sharma Recipes',
  },
  description:
    'Your ultimate destination for authentic chef-crafted recipes, step-by-step cooking videos, and culinary tutorials by Sonia Sharma.',
  keywords: [
    'Sonia Sharma',
    'Sonia Sharma recipes',
    'recipes',
    'cooking',
    'Indian cuisine',
    'authentic recipes',
    'quick meals',
    'vegetarian recipes',
    'non-veg dishes',
    'dessert recipes',
  ],
  authors: [{ name: 'Sonia Sharma', url: SITE_URL }],
  creator: 'Sonia Sharma',
  publisher: 'Sonia Sharma',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Sonia Sharma Recipes',
    title: 'Sonia Sharma Recipes - Authentic Culinary Inspiration',
    description:
      'Discover delicious chef-crafted recipes, step-by-step cooking videos, and culinary tutorials by Sonia Sharma.',
    images: [
      {
        url: '/logo.png',
        width: 600,
        height: 600,
        alt: 'Sonia Sharma Culinary Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonia Sharma Recipes - Authentic Culinary Inspiration',
    description:
      'Discover delicious chef-crafted recipes, step-by-step cooking videos, and culinary tutorials by Sonia Sharma.',
    images: ['/logo.png'],
    creator: '@soniasharma',
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
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="app">
            <Header />
            {children}
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
