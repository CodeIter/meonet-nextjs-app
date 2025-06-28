import { Pluggable } from "unified"

// mdx plugins that you want to only use it on mdx files

// Import remark mdx only plugins you want to use

import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export const remarkMdxPlugins: Pluggable[] = [

  // This package depends on the AST output by remark-frontmatter
  remarkFrontmatter,
  [ remarkMdxFrontmatter, { name: 'frontmatter' } ]

  // add more remark mdx only plugins here

]

export default remarkMdxPlugins
