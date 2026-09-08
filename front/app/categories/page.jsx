import Link from 'next/link'
import { getCategories } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export const metadata = {
  title: 'All Culinary Categories - Explore Diverse Flavors',
  description:
    'Browse our complete directory of recipe categories: Vegetarian, Non-Vegetarian, Desserts, Snacks, Breads, and Beverages crafted by culinary masters.',
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
  openGraph: {
    title: 'All Culinary Categories - Recipe Master',
    description:
      'Browse our complete directory of recipe categories: Vegetarian, Non-Vegetarian, Desserts, Snacks, Breads, and Beverages.',
    url: `${SITE_URL}/categories`,
    siteName: 'Recipe Master',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Explore Recipe Categories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Culinary Categories - Recipe Master',
    description:
      'Browse our complete directory of recipe categories crafted by master chefs.',
    images: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=630&fit=crop'],
  },
}

export default async function CategoriesIndexPage() {
  const categoriesList = await getCategories()

  // Schema.org CollectionPage & BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Categories',
            item: `${SITE_URL}/categories`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Recipe Categories Directory',
        description: 'Explore recipes categorized by culinary styles and dietary preferences.',
        url: `${SITE_URL}/categories`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: categoriesList.map((cat, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: cat.name,
            url: `${SITE_URL}/category/${cat.slug || cat.name}`,
            image: cat.image,
          })),
        },
      },
    ],
  }

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="category-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span> <span>Categories</span>
          </p>
          <h1 className="category-title">Recipe Categories</h1>
          <p className="category-subtitle">
            Explore authentic flavors organized by culinary styles, dietary preferences, and traditional cooking techniques.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
          {categoriesList.map((category) => {
            const catSlug = category.slug || category.name
            return (
              <Link
                key={category._id || category.id || catSlug}
                href={`/category/${catSlug}`}
                className="category-card-link"
              >
                <div
                  className="category-card"
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="category-image-wrapper">
                    <div className="category-glow-ring"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="category-name" style={{ fontSize: '18px' }}>
                    {category.name}
                  </h2>
                  {category.description && (
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginTop: '6px',
                        marginBottom: '12px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {category.description}
                    </p>
                  )}
                  <span className="category-explore-tag">Browse Recipes →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
