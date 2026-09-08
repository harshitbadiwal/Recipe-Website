import Link from 'next/link'

export const metadata = {
  title: 'About Sonia Sharma - Engineer, Mother, Pet Parent & Passionate Home Cook',
  description:
    'Hello! I am Sonia Sharma — an Engineer by profession, a mother, a wife, a pet parent, and, above all, a passionate home cook. Discover authentic recipes, cooking memories, and satvik creations.',
  openGraph: {
    title: 'About Sonia Sharma - Culinary Journey & Food Stories',
    description:
      'Meet Sonia Sharma — Engineer, mother, wife, pet parent, and passionate home cook sharing authentic family recipes, satvik delicacies, and culinary memories.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sonia Sharma Kitchen',
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero Banner */}
      <div className="about-hero">
        <div className="container">
          <div className="about-hero-tag">
            <span className="hero-tag-pulse"></span>
            <span>👩‍🍳 The Heart Behind The Kitchen</span>
          </div>
          <h1 className="about-hero-title">Meet Sonia Sharma</h1>
          <p className="about-hero-subtitle">
            Engineer by profession, mother, wife, pet parent, and, above all, a passionate home cook.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="about-grid-layout">
          {/* Main Story Narrative */}
          <div className="about-main-content">
            {/* Intro Lead Card */}
            <div className="about-story-card intro-card">
              <span className="quote-mark">“</span>
              <p className="about-intro-highlight">
                Hello! I am <strong>Sonia Sharma</strong> — an Engineer by profession, a mother, a wife, a pet parent, and, above all, a passionate home cook.
              </p>
            </div>

            {/* Chapter 1: Childhood Curiosities */}
            <div className="about-story-card">
              <div className="story-card-header">
                <span className="story-card-icon">📰</span>
                <h2>Childhood Curiosity &amp; Treasured Clippings</h2>
              </div>
              <p>
                I have always had a deep interest and curiosity about food since I was a child. I would eagerly wait for <em>Parivar</em> from <strong>Rajasthan Patrika</strong> to arrive so I could try out recipes for myself in my little kitchen.
              </p>
              <p>
                I carefully and lovingly collected cuttings of recipes from the <strong>Dainik Bhaskar</strong> and <strong>Dainik Navjyoti</strong>. These would become part of my treasured collection of recipes, some of which I still have with me today! I was also fortunate to participate in cooking contests and even won prizes a few times.
              </p>
            </div>

            {/* Chapter 2: The Jain Mohalla & Evolving Palate */}
            <div className="about-story-card">
              <div className="story-card-header">
                <span className="story-card-icon">🪴</span>
                <h2>A Taste That Evolved with Life</h2>
              </div>
              <p>
                Over the years, my taste has evolved. Growing up in a <strong>Jain Mohalla</strong>, I was exposed to a variety of food and learned many little tricks and recipes from my neighbours. Those conversations, observations and kitchen tips became an important part of my learning.
              </p>
              <p>
                After marriage, my cooking naturally began to change too. I adjusted my style of cooking to meet my husband&apos;s taste. (This is when I began to explore sweets and desserts more seriously! 😊)
              </p>
              <p>
                When my son was born, I discovered vegan dishes and started experimenting with them. My cooking became more focused on what my child would enjoy and what would work for our family. Later, when I became a pet parent, a whole new world opened up! I made pupcakes, cookies, homemade treats, and other goodies for my furry foodies.
              </p>
            </div>

            {/* Chapter 3: Satvik & Full Flavors */}
            <div className="about-story-card">
              <div className="story-card-header">
                <span className="story-card-icon">🍲</span>
                <h2>Satvik to Everyday Feasts</h2>
              </div>
              <p>
                You will find both <strong>satvik recipes</strong> as well as recipes with onion and garlic here on my website; evidence of my awareness and ability to adapt to a variety of cuisines and styles of cooking.
              </p>
              <p>
                This is a space for me to share carefully curated recipes and food memories from my life with my dear readers. I have always welcomed critique from my loved ones about my cooking. Their honest feedback — not just saying that something was good, but telling me what could be improved — has taught me that we learn and grow through honest feedback. This has provided me with clarity of thought and helped me hone my method.
              </p>
            </div>

            {/* Chapter 4: An Open Invitation */}
            <div className="about-story-card connect-card">
              <div className="story-card-header">
                <span className="story-card-icon">💬</span>
                <h2>An Open Kitchen Invitation</h2>
              </div>
              <p className="invite-lead">
                So if you try one of my recipes, please let me know how it turned out!
              </p>
              <div className="feedback-questions-list">
                <div className="question-bubble">❤️ Did you love it?</div>
                <div className="question-bubble">🌿 Did you change something?</div>
                <div className="question-bubble">💡 Did you discover a better way?</div>
                <div className="question-bubble">🤝 Did something not work?</div>
              </div>
              <p className="tell-me-callout">
                <strong>Tell me!</strong>
              </p>
              <p>
                If you have any questions, suggestions or feedback, feel free to write to me directly at:
              </p>
              <div className="email-cta-box">
                <a href="mailto:soniashashank@gmail.com" className="email-link-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span>soniashashank@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Profile Sidebar */}
          <aside className="about-sidebar">
            <div className="about-profile-card">
              <div className="profile-avatar-container">
                <img
                  src="/logo.png"
                  alt="Sonia Sharma"
                  className="profile-avatar-img"
                />
              </div>
              <h3 className="profile-name">Sonia Sharma</h3>
              <p className="profile-title">Passionate Home Cook &amp; Engineer</p>

              <div className="profile-badges-list">
                <div className="profile-badge-item">
                  <span className="badge-icon">📐</span>
                  <div>
                    <strong>Engineer by Profession</strong>
                    <span>Analytical mind, precise kitchen ratios</span>
                  </div>
                </div>
                <div className="profile-badge-item">
                  <span className="badge-icon">👩‍👦</span>
                  <div>
                    <strong>Mother &amp; Wife</strong>
                    <span>Crafting wholesome family favorites</span>
                  </div>
                </div>
                <div className="profile-badge-item">
                  <span className="badge-icon">🐶</span>
                  <div>
                    <strong>Pet Parent</strong>
                    <span>Baking pupcakes &amp; pet-friendly treats</span>
                  </div>
                </div>
                <div className="profile-badge-item">
                  <span className="badge-icon">🪷</span>
                  <div>
                    <strong>Satvik &amp; Regional Specialist</strong>
                    <span>Traditional Jain Mohalla heritage</span>
                  </div>
                </div>
                <div className="profile-badge-item">
                  <span className="badge-icon">🏆</span>
                  <div>
                    <strong>Cooking Contest Winner</strong>
                    <span>Prized heirloom recipes</span>
                  </div>
                </div>
              </div>

              <div className="profile-cta-buttons">
                <Link href="/recipes" className="profile-action-btn primary">
                  Explore Recipes →
                </Link>
                <a
                  href="mailto:soniashashank@gmail.com"
                  className="profile-action-btn secondary"
                >
                  Write to Sonia
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
