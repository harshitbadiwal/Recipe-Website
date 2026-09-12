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

  // Separate top-level categories and subcategories
  const mainCategories = categoriesList.filter((c) => !c.parentCategory)
  const displayCategories = mainCategories.length > 0 ? mainCategories : categoriesList

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
          itemListElement: displayCategories.map((cat, idx) => ({
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
        <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px' }}>
          {displayCategories.map((category) => {
            const catSlug = category.slug || category.name
            const childSubcategories =
              (Array.isArray(category.subcategories) && category.subcategories.length > 0)
                ? category.subcategories
                : categoriesList.filter((c) => {
                    const pId = c.parentCategory?._id?.toString() || c.parentCategory?.toString()
                    const pSlug = (c.parentCategory?.slug || '').toLowerCase()
                    return pId === category._id?.toString() || pSlug === (category.slug || '').toLowerCase()
                  })

            return (
              <div
                key={category._id || category.id || catSlug}
                className="category-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px 16px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Link href={`/category/${catSlug}`} className="category-card-link">
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
                  </Link>

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

                  {/* Subcategories list */}
                  {childSubcategories.length > 0 && (
                    <div style={{ marginTop: '10px', marginBottom: '14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: 'var(--primary, #e11d48)',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        ↳ Subcategories:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {childSubcategories.slice(0, 4).map((sub) => (
                          <Link
                            key={sub._id || sub.slug || sub.name}
                            href={`/recipes?category=${encodeURIComponent(catSlug)}&subCategory=${encodeURIComponent(sub.slug || sub.name)}`}
                            style={{
                              fontSize: '11px',
                              background: '#f8fafc',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              textDecoration: 'none',
                              fontWeight: '600',
                            }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={`/category/${catSlug}`}
                  className="category-explore-tag"
                  style={{ marginTop: '12px', display: 'inline-block' }}
                >
                  Browse Recipes →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
