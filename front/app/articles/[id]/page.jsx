import Link from 'next/link'
import { getBlogBySlug } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipemaster.com'

export async function generateMetadata({ params }) {
  const { id } = await params
  const article = await getBlogBySlug(id)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested culinary article could not be found.',
    }
  }

  const slug = article.slug || article._id || id
  const canonicalUrl = `${SITE_URL}/articles/${slug}`
  const pageTitle = article.seoTitle || `${article.title} - Culinary Guide`
  const pageDescription = article.seoDescription || article.excerpt || article.description
  const image = article.featuredImage || article.image

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
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author || 'Sonia Sharma'],
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: image ? [image] : [],
    },
  }
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params
  const article = await getBlogBySlug(id)

  if (!article) {
    return (
      <main className="recipes-page">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Article not found</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>The culinary article you are looking for does not exist or has been moved.</p>
          <Link href="/articles" className="back-link full-width">
            ← Back to all articles
          </Link>
        </div>
      </main>
    )
  }

  const image =
    article.featuredImage ||
    article.image ||
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=630&fit=crop'
  const dateFormatted = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: [image],
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'Sonia Sharma',
    },
    description: article.excerpt || article.description,
  }

  return (
    <main className="recipe-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="recipe-detail-hero">
        <div className="container">
          <p className="breadcrumb">
            <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span>{' '}
            <Link href="/articles">Articles</Link> <span className="breadcrumb-sep">/</span>{' '}
            <span>{article.title}</span>
          </p>
          <div className="recipe-header-title-row">
            <div>
              {article.category && <span className="detail-category-badge">{article.category}</span>}
              <h1 className="recipe-detail-title">{article.title}</h1>
            </div>
          </div>
          <div className="recipe-detail-meta-pills">
            <span className="meta-pill">✍ <strong>Author:</strong> {article.author || 'Sonia Sharma'}</span>
            <span className="meta-pill">📅 <strong>Published:</strong> {dateFormatted}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="recipe-detail-layout">
          <div className="recipe-detail-main">
            <div className="recipe-detail-image-wrapper">
              <img src={image} alt={article.title} className="recipe-detail-image" />
            </div>

            <div className="recipe-detail-section" style={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '16px', color: '#334155' }}>
              {article.content || article.excerpt}
            </div>

            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      background: '#f1f5f9',
                      fontSize: '13px',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="recipe-detail-sidebar">
            <div className="sidebar-card highlight-card">
              <h3>Culinary Wisdom 💡</h3>
              <p>Great cooking starts with fresh, quality ingredients and patience. Let flavors develop naturally.</p>
            </div>

            <Link href="/articles" className="back-link full-width">
              ← Explore All Articles
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
