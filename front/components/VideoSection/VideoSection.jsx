import { getHomepageData } from '@/services/api'

export default async function VideoSection() {
  const homeData = await getHomepageData()
  const videos = homeData?.videos || []

  if (videos.length === 0) {
    return null
  }

  return (
    <section className="video-section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🎥 Visual Tutorials</span>
            <h2 className="section-title">Cooking Masterclasses</h2>
            <p className="section-desc">Watch step-by-step masterclasses with authentic culinary techniques.</p>
          </div>
        </div>

        <div className="videos-scroll">
          <div className="videos-container">
            {videos.map((video, idx) => (
              <div key={video.id || idx} className="video-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="video-thumbnail-wrapper">
                  <img src={video.thumbnail} alt={video.title} className="video-thumbnail" loading="lazy" />
                  <div className="video-gradient-overlay"></div>

                  <div className="play-overlay">
                    <div className="play-ripple-ring"></div>
                    <div className="play-button">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>

                  {video.duration && <span className="video-duration-pill">⏱ {video.duration}</span>}
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <span className="video-author">Sonia Sharma Masterclass</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
