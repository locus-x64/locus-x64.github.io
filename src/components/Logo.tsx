import logoImage from '@/assets/images/logo.jpeg'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="locus-x64"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  )
}
