import Link from 'next/link'
import { getRecipes, getCategories } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const query = params?.q?.trim() || ''
  const category = params?.category?.trim() || ''
  const difficulty = params?.difficulty?.trim() || ''
  const page = parseInt(params?.page, 10) || 1

  let pageTitle = 'All Featured Recipes - Discover Authentic Flavors'
  let pageDescription =
    'Browse our comprehensive catalog of vegetarian, non-vegetarian, snacks, breads, and dessert recipes with prep times, step-by-step instructions, and difficulty levels.'

  if (query && category) {
    pageTitle = `"${query}" in ${category} Recipes`
    pageDescription = `Discover authentic ${category} recipes matching "${query}". Step-by-step masterclasses and chef cooking instructions.`
  } else if (query) {
    pageTitle = `Search Results for "${query}"`
    pageDescription = `Explore recipes matching "${query}". Authentic spices, precise cooking steps, and chef tips.`
  } else if (category) {
    pageTitle = `Authentic ${category} Recipes - Traditional & Modern Creations`
    pageDescription = `Explore the best ${category} recipes with authentic ingredients, prep times, and step-by-step chef guides.`
  } else if (difficulty) {
    pageTitle = `${difficulty} Difficulty Recipes`
    pageDescription = `Find ${difficulty.toLowerCase()} to cook recipes with detailed guidance and delicious results.`
  }

  if (page > 1) {
    pageTitle += ` - Page ${page}`
  }

  const queryObj = {}
  if (query) queryObj.q = query
  if (category) queryObj.category = category
  if (difficulty) queryObj.difficulty = difficulty
  if (page > 1) queryObj.page = String(page)
  const queryString = new URLSearchParams(queryObj).toString()
  const canonicalUrl = `${SITE_URL}/recipes${queryString ? `?${queryString}` : ''}`

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Recipe Master',
      type: 'website',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=630&fit=crop',
          width: 1200,
          height: 630,
          alt: 'Recipe Master Master Recipe Catalog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=630&fit=crop'],
    },
  }
}

