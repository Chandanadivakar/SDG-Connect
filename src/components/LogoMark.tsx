export function LogoMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SDG CONNECT"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="sdgconnect_g" x1="10" y1="8" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7FF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#sdgconnect_g)" />
      <rect x="10" y="10" width="44" height="44" rx="14" fill="rgba(11,16,32,0.55)" />
      <path
        d="M22 36c0-7 5-12 12-12s12 5 12 12"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M22 36c0 2 1 4 3 5"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M46 36c0 2-1 4-3 5"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontFamily="system-ui, Segoe UI, Arial"
        fontSize="15"
        fontWeight="800"
        fill="white"
        fillOpacity="0.9"
        letterSpacing="0.6"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.8"
        paintOrder="stroke"
      >
        SDG
      </text>
    </svg>
  )
}

