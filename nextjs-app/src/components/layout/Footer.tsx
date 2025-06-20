import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="brand">
          <img
            src="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%207%2C%202025%2C%2007_12_36%20PM.png"
            alt="BadhoHero fox mascot - your companion for defeating laziness"
            className="brand-logo"
          />
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
