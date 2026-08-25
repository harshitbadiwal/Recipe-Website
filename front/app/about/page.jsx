export const metadata = {
  title: 'About Us - Our Culinary Mission & Chef Heritage',
  description:
    'Discover the story behind Recipe Master — bringing authentic culinary traditions, chef techniques, and home-cooked excellence together.',
  openGraph: {
    title: 'About Recipe Master - Culinary Heritage',
    description:
      'Discover the story behind Recipe Master — bringing authentic culinary traditions to your home.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'About Recipe Master',
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-title">About Recipe Master</h1>
          <p className="about-subtitle">
            A modern food platform bringing chef-style recipes to every home kitchen.
          </p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Recipe Master is dedicated to celebrating the rich heritage of world gastronomy. Our mission is to demystify complex restaurant recipes and empower every home cook with precise measurements, pro tips, and foolproof instructions.
          </p>
          <p>
            From slow-cooked dum biryanis to quick 15-minute skillet suppers, every recipe in our catalog is rigorously tested for authentic flavors and perfect kitchen execution.
          </p>
        </section>

        <section className="about-section">
          <h2>What You&apos;ll Find Here</h2>
          <ul className="about-list">
            <li>Featured chef-tested recipes with ingredient checklists.</li>
            <li>HD masterclass video tutorials with step-by-step guidance.</li>
            <li>Curated culinary journals on spice chemistry and healthy meal prep.</li>
            <li>Comprehensive category collections for Vegetarian, Non-Veg, Snacks, and Desserts.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
