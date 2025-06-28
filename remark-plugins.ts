import { Pluggable } from "unified"

// Import remark plugins you want to use

import remarkFrontmatter from 'remark-frontmatter'

import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkGemoji from 'remark-gemoji'

//import remarkSqueezeParagraphs from
//  'remark-squeeze-paragraphs'
//import remarkSmartypants from 'remark-smartypants'
//import remarkDirective from 'remark-directive'
//import remarkMath from 'remark-math'
//import remarkComment from '@slorber/remark-comment'
//import remarkToc from 'remark-toc'
//import remarkBreaks from 'remark-breaks'
//import remarkMdc from 'remark-mdc'
//import remarkAdmonitions from 'remark-admonitions'
//import remarkGridTables from '@adobe/remark-gridtables'
//import remarkValidateLinks from 'remark-validate-links'
//import remarkSupersub from 'remark-supersub'
//import remarkReferenceLinks from 'remark-reference-links'
//import remarkYamlConfig from 'remark-yaml-config'
//import remarkCommentConfig from 'remark-comment-config'
//import remarkDirectiveRehype from 'remark-directive-rehype'
//import remarkIns from 'remark-ins'
//import remarkRemoveComments from 'remark-remove-comments'
//import remarkDeflist from 'remark-deflist'
//import remarkRetext from 'remark-retext'

// XXX Error: No "exports" main defined in
//     .../node_modules/remark-emoji/package.json
//     'ERR_PACKAGE_PATH_NOT_EXPORTED'
//     Imported successively but error when using it
//     in remarkPlugins array.
//     Fixed by patching `remark-emoji` 's `package.json`
//     and modifying
//     the "exports" field from conditional exports
//     to simple string exports.
// XXX For option 'accessible: true', Need rehype sanitize
//     custom schema with span attributes 'role',
//     'ariaLabel
//import remarkEmoji from 'remark-emoji'

// XXX About markdown/mdx custom heading id
//     use workaround `# title \{#custom-anchor\} if
//     conflict with jsx`
//     workaround reported to work for 'remark-heading-id'
//     (package outdated Dec 11, 2023) but it migth work
//     if 'remark-custom-heading-id'(package
//     maintained Jun 22, 2024) has some conflict.
//import remarkCustomHeadingId from 'remark-custom-heading-id'

// Enable and install it if you want Mermaid diagrams
//import remarkMermaid from '@theguild/remark-mermaid'

// Import retext plugins you want to use
// ...

//import admonitionCustomTypes from './admonitionCustomTypes'

export const remarkPlugins: Pluggable[] = [

  remarkFrontmatter,

  remarkGfm,
  remarkGithub,
  remarkGemoji,
  //[ remarkEmoji, { accessible: true }],

  //remarkBreaks,
  //remarkSmartypants,
  //remarkSqueezeParagraphs,

  //remarkDirective,
  //// Must be used AFTER remark-directive
  //remarkDirectiveRehype,

  //remarkMath,
  //remarkComment,
  //[ remarkToc, {
  //  heading: 'Table of Contents', maxDepth: 3
  //}],
  //remarkMdc,

  //remarkGridTables,
  //remarkValidateLinks,
  //remarkSupersub,
  //remarkReferenceLinks,
  //remarkYamlConfig,
  //remarkCommentConfig,
  //remarkIns,
  //remarkRemoveComments,
  //remarkCustomHeadingId,
  //remarkDeflist,

  //[ remarkAdmonitions, {
  //  // The default keywords are important, tip, note,
  //  // warning, and danger.
  //  // Aliases for info => important, success => tip,
  //  // secondary => note and danger => warning
  //  //  have been added for Infima compatibility.
  //  // Default keyword types can coexist with custom types.
  //  // Custom type keywords take precedence over
  //  // and override
  //  // the default keywords.
  //  customTypes: admonitionCustomTypes,
  //  tag: ':::',
  //  icons: 'emoji',
  //  infima: false
  //}],

  // Enable if you want Mermaid diagrams
  //remarkMermaid,

  //[ remarkRetext, []]

  // add more remark plugins here

]

export default remarkPlugins
