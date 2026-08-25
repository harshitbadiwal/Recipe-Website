import Link from 'next/link'
import { categories } from '@/data/dummyData'

const CategorySection = () => {
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
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              href={`/category/${encodeURIComponent(category.name)}`}
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
