import Link from 'next/link'
import { getCategories } from '@/services/api'

export default async function Footer() {
  const categories = await getCategories()
  const displayCategories = Array.isArray(categories) ? categories.slice(0, 6) : []

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo.png"
                alt="Sonia Sharma"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  background: '#ffffff',
                  padding: '2px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
              <h3 className="footer-title" style={{ margin: 0 }}>Sonia Sharma</h3>
            </div>
            <p className="footer-description">
              Your ultimate destination for authentic recipes, cooking tips, and culinary inspiration by Sonia Sharma.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/recipes">Recipes</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/articles">Articles</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {displayCategories.map((cat) => {
                const slug = cat.slug || cat.name
                return (
                  <li key={cat._id || cat.id || slug}>
                    <Link href={`/category/${slug}`}>{cat.name}</Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Send Feedback</Link></li>
              <li><Link href="/about">Our Culinary Journey</Link></li>
              <li><Link href="/favorites">Saved Recipes</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Sonia Sharma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
