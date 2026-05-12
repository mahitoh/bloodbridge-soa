import React from 'react'

const linkBase =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-red'

/**
 * Brand-coloured social links (SVG paths match common platform glyphs).
 * Replace `href` values with your real profiles when available.
 */
export default function SocialLinks({ className = '' }) {
  const items = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/',
      className: `${linkBase} text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5`,
      viewBox: '0 0 24 24',
      path: (
        <path
          fill="currentColor"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/',
      className: `${linkBase} text-[#E4405F] hover:border-[#E4405F] hover:bg-[#E4405F]/5`,
      viewBox: '0 0 24 24',
      path: (
        <g>
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5"
            ry="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </g>
      ),
    },
    {
      name: 'X',
      href: 'https://x.com/',
      className: `${linkBase} text-gray-900 hover:border-gray-900 hover:bg-gray-100`,
      viewBox: '0 0 24 24',
      path: (
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      className: `${linkBase} text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/5`,
      viewBox: '0 0 24 24',
      path: (
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.062 2.062 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      ),
    },
  ]

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map(({ name, href, className: cls, viewBox, path }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          aria-label={`BloodBridge on ${name}`}
        >
          <svg className="h-5 w-5 shrink-0" viewBox={viewBox} aria-hidden="true">
            {path}
          </svg>
        </a>
      ))}
    </div>
  )
}
