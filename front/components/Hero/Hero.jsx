'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'

// Two verified generated images for the hero slider
const PRIMARY_HERO_SLIDES = [
  {
    id: 'hero-slide-1',
    image: '/Gemini_Generated_Image_3xpagu3xpagu3xpa_compressed.webp',
    title: 'Delicious Indian Recipes',
    subtitle: 'Discover authentic flavors & chef-crafted culinary delicacies',
    tag: '✨ Sonia Sharma Kitchen',
    ctaText: 'Explore Recipes',
    ctaLink: '/recipes',
  },
  {
    id: 'hero-slide-2',
    image: '/Gemini_Generated_Image_51wxoi51wxoi51wx_compressed.webp',
    title: 'Master Chef Specials',
    subtitle: 'Learn authentic cooking techniques, traditional secrets & spices',
    tag: '✨ Sonia Sharma Kitchen',
    ctaText: 'Explore Recipes',
    ctaLink: '/recipes',
  },
]

export default function Hero({ initialSlides = [] }) {
  // Combine primary user slides with any additional slides from API that have valid images
  // strictly avoiding any default/dummy image fallback
  const slides = useMemo(() => {
    const validExtraSlides = Array.isArray(initialSlides)
      ? initialSlides.filter(
          (s) =>
            s &&
            typeof s.image === 'string' &&
            s.image.trim() !== '' &&
            !s.image.includes('unsplash.com') &&
            !s.image.includes('placeholder') &&
            !s.image.includes('Gemini_Generated_Image_3xpagu3xpagu3xpa_compressed.webp') &&
            !s.image.includes('Gemini_Generated_Image_51wxoi51wxoi51wx_compressed.webp')
        )
      : []

    return [...PRIMARY_HERO_SLIDES, ...validExtraSlides].filter(
      (s) => s && typeof s.image === 'string' && s.image.trim() !== ''
    )
  }, [initialSlides])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  // Auto-advance slides smoothly without side navigation buttons
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length, isPaused])

  if (slides.length === 0) {
    return null
  }

  return (
    <section
      className="hero"
      aria-label="Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={slide.id || index}
              className={`hero-slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Zoom ONLY this background image layer, never scaling the text labels and buttons */}
              <div
                className="hero-slide-image"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Overlay gradient */}
              <div className="hero-overlay" />

              {/* Content layer: text labels, headings & buttons stay strictly unscaled */}
              <div className="hero-content">
                {/* Standardized label for all slides */}
                <div className="hero-tag">
                  <span className="hero-tag-pulse" />
                  <span>✨ Sonia Sharma Kitchen</span>
                </div>

                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>

                {/* Standardized button for all slides */}
                <div className="hero-actions">
                  <Link href={slide.ctaLink || '/recipes'} className="hero-cta">
                    <span>Explore Recipes</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* Slide indicator dots */}
        {slides.length > 1 && (
          <div className="hero-dots" role="tablist" aria-label="Slide dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
