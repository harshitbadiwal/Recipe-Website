export default async function Newsletter() {
  async function subscribeAction(formData) {
    'use server'
    const email = formData.get('email')
    console.log(`[SERVER SSR] New subscriber registered: ${email}`)
  }

  return (
    <section className="newsletter">
      <div className="newsletter-bg-glow"></div>
      <div className="container">
        <div className="newsletter-card">
          <span className="newsletter-badge">📬 Weekly Delicacies</span>
          <h2 className="newsletter-title">Get Secret Chef Recipes In Your Inbox</h2>
          <p className="newsletter-subtitle">
            Join over 45,000+ passionate food lovers receiving our curated weekend recipe guides and insider tips.
          </p>

          <form className="newsletter-form" action={subscribeAction}>
            <div className="newsletter-input-wrapper">
              <svg className="newsletter-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address..."
                className="newsletter-input"
                required
              />
            </div>
            <button type="submit" className="newsletter-btn">
              <span>Subscribe Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </form>

          <div className="newsletter-perks">
            <span>✓ No spam ever</span>
            <span>✓ Instant unsubscribe</span>
            <span>✓ 100% free forever</span>
          </div>
        </div>
      </div>
    </section>
  )
}
