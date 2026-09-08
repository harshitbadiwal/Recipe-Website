import Link from 'next/link'
import { getBlogs } from '@/services/api'

export default async function ArticlesSection({ showHeader = true, showViewAll = true }) {
  const blogs = await getBlogs()

  if (!blogs || blogs.length === 0) {
    return null
  }

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
          {blogs.map((article, idx) => {
            const articleSlug = article.slug || article._id || article.id
            const image =
              article.featuredImage ||
              article.image ||
              'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop'
            const description = article.excerpt || article.description || article.content?.slice(0, 100)
            const date = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : article.date || 'Recent'

            return (
              <Link
                key={article._id || article.id || articleSlug}
                href={`/articles/${articleSlug}`}
                className="article-card-link"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <article className="article-card">
                  <div className="article-image-wrapper">
                    <img src={image} alt={article.title} className="article-image" loading="lazy" />
                    <span className="article-date-badge">📅 {date}</span>
                  </div>
                  <div className="article-content">
                    <span className="article-author-tag">By {article.author || 'Sonia Sharma'}</span>
                    <h3 className="article-title">{article.title}</h3>
                    {description && <p className="article-description">{description}</p>}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
