export const metadata = {
  title: 'Contact Us - Culinary Queries & Chef Partnerships',
  description:
    'Have a recipe question, culinary suggestion, or chef collaboration idea? Get in touch with the Recipe Master editorial and culinary team.',
  openGraph: {
    title: 'Contact Recipe Master',
    description:
      'Have a recipe question, suggestion, or collaboration idea? Get in touch with our team.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Contact Recipe Master',
      },
    ],
  },
}

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have a query, recipe suggestion, or collaboration idea? Send us a message.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          <section className="contact-form-card">
            <h2>Send a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="What is this about?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Write your message here"
                ></textarea>
              </div>
              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          </section>

          <aside className="contact-info-card">
            <h2>Contact Details</h2>
            <p>
              We love connecting with food enthusiasts, home chefs, and culinary creators worldwide.
            </p>
            <ul className="contact-info-list">
              <li>
                <span>Email:</span> support@recipemaster.com
              </li>
              <li>
                <span>Phone:</span> +1 234 567 890
              </li>
              <li>
                <span>Address:</span> 123 Gourmet Way, Culinary District
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  )
}
