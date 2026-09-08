import Link from 'next/link'
import { getCategories } from '@/services/api'

export default async function CategorySection() {
  const activeCategories = await getCategories()

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header center-header">
          <div>
            <span className="section-eyebrow">🥗 Authentic Cuisines</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-desc">Browse thousands of mouth-watering dishes across diverse traditional categories.</p>
          </div>
        </div>

        <div className="categories-grid">
          {activeCategories.map((category, idx) => {
            const catSlug = category.slug || category.name
            return (
              <Link
                key={category._id || category.id || catSlug}
                href={`/category/${catSlug}`}
                className="category-card-link"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="category-card">
                  <div className="category-image-wrapper">
                    <div className="category-glow-ring"></div>
                    <img src={category.image} alt={category.name} className="category-image" loading="lazy" />
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <span className="category-explore-tag">Discover →</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/categories" className="view-all-btn" style={{ display: 'inline-flex' }}>
            <span>View All Categories</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
