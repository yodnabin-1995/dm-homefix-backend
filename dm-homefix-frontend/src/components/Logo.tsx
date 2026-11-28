import { Link } from 'react-router-dom'

interface Props { className?: string; size?: 'sm' | 'md' | 'lg' }

// Logo aspect ratio: 2172 × 724 = 3:1
export default function Logo({ className = '', size = 'md' }: Props) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  const w = h * 3

  return (
    <Link to="/" className={`flex items-center select-none flex-shrink-0 ${className}`}>
      <img
        src="/images/logo.png"
        alt="DM HomeFix"
        width={w}
        height={h}
        style={{ width: w, height: h, objectFit: 'contain', display: 'block' }}
      />
    </Link>
  )
}
