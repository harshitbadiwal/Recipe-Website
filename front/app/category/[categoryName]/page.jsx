import Link from 'next/link'
import { getCategoryBySlug, getCategoryRecipes } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ params }) {
  const { categoryName } = await params
  const decodedCategory = decodeURIComponent(categoryName)
  const category = await getCategoryBySlug(decodedCategory)

  const displayName = category?.name || decodedCategory
  const canonicalSlug = category?.slug || encodeURIComponent(categoryName)
  const canonicalUrl = `${SITE_URL}/category/${canonicalSlug}`
  const pageTitle = `${displayName} Recipes - Authentic ${displayName} Dishes`
  const pageDesc =
    category?.description ||
    `Explore our authentic collection of ${displayName} recipes. Step-by-step cooking instructions, ingredient lists, and master chef tips.`
  const categoryImage =
    category?.image ||
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&h=630&fit=crop'

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      displayName,
      `${displayName} recipes`,
      `how to cook ${displayName}`,
      'authentic cuisine',
      'homemade dishes',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${displayName} Recipes - Recipe Master`,
      description: pageDesc,
      url: canonicalUrl,
      siteName: 'Recipe Master',
      type: 'website',
      images: [
        {
          url: categoryImage,
          width: 1200,
          height: 630,
          alt: `${displayName} Culinary Collection`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} Recipes - Recipe Master`,
      description: pageDesc,
      images: [categoryImage],
    },
  }
}

export default async function CategoryRecipesPage({ params }) {
  const { categoryName } = await params
  const decodedCategory = decodeURIComponent(categoryName)

  const { category, recipes, subcategories } = await getCategoryRecipes(decodedCategory)
  const displayName = category?.name || decodedCategory
  const description =
    category?.description ||
    `Explore authentic ${displayName} culinary recipes, traditional ingredients, and time-honored cooking techniques.`
  const categorySlug = category?.slug || encodeURIComponent(categoryName)

  // Structured Data: CollectionPage & BreadcrumbList
  const structuredData = {
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
          {
            '@type': 'ListItem',
            position: 3,
            name: displayName,
            item: `${SITE_URL}/category/${categorySlug}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `${displayName} Recipes`,
        description,
        url: `${SITE_URL}/category/${categorySlug}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: recipes.map((recipe, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: recipe.title,
            url: `${SITE_URL}/recipes/${recipe.slug || recipe._id}`,
            image: recipe.image,
          })),
        },
      },
    ],
  }

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="category-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span>{' '}
            <Link href="/categories">Categories</Link> <span className="breadcrumb-sep">/</span>{' '}
            <span>{displayName}</span>
          </p>
          <h1 className="category-title">{displayName} Recipes</h1>
          <p className="category-subtitle">{description}</p>
        </div>
      </div>

      <div className="container">
        {/* Child Subcategories quick navigation (if this category has subcategories) */}
        {subcategories && subcategories.length > 0 && (
          <div
            className="category-subcategories-bar"
            style={{
              marginBottom: '32px',
              padding: '16px 20px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--primary, #e11d48)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ↳ Explore Subcategories:
            </span>
            <Link
              href={`/recipes?category=${encodeURIComponent(categorySlug)}`}
              className="filter-pill active"
              style={{ fontSize: '13px', padding: '5px 14px' }}
            >
              All {displayName}
            </Link>
            {subcategories.map((sub) => (
              <Link
                key={sub._id || sub.slug || sub.name}
                href={`/recipes?category=${encodeURIComponent(categorySlug)}&subCategory=${encodeURIComponent(sub.slug || sub.name)}`}
                className="filter-pill"
                style={{ fontSize: '13px', padding: '5px 14px' }}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="category-empty" style={{ textAlign: 'center', padding: '64px 20px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🥗</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              No recipes found in this category yet
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              We are regularly preparing new chef recipes for {displayName}. Check back soon or explore our full collection!
            </p>
            <Link href="/recipes" className="back-link">
              ← Browse All Recipes
            </Link>
          </div>
        ) : (
          <div className="category-recipes-grid">
            {recipes.map((recipe) => {
              const recipeSlug = recipe.slug || recipe._id || recipe.id
              const subCatName =
                recipe.subCategoryName ||
                recipe.subCategory?.name ||
                (Array.isArray(recipe.subCategoryNames) && recipe.subCategoryNames[0]) ||
                ''
              const cookTime = recipe.totalTime
                ? `${recipe.totalTime} min`
                : recipe.time || '45 min'
              const rating =
                typeof recipe.ratingAverage === 'number'
                  ? recipe.ratingAverage.toFixed(1)
                  : '4.8'

              return (
                <Link
                  key={recipe._id || recipe.id || recipe.slug}
                  href={`/recipes/${recipeSlug}`}
                  className="recipe-card-link"
                >
                  <div className="category-recipe-card">
                    <div className="category-recipe-image-wrapper">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="category-recipe-image"
                        loading="lazy"
                      />
                      {subCatName && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'rgba(15, 23, 42, 0.82)',
                            backdropFilter: 'blur(6px)',
                            color: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          ↳ {subCatName}
                        </span>
                      )}
                    </div>
                    <div className="category-recipe-info">
                      <h3>{recipe.title}</h3>
                      <p className="category-recipe-meta">
                        {recipe.difficulty || 'Easy'} • {cookTime} • ⭐ {rating}
                      </p>
                      <p className="category-recipe-desc">
                        {recipe.description ? `${recipe.description.slice(0, 85)}...` : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
