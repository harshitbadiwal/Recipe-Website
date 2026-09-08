// import VideoSection from '@/components/VideoSection/VideoSection'
import Link from 'next/link'

export const metadata = {
  title: 'Video Recipes & Culinary Masterclasses',
  description:
    'Watch high-definition step-by-step video tutorials for making authentic dishes.',
}

export default function VideosPage() {
  return (
    <main className="videos-page">
      <div className="videos-hero">
        <div className="container">
          <h1 className="videos-hero-title">Cooking Masterclasses &amp; Videos</h1>
          <p className="videos-hero-subtitle">
            Video tutorials and masterclasses are currently being updated. Check back soon!
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link href="/recipes" className="view-all-btn" style={{ display: 'inline-flex' }}>
              Explore Recipes
            </Link>
          </div>
        </div>
      </div>
      {/* Cooking Masterclasses section commented out:
      <VideoSection />
      */}
    </main>
  )
}
