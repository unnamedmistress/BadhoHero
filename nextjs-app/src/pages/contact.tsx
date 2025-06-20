import Link from 'next/link'

export default function ContactPage() {
  return (
    <div id="main-content" className="legal-page">
      <h2>Contact Us</h2>
      <p>Email questions to contact@badhohero.com.</p>
      <p style={{ marginTop: '2rem' }}>
        <Link href="/">Return Home</Link>
      </p>
    </div>
  )
}

export function Head() {
  return (
    <>      <title>Contact Us | BadhoHero</title>
      <meta name="description" content="Get in touch with the BadhoHero team." />
      <link rel="canonical" href="https://badhohero.vercel.app/contact" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} });
