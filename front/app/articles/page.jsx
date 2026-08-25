import ArticlesSection from '@/components/ArticlesSection/ArticlesSection'

export const metadata = {
  title: 'Culinary Articles & Food Stories - Cooking Tips & Spice Secrets',
  description:
    'Read expert culinary articles, spice guides, healthy meal prep tips, and traditional cooking secrets from professional chefs.',
  openGraph: {
    title: 'Food Stories & Culinary Articles - Recipe Master',
    description:
      'Read expert culinary articles, spice guides, healthy meal prep tips, and traditional cooking secrets.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Culinary Articles & Guides',
      },
    ],
  },
}

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <div className="articles-hero">
        <div className="container">
          <h1 className="articles-hero-title">Food Stories &amp; Articles</h1>
          <p className="articles-hero-subtitle">
            Insights, techniques, and inspiration from the world of cooking.
          </p>
        </div>
      </div>
      <ArticlesSection showHeader={false} showViewAll={false} />
    </main>
  )
}
