import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-content">        <div className="brand">
          <span style={{ fontSize: '2rem', lineHeight: 1, marginRight: '0.5rem' }}>🦊</span>
          <span>&copy; {year} BadhoHero</span>
        </div>
        <nav className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a
          className="coffee-link"
          href="https://coff.ee/badhohero"
          target="_blank"
          rel="noopener noreferrer"
        >
          ☕️ Buy me a coffee
        </a>
      </div>
    </footer>
  )
}
