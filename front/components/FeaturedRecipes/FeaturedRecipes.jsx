import Link from 'next/link'
import { getRecipes } from '@/services/api'

export default async function FeaturedRecipes() {
  const { recipes } = await getRecipes({ limit: 8, sort: 'popular' })

  if (!recipes || recipes.length === 0) {
    return null
  }

  const getCategoryClass = (category) => {
    const cat = String(category).toLowerCase()
    if (cat.includes('veg') && !cat.includes('non')) return 'badge-veg'
    if (cat.includes('non-veg') || cat.includes('nonveg')) return 'badge-nonveg'
    if (cat.includes('dessert') || cat.includes('sweet')) return 'badge-dessert'
    return 'badge-snacks'
  }

  return (
    <section className="featured-recipes">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🔥 Chef's Selection</span>
            <h2 className="section-title">Featured Recipes</h2>
            <p className="section-desc">Hand-picked dishes crafted with authentic spices and time-honored techniques.</p>
          </div>
          <Link href="/recipes" className="view-all-btn">
            <span>Explore All Recipes</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>

        <div className="recipes-grid">
          {recipes.slice(0, 8).map((recipe, idx) => {
            const recipeSlug = recipe.slug || recipe._id || recipe.id
            const catName = recipe.categoryName || recipe.category?.name || recipe.category || 'Specialty'
            const cookTime = recipe.totalTime ? `${recipe.totalTime} min` : recipe.time || '45 min'
            const rating = typeof recipe.ratingAverage === 'number' ? recipe.ratingAverage.toFixed(1) : '4.9'

            return (
              <Link key={recipe._id || recipe.id || recipeSlug} href={`/recipes/${recipeSlug}`} className="recipe-card-link">
                <div className="recipe-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="recipe-image-wrapper">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" loading="lazy" />
                    <div className="recipe-overlay"></div>
                    
                    {/* Shimmer sweep effect */}
                    <div className="recipe-shimmer"></div>

                    <span className={`recipe-category-badge ${getCategoryClass(catName)}`}>
                      {catName.toLowerCase().includes('non-veg')
                        ? '🍗 '
                        : catName.toLowerCase().includes('veg')
                        ? '🌱 '
                        : catName.toLowerCase().includes('dessert')
                        ? '🍨 '
                        : '🥟 '}
                      {catName}
                    </span>

                    <div className="recipe-time-pill">
                      <span className="time-icon">⏱</span>
                      <span>{cookTime}</span>
                    </div>
                  </div>

                  <div className="recipe-info">
                    <div className="recipe-meta-row">
                      <div className="recipe-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-num">{rating}</span>
                      </div>
                      <span className="recipe-dot">•</span>
                      <span className="recipe-difficulty">{recipe.difficulty || 'Easy'}</span>
                    </div>

                    <h3 className="recipe-title">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="recipe-short">{recipe.description.slice(0, 75)}...</p>
                    )}

                    <div className="recipe-footer-action">
                      <span className="cook-now-text">Cook Now</span>
                      <svg className="cook-now-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
