import { Pluggable } from "unified"

// mdx plugins that you want to only use it on mdx files

// Import remark mdx only plugins you want to use

import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export const remarkMdxPlugins: Pluggable[] = [

  [ remarkMdxFrontmatter, { name: 'frontmatter' } ]

  // add more remark mdx only plugins here

]

export default remarkMdxPlugins
