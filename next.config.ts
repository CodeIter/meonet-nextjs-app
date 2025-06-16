import type { NextConfig } from "next"

import createMDX from '@next/mdx'

import withSerwistInit from "@serwist/next"

// Import remark plugins you want to use
import remarkPlugins from "./remark-plugins"

// Import remark mdx only plugins you want to use
import remarkMdxPlugins from "./remarkmdx-plugins"

// Import rehype plugins you want to use
import rehypePlugins from "./rehype-plugins"

/** @type { import('next').NextConfig } */
const nextConfig: NextConfig = {

  /* config options here */

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: [ 'js', 'jsx', 'mjs', 'ts', 'tsx', 'md', 'mdx' ],

  // Enable standalone output mode
  output: 'standalone',

  // Add security headers as per Next.js PWA docs
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;" }
        ],
      },
      {
        source: '/sw.js',
        headers: [
          // Service worker specific headers
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" }
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

    ],

    rehypePlugins

  }

})

const withSerwist = withSerwistInit({
  swSrc: "src/service-worker/sw.ts",
  swDest: "public/sw.js"
})

// Serwist outermost for correct build order
export default withSerwist(withMDX(nextConfig))

// only export the MDX-enhanced configuration
// Merge MDX config with Next.js config
//export default withMDX(nextConfig)

//export default nextConfig // Original without mdx
