import Link from 'next/link'
import { heroSlides } from '@/data/dummyData'

export default async function Hero() {
  const currentSlide = heroSlides[0]

  return (
    <section className="hero">
      <div className="hero-slider">
        <div
          className="hero-slide active"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-pulse"></span>
              <span>✨ Handcrafted Culinary Art</span>
            </div>
            <h1 className="hero-title">{currentSlide.title}</h1>
            <p className="hero-subtitle">{currentSlide.subtitle}</p>
            <div className="hero-actions">
              <Link href="/recipes" className="hero-cta">
                <span>{currentSlide.ctaText}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              <Link href="/videos" className="hero-secondary-cta">
                <span className="hero-play-icon">▶</span>
                <span>Watch Masterclasses</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <Link
              key={slide.id}
              href={`/recipes`}
              className={`hero-dot ${index === 0 ? 'active' : ''}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
