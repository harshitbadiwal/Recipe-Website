import VideoSection from '@/components/VideoSection/VideoSection'

export const metadata = {
  title: 'Video Recipes & Culinary Masterclasses - Step-by-Step Cooking Tutorials',
  description:
    'Watch high-definition step-by-step video tutorials for making perfect Biryani, Butter Chicken, Paneer Tikka, and desserts with master chefs.',
  openGraph: {
    title: 'Video Cooking Masterclasses - Recipe Master',
    description:
      'Watch high-definition step-by-step video tutorials for making authentic dishes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Cooking Video Masterclasses',
      },
    ],
  },
}

export default function VideosPage() {
  return (
    <main className="videos-page">
      <div className="videos-hero">
        <div className="container">
          <h1 className="videos-hero-title">Video Recipes &amp; Masterclasses</h1>
          <p className="videos-hero-subtitle">
            Watch step-by-step cooking tutorials from our master chefs in crisp high definition.
          </p>
        </div>
      </div>
      <VideoSection />
    </main>
  )
}
