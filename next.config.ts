
import type { NextConfig } from "next"
import type { PluggableList } from "unified"

import createMDX from '@next/mdx'

// Import remark plugins you want to use
import remarkPlugins from "./remark-plugins.mjs"

// Import remark mdx only plugins you want to use
import remarkMdxPlugins from "./remarkmdx-plugins.mjs"

// Import rehype plugins you want to use
import rehypePlugins from "./rehype-plugins.mjs"

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
        source: '/favicon.ico',
        destination: '/static/favicon.ico',
        permanent: true,
      },
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
              "connect-src 'self' https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net",
              "frame-src 'self' https://disqus.com https://*.disqus.com",
              "img-src 'self' data: https://disqus.com https://*.disqus.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
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

  // Optionally, add any other Next.js config below
  experimental: {}

}

const withMDX = createMDX({

  // Only apply MDX to .mdx files
  extension: /\.(mdx)$/,

  // Add markdown plugins here, as desired

  options: {

    remarkPlugins: [

      ...remarkMdxPlugins,

      ...remarkPlugins

    ] as PluggableList,

    rehypePlugins: [
      ...rehypePlugins
    ] as PluggableList

  }

})

// only export the MDX-enhanced configuration
// Merge MDX config with Next.js config
export default withMDX(nextConfig)

//export default nextConfig // Original without mdx
