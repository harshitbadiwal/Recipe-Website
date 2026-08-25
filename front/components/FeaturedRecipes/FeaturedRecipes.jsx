import Link from 'next/link'
import { featuredRecipes } from '@/data/dummyData'

export default async function FeaturedRecipes() {
  const getCategoryClass = (category) => {
    if (category === 'Veg') return 'badge-veg'
    if (category === 'Non-Veg') return 'badge-nonveg'
    if (category === 'Dessert') return 'badge-dessert'
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
          {featuredRecipes.slice(0, 8).map((recipe, idx) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="recipe-card-link">
              <div className="recipe-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="recipe-image-wrapper">
                  <img src={recipe.image} alt={recipe.title} className="recipe-image" loading="lazy" />
                  <div className="recipe-overlay"></div>
                  
                  {/* Shimmer sweep effect */}
                  <div className="recipe-shimmer"></div>

                  <span className={`recipe-category-badge ${getCategoryClass(recipe.category)}`}>
                    {recipe.category === 'Veg' ? '🌱 ' : recipe.category === 'Non-Veg' ? '🍗 ' : recipe.category === 'Dessert' ? '🍨 ' : '🥟 '}
                    {recipe.category}
                  </span>

                  <div className="recipe-time-pill">
                    <span className="time-icon">⏱</span>
                    <span>{recipe.time}</span>
                  </div>
                </div>

                <div className="recipe-info">
                  <div className="recipe-meta-row">
                    <div className="recipe-rating">
                      <span className="rating-star">★</span>
                      <span className="rating-num">4.9</span>
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
          ))}
        </div>
      </div>
    </section>
  )
}
