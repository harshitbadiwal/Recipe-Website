import Link from 'next/link'

export default async function Header() {
  return (
    <header className="header header-scrolled">
      <div className="header-container">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">
              Recipe<span className="logo-accent">Master</span>
            </span>
          </Link>

          <nav className="nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/recipes" className="nav-link">
              Recipes
            </Link>
            <Link href="/videos" className="nav-link">
              Videos
            </Link>
            <Link href="/articles" className="nav-link">
              Articles
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          <div className="header-actions">
            <form action="/recipes" method="GET" className="header-search-form">
              <input
                type="text"
                name="q"
                placeholder="Search recipes..."
                className="header-search-input"
              />
              <button type="submit" className="search-btn" aria-label="Search recipes">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
