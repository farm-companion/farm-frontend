import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

// Content Security Policy that supports:
// - MapLibre (tiles, workers via blob:)
// - AdSense (scripts + iframes after consent)
// - Our assets and images
const CSP = [
  "default-src 'self';",
  "base-uri 'self';",
  "object-src 'none';",
  "font-src 'self' data: https:;",
  "img-src 'self' data: blob: https:;",
  // AdSense script (+ allow inline/eval for Next/MapLibre in dev)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://tpc.googlesyndication.com;",
  // External styles (map styles) + inline styles (Tailwind preflight/runtime)
  "style-src 'self' 'unsafe-inline' https:;",
  // Ad iframes
  "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com;",
  // Tile/vector servers + Ad beacons
  "connect-src 'self' https://tiles.openfreemap.org https://demotiles.maplibre.org https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://*.gstatic.com;",
  // MapLibre workers
  "worker-src 'self' blob:;",
  "child-src blob:;",
  // Helpful on HTTPS in prod
  "upgrade-insecure-requests;",
].join(" ")

const headersCommon = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
]

const nextConfig: NextConfig = {
  // Configure image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure API routes for larger file uploads
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Increase body size limit for API routes
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // Add strong headers for every route
  async headers() {
    const base = [
      {
        source: "/:path*",
        headers: [
          ...headersCommon,
          // Run CSP as Report-Only in dev to avoid breaking while you iterate
          isProd
            ? { key: "Content-Security-Policy", value: CSP }
            : { key: "Content-Security-Policy-Report-Only", value: CSP },
          // HSTS only in prod on HTTPS
          ...(isProd
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
            : []),
        ],
      },
    ]
    return base
  },
}

export default nextConfig
