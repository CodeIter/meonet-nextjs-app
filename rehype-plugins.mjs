/** @type {import('unified').Pluggable[]} */

// Import rehype plugins you want to use

import rehypeUnwrapImages from 'rehype-unwrap-images'
import rehypeSlug from 'rehype-slug'

// starry-night has a WASM dependency and large grammars, which
// might be too heavy for browsers. Use rehype-highlight
// if you want a lighter alternative
//import rehypeStarryNight from 'rehype-starry-night'
import rehypeHighlight from 'rehype-highlight'

export const rehypePlugins = [

  rehypeUnwrapImages,
  rehypeSlug,

  // Disabled due to WASM dependency and large grammar size.
  // Uncomment to enable if suitable.
  //rehypeStarryNight
  rehypeHighlight

  // add more rehype plugins here

]

export default rehypePlugins
