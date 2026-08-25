import Link from 'next/link'
import { articles } from '@/data/dummyData'

const ArticlesSection = ({ showHeader = true, showViewAll = true }) => {
  return (
    <section className="articles-section">
      <div className="container">
        {showHeader && (
          <div className="section-header">
            <div>
              <span className="section-eyebrow">📖 Culinary Journal</span>
              <h2 className="section-title">Cooking Tips &amp; Guides</h2>
              <p className="section-desc">Master culinary techniques, secret spice pairings, and professional kitchen advice.</p>
            </div>
            {showViewAll && (
              <Link href="/articles" className="view-all-btn">
                <span>Read All Articles</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            )}
          </div>
        )}

        <div className="articles-grid">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="article-card-link"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <article className="article-card">
                <div className="article-image-wrapper">
                  <img src={article.image} alt={article.title} className="article-image" loading="lazy" />
                  <span className="article-date-badge">📅 {article.date}</span>
                </div>
                <div className="article-content">
                  <span className="article-author-tag">By {article.author}</span>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">{article.description}</p>
                  <div className="article-read-more">
                    <span>Read Full Story</span>
                    <svg className="article-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArticlesSection
