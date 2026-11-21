
import type { NextConfig } from "next"

import createMDX from '@next/mdx'

/** @type { import('next').NextConfig } */
const nextConfig: NextConfig = {

  /* config options here */

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: [ 'js', 'jsx', 'mjs', 'ts', 'tsx', 'md', 'mdx' ],

  // Enable standalone output mode
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/p/:id',
        destination: '/paste/:id',
        permanent: true,
      },
      {
        source: '/b/:id',
        destination: '/paste/:id',
        permanent: true,
      },
      {
        source: '/p',
        destination: '/paste',
        permanent: true,
      },
      {
        source: '/b',
        destination: '/paste',
        permanent: true,
      }
    ]
  },

  // Add security headers as per Next.js PWA docs
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
           { key: 'X-Hello', value: 'Hello World' },
          // Security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net",
              "script-src-elem 'self' 'unsafe-inline' https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net https://www.google.com https://*.gstatic.com",
              "frame-src 'self' https://disqus.com https://*.disqus.com",
              "img-src 'self' data: https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net https://www.google.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "object-src 'none'",
            ].join('; ')
          }
        ],
      },
      {
        source: '/sw.js',
        headers: [
          // Service worker specific headers
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          // ❌ Remove the restrictive SW CSP — it can block NetworkOnly fetches
        ],
      }
    ]
  },

  turbopack: {},

  webpack: (config) => {
    // to disable webpack warning if needed
    //config.infrastructureLogging = { level: "error" };
    return config;
  },

  // Optionally, add any other Next.js config below
  experimental: {}

}

const withMDX = createMDX({

  // Only apply MDX to .mdx files
  extension: /\.(mdx)$/,

  // Add markdown plugins here, as desired

  options: {

    // Plugins are referenced by package name so options stay serializable
    // (required by Turbopack).
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      "remark-gfm",
      "remark-github",
      "remark-gemoji",
    ],
    rehypePlugins: [
      "rehype-unwrap-images",
      "rehype-slug",
      "rehype-highlight",
    ]

  }

})

// only export the MDX-enhanced configuration
// Merge MDX config with Next.js config
export default withMDX(nextConfig)

//export default nextConfig // Original without mdx
