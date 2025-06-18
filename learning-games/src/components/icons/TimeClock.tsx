import '../icons/icons.css'

export default function TimeClock() {
  return (
    <svg className="icon time-clock" viewBox="0 0 64 64" role="img" aria-label="Time clock">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="32" x2="32" y2="16" className="hand" />
    </svg>
  )
}
