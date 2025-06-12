import type { NextConfig } from "next"

import createMDX from '@next/mdx'

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

// only export the MDX-enhanced configuration

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

//export default nextConfig // Original without mdx