export default async function RecipesPage({ searchParams }) {
  const resolvedParams = await searchParams
  const query = resolvedParams?.q?.trim() || ''
  const selectedCategory = resolvedParams?.category?.trim() || ''
  const selectedDifficulty = resolvedParams?.difficulty?.trim() || ''
  const selectedSort = resolvedParams?.sort?.trim() || 'latest'
  const currentPage = Math.max(1, parseInt(resolvedParams?.page, 10) || 1)
  const limit = 12

  // Fetch live recipes and active categories in parallel
  const [{ recipes, meta }, activeCategories] = await Promise.all([
    getRecipes({
      q: query,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      sort: selectedSort,
      page: currentPage,
      limit,
    }),
    getCategories(),
  ])

  // Helper to construct filter URLs preserving active query filters
  const buildFilterUrl = (overrides = {}) => {
    const params = {
      ...(query && { q: query }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedDifficulty && { difficulty: selectedDifficulty }),
      ...(selectedSort && selectedSort !== 'latest' && { sort: selectedSort }),
      page: '1',
      ...overrides,
    }

    // Remove keys that are cleared
    for (const key of Object.keys(params)) {
      if (params[key] === null || params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    }

    // Don't keep page=1 in URL if unnecessary
    if (params.page === '1' && !overrides.page) {
      delete params.page
    }

    const qs = new URLSearchParams(params).toString()
    return `/recipes${qs ? `?${qs}` : ''}`
  }

  // Schema.org ItemList JSON-LD for rich snippet carousel in Google Search
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: selectedCategory ? `${selectedCategory} Recipes` : 'Curated Recipes Catalog',
    description: 'Explore curated chef recipes with authentic ingredients and instructions.',
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: (currentPage - 1) * limit + index + 1,
      name: recipe.title,
      url: `${SITE_URL}/recipes/${recipe.slug || recipe._id}`,
      image: recipe.image,
    })),
  }

  return (
    <main className="recipes-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="recipes-hero">
        <div className="container">
          <p className="breadcrumb" style={{ marginBottom: '12px' }}>
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span> <span>Recipes</span>
            {selectedCategory && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span>{selectedCategory}</span>
              </>
            )}
          </p>
          <h1 className="recipes-hero-title">
            {query
              ? `Search Results for "${query}"`
              : selectedCategory
              ? `${selectedCategory} Recipes`
              : 'All Master Recipes'}
          </h1>
          <p className="recipes-hero-subtitle">
            {query
              ? `Found ${meta.total} recipe${meta.total === 1 ? '' : 's'} matching your search.`
              : selectedCategory
              ? `Explore authentic ${selectedCategory} culinary dishes, handcrafted spices, and step-by-step techniques.`
              : 'Explore our curated catalog of authentic recipes, from slow-simmered curries to crispy street snacks.'}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Interactive Filter & Search Bar */}
        <section className="recipes-toolbar" aria-label="Recipe Filters and Search">
          <div className="recipes-search-row">
            <form action="/recipes" method="GET" className="recipes-search-box">
              {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
              {selectedDifficulty && <input type="hidden" name="difficulty" value={selectedDifficulty} />}
              {selectedSort && selectedSort !== 'latest' && (
                <input type="hidden" name="sort" value={selectedSort} />
              )}
              <svg
                className="recipes-search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by recipe, ingredient, or spice..."
                className="recipes-search-input"
              />
            </form>

            <form action="/recipes" method="GET" className="recipes-sort-box">
              {query && <input type="hidden" name="q" value={query} />}
              {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
              {selectedDifficulty && <input type="hidden" name="difficulty" value={selectedDifficulty} />}
              <label htmlFor="recipe-sort-select">Sort By:</label>
              <select
                id="recipe-sort-select"
                name="sort"
                defaultValue={selectedSort}
                className="recipes-sort-select"
                onChange="this.form.submit()"
              >
                <option value="latest">Latest Additions</option>
                <option value="popular">Most Popular</option>
                <option value="rating_desc">Highest Rated ⭐</option>
                <option value="name_asc">Title (A - Z)</option>
              </select>
            </form>
          </div>

          <div className="recipes-filter-groups">
            {/* Category Filter Pills */}
            <div className="filter-pills-row">
              <span className="filter-group-title">Category:</span>
              <Link
                href={buildFilterUrl({ category: null })}
                className={`filter-pill ${!selectedCategory ? 'active' : ''}`}
              >
                All
              </Link>
              {activeCategories.map((cat) => {
                const isActive =
                  selectedCategory.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                return (
                  <Link
                    key={cat._id || cat.id || cat.slug}
                    href={buildFilterUrl({ category: isActive ? null : cat.slug || cat.name })}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>

            {/* Difficulty Filter Pills */}
            <div className="filter-pills-row">
              <span className="filter-group-title">Difficulty:</span>
              <Link
                href={buildFilterUrl({ difficulty: null })}
                className={`filter-pill ${!selectedDifficulty ? 'active' : ''}`}
              >
                All
              </Link>
              {['Easy', 'Medium', 'Hard'].map((diff) => {
                const isActive = selectedDifficulty.toLowerCase() === diff.toLowerCase()
                return (
                  <Link
                    key={diff}
                    href={buildFilterUrl({ difficulty: isActive ? null : diff })}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                  >
                    {diff}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="category-empty" style={{ textAlign: 'center', padding: '64px 20px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🍲</span>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              No recipes found
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {query
                ? `No recipes match "${query}". Try adjusting your keywords or filters.`
                : 'No published recipes currently match this filter criteria.'}
            </p>
            <Link href="/recipes" className="back-link full-width">
              ← Clear Filters & View All
            </Link>
          </div>
        ) : (
          <>
            <div className="recipes-grid-page">
              {recipes.map((recipe) => {
                const recipeSlug = recipe.slug || recipe._id || recipe.id
                const categoryLabel =
                  recipe.categoryName || recipe.category?.name || recipe.category || 'Specialty'
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
                    <div className="recipe-card-page">
                      <div className="recipe-image-wrapper-page">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="recipe-image-page"
                          loading="lazy"
                        />
                        <span className="recipe-category-page">{categoryLabel}</span>
                        <span className="recipe-time-page">⏱ {cookTime}</span>
                      </div>
                      <div className="recipe-info-page">
                        <h3 className="recipe-title-page">{recipe.title}</h3>
                        <p className="recipe-meta-page">
                          {recipe.difficulty || 'Easy'} • ⭐ {rating}
                        </p>
                        <p className="recipe-description-page">
                          {recipe.description ? `${recipe.description.slice(0, 95)}...` : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Server Pagination */}
            {meta.totalPages > 1 && (
              <div className="pagination-wrapper" aria-label="Pagination Navigation">
                <Link
                  href={buildFilterUrl({ page: String(currentPage - 1) })}
                  className={`pagination-btn ${currentPage <= 1 ? 'disabled' : ''}`}
                  aria-disabled={currentPage <= 1}
                >
                  ← Previous
                </Link>
                <span className="pagination-info">
                  Page {currentPage} of {meta.totalPages}
                </span>
                <Link
                  href={buildFilterUrl({ page: String(currentPage + 1) })}
                  className={`pagination-btn ${currentPage >= meta.totalPages ? 'disabled' : ''}`}
                  aria-disabled={currentPage >= meta.totalPages}
                >
                  Next →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
