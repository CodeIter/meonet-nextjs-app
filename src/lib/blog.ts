
import fs from "fs/promises"
import path from "path"

import he from 'he'

import matter from "gray-matter"
import { unified } from "unified"

import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkMdx from "remark-mdx"

import rehypeParse from "rehype-parse"
import rehypeStringify from "rehype-stringify"
import rehypeSanitize, {
  defaultSchema as rehypeSanitizeDefaultSchema
} from "rehype-sanitize"

import remarkPlugins from "#/remark-plugins"
import remarkMdxPlugins from "#/remarkmdx-plugins"
import rehypePlugins from "#/rehype-plugins"

// Use typeof to get the type of rehypeSanitizeDefaultSchema
type rehypeSanitizeDefaultSchemaType = typeof rehypeSanitizeDefaultSchema
export const mergerehypeSanitizeSchema = (
  ...sources: rehypeSanitizeDefaultSchemaType[]
): rehypeSanitizeDefaultSchemaType => {
  return sources.reduce(
    (
      acc: rehypeSanitizeDefaultSchemaType,
      source: rehypeSanitizeDefaultSchemaType
    ) => {
      return {
        ...acc,
        tagNames: [
          ...new Set([...(acc.tagNames ?? []), ...(source.tagNames ?? [])]),
        ],
        attributes: {
          ...acc.attributes,
          ...Object.fromEntries(
            Object.entries(source.attributes ?? {}).map(([tag, attrs]) => [
              tag,
              [...new Set([...(acc.attributes?.[tag] ?? []), ...(attrs ?? [])])],
            ])
          ),
        },
      }
    },
    { tagNames: [], attributes: {} }
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Use when needed
// Extend the default schema to allow iframes with specific attributes
export const rehypeSanitizeCustomSchema = mergerehypeSanitizeSchema(
  rehypeSanitizeDefaultSchema, {
    tagNames: ["iframe", "span"],
    attributes: {
      // Allow these attributes on iframe elements
      iframe: [
        "src", "width", "height",
        "frameborder", "allow", "allowfullscreen"
      ],
      // Allow using `role` and `aria-label` attributes on span element
      // in transformed HTML document, needed by remark-emoji plugin
      span: ["role", "aria-label"]
    }
  }
)

/**
 * Remove all Unicode control characters (\p{Cc}), except:
 * - Horizontal Tab (U+0009)
 * - Line Feed (U+000A)
 * - Carriage Return (U+000D)
 */
export const removeNonPrintableChars = (text: string): string => {
  // \x09 (=\u0009)       : Horizontal Tab \f (allowed)
  // \x0A (=\u000A)       : Line Feed / Newline \n (allowed)
  // \x0D (=\u000D)       : Carriage Return \r (allowed)
  // \x00 (=\u0000) - \x08 (=\u0008) : Null, start of heading, backspace,
  //                                   etc. (non-printable)
  // \x0B (=\u000B)       : Vertical Tab (removed, rarely used)
  // \x0C (=\u000C)       : Form Feed (removed, rarely used)
  // \x0E (=\u000E) - \x1F (=\u001F): Misc. control characters
  //                                  (non-printable)
  // \x7F (=\u007F)       : Delete (non-printable)
  //
  //return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  //return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  // “Unicode-aware” version means “match any Unicode control character”
  // (?![\u0009\u000A\u000D])   # assert that this codepoint is NOT:
  //                              TAB, LF or CR
  // \p{Cc}                     # then match any control character
  // /gu                        # g = global, u = unicode mode
  //
  // eslint-disable-next-line no-control-regex
  return text.replace(/\p{Cc}(?<![\u0009\u000A\u000D])/gu, '')
}

// Function to encode HTML entities
export const encodeHtml = (text: string): string => {
  // Encode using 'he' with specified options
  return he.encode(
    // Remove non-printable characters
    removeNonPrintableChars(text), {
    useNamedReferences: true,
    decimal: true
  })
}

// Define the blog post metadata interface
export interface BlogPostMeta {
  slug: string
  title: string
  author?: string
  license?: string
  excerpt: string
  keywords?: string[]
  createdAt: Date
  updatedAt: Date
  image?: string // Feature image filename or href
  alt?: string // Feature image alt text
  format: ContentFormat
  filename?: string // Store the actual filename
}

// Define the blog post interface
export interface BlogPost extends BlogPostMeta {
  content: string
}

// Define pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
}

//Represents the supported content formats for the application
export type ContentFormat = "markdown" | "mdx" | "html" | "text"

export const DEFAULT_FORMAT: ContentFormat = "markdown"

// Mapping object for content formats to file extensions
export const FORMAT_EXTENSION_MAP: Record<ContentFormat, string> = {
  markdown: ".md",
  mdx: ".mdx",
  html: ".html",
  text: ".txt"
}

// Define the supported file extensions
export const MARKDOWN_EXTENSIONS = [ ".md", ".markdown" ]
export const MDX_EXTENSIONS = [ ".mdx" ]
export const HTML_EXTENSIONS = [ ".html", ".htm", ".shtml", ".xhtml" ]
export const TEXT_EXTENSIONS = [ ".txt" ]
export const SUPPORTED_EXTENSIONS = [
  ...MARKDOWN_EXTENSIONS,
  ...MDX_EXTENSIONS,
  ...HTML_EXTENSIONS,
  ...TEXT_EXTENSIONS
]

// Define the blog directory
export const BLOG_DIRECTORY = path.join(process.cwd(), "blog")

// Function to get all blog posts with pagination
export const getAllBlogPosts = async (pagination?: PaginationParams): Promise<BlogPostMeta[]> => {
  try {
    // Ensure the blog directory exists
    await fs.mkdir(BLOG_DIRECTORY, { recursive: true })

    // Get all files in the blog directory
    const files = await fs.readdir(BLOG_DIRECTORY)

    // Filter out non-supported files and get their metadata
    const blogPostsPromises = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return SUPPORTED_EXTENSIONS.includes(ext)
      })
      .map((file) => getBlogPostMeta(file))

    // Wait for all promises to resolve
    const allBlogPosts = await Promise.all(blogPostsPromises)

    // Defensive sort by createdAt (newest first) using Date coercion to avoid mixed types
    const sortedPosts = allBlogPosts.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Apply pagination if provided
    if (pagination) {
      const { page = 1, limit = 10 } = pagination
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      return sortedPosts.slice(startIndex, endIndex)
    }

    return sortedPosts
  } catch (error) {
    console.error("Error getting blog posts:", error)
    return []
  }
}

// Function to get the total count of blog posts
export const getBlogPostCount = async (): Promise<number> => {
  try {
    // Ensure the blog directory exists
    await fs.mkdir(BLOG_DIRECTORY, { recursive: true })

    // Get all files in the blog directory
    const files = await fs.readdir(BLOG_DIRECTORY)

    // Count only supported files that are not frontmatter files
    const count = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return SUPPORTED_EXTENSIONS.includes(ext) && !file.endsWith(".frontmatter")
    }).length

    return count
  } catch (error) {
    console.error("Error counting blog posts:", error)
    return 0
  }
}

// Function to get a blog post by slug
export const getBlogPostBySlug = async (
  slug: string,
  options?: { noRender?: boolean; noContent?: boolean }
): Promise<BlogPost | null> => {

  const { noRender = false, noContent = false } = options ?? {}

  try {
    // Get all blog posts
    const allPosts = await getAllBlogPosts()

    // Find the post with the matching slug
    const post = allPosts.find((p) => p.slug === slug)
    if (!post) return null

    // Use the stored filename instead of constructing it from the slug
    const filePath = path.join(BLOG_DIRECTORY, post.filename || "")

    if (!post.filename) {
      console.error(`No filename found for slug: ${slug}`)
      return null
    }

    try {

      // If noContent is true, skip processing and return metadata only
      if (noContent) {
        return {
          ...post,
          content: ""
        }
      }

      const fileContent = await fs.readFile(filePath, "utf-8")

      const matterResult = matter(fileContent)
      let content = matterResult.content

      // Skip rendering if noRender is true
      if (!noRender) {

        // Parse the content based on the format
        if (post.format === "markdown") {
          const processedContent = await unified()
            .use(remarkParse)
            .use(remarkPlugins)
            .use(remarkRehype)
            .use(rehypePlugins)
            .use(rehypeSanitize, rehypeSanitizeCustomSchema)
            .use(rehypeStringify)
            .process(matterResult.content)
          content = processedContent.toString()
        } else if (post.format === "mdx") {
          const processedContent = await unified()
            .use(remarkParse)
            .use(remarkMdx)
            .use(remarkMdxPlugins)
            .use(remarkPlugins)
            .use(remarkRehype)
            .use(rehypePlugins)
            .use(rehypeSanitize, rehypeSanitizeCustomSchema)
            .use(rehypeStringify)
            .process(matterResult.content)
          content = processedContent.toString()
        } else if (post.format === "html") {
          const processedContent = await unified()
            .use(rehypeParse, { fragment: true })
            .use(rehypePlugins)
            .use(rehypeSanitize, rehypeSanitizeCustomSchema)
            .use(rehypeStringify)
            .process(matterResult.content)
          content = processedContent.toString()
        } else {
          // For text, just use the raw content
          content = encodeHtml(matterResult.content)
        }

      }

      return {
        ...post,
        content
      }

    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return null
    }

  } catch (error) {
    console.error(`Error getting blog post by slug ${slug}:`, error)
    return null
  }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Gets the file extension for the given content format.
 * @param format - The content format.
 * @returns The file extension for the given content format.
 */
export const getExtensionFromFormat = (
  format: ContentFormat = DEFAULT_FORMAT
): string => {
  return FORMAT_EXTENSION_MAP[format] ??
    FORMAT_EXTENSION_MAP[DEFAULT_FORMAT]
}

export function generateTitleFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function generateSlugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

// Helper to coerce a value (string | Date | undefined) -> valid Date
function coerceToDate(value: unknown, fallback: Date): Date {
  if (!value) return fallback
  // If it's already a Date instance and valid
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value
  }
  // If it's a number (timestamp)
  if (typeof value === 'number' && !isNaN(value)) {
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d
  }
  // If it's a string, try parsing
  if (typeof value === 'string') {
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d
  }
  // Fallback to provided fallback Date
  return fallback
}

// Function to get blog post metadata from a file
export const getBlogPostMeta = async (filename: string): Promise<BlogPostMeta> => {
  const filePath = path.join(BLOG_DIRECTORY, filename)
  const extension = path.extname(filename).toLowerCase()

  // Get file stats for default createdAt and modifiedAt
  const stats = await fs.stat(filePath)

  // Parse the filename to extract the slug
  // Check if the filename has a date-time prefix (YYYY-MM-DD-HHMMSS-*)
  const filenameWithoutExt = path.basename(filename, extension)
  const dateTimeRegex = /^(\d{4}-\d{1,2}-\d{1,2}(-\d{1,6})?)-(.+)$/
  const match = filenameWithoutExt.match(dateTimeRegex)

  // Default slug is the filename without extension
  let slug = filenameWithoutExt

  // date time from filename if available
  let dateobj: Date | null = null

  // If the filename has a date-time prefix, extract the actual slug
  if (match) {
    slug = match[3] ?? filenameWithoutExt
    const datePart = match[1] ?? "" // e.g. "2025-10-30-123456" or "2025-10-30"
    const parts = datePart.split("-") ?? []
    // parts = ["2025","10","30"] or ["2025","10","30","123456"]
    const y = parts[0] ?? "1970"
    const mm = (parts[1] ?? "1").padStart(2, "0")
    const d = (parts[2] ?? "1").padStart(2, "0")
    let iso = `${y}-${mm}-${d}T00:00:00Z`
    if (parts.length > 3) {
      const hhmmss = (parts[3] ?? "0").padStart(6, "0") // ensure at least HHMMSS
      const hh = hhmmss.slice(0, 2)
      const min = hhmmss.slice(2, 4)
      const ss = hhmmss.slice(4, 6)
      iso = `${y}-${mm}-${d}T${hh}:${min}:${ss}Z` // UTC
    }
    dateobj = new Date(iso)
  }

  // Determine the format based on the extension
  let format: ContentFormat = DEFAULT_FORMAT
  if (MARKDOWN_EXTENSIONS.includes(extension)) {
    format = "markdown"
  } else if (HTML_EXTENSIONS.includes(extension)) {
    format = "html"
  } else if (MDX_EXTENSIONS.includes(extension)) {
    format = "mdx"
  } else if (TEXT_EXTENSIONS.includes(extension)) {
    format = "text"
  }

  // Default metadata
  let meta: Partial<BlogPostMeta> = {
    slug,
    title: generateTitleFromSlug(slug),
    excerpt: "",
    createdAt: dateobj ?? stats.birthtime ?? stats.mtime,
    updatedAt: dateobj ?? stats.mtime,
    format,
    filename // Store the actual filename
  }

  // Read the file content and parse frontmatter
  const fileContent = await fs.readFile(filePath, "utf-8")
  const matterResult = matter(fileContent)

  // Merge frontmatter but DO NOT blindly trust createdAt/updatedAt types
  meta = {
    ...meta,
    ...matterResult.data,
    excerpt: matterResult.data?.excerpt || extractExcerpt(matterResult.content)
  }

  // choose safe fallback created date: prefer birthtime only if it's a sane
  // non-zero timestamp
  const birthtimeValid = stats.birthtime instanceof Date &&
    !Number.isNaN(stats.birthtime.getTime()) && stats.birthtime.getTime() > 0

  // Ensure createdAt and updatedAt are Date objects.
  // If frontmatter provided strings (or invalid values), coerce to Date;
  // otherwise fallback to file stats.
  const fallbackCreated = birthtimeValid ? stats.birthtime : stats.mtime
  const fallbackUpdated = stats.mtime

  // Use the helper to coerce or fallback
  meta.createdAt = coerceToDate(meta.createdAt, fallbackCreated)
  meta.updatedAt = coerceToDate(meta.updatedAt, fallbackUpdated)

  return meta as BlogPostMeta
}

// Helper function to extract an excerpt from content
export const extractExcerpt = (content: string, maxLength = 150): string => {
  // Try to find the first paragraph - using /s flag which is supported in ES2018+
  const paragraphMatch = content.match(/(?:<p[^>]*>)?(.*?)(?:<\/p>|\n\n)/s)

  if (paragraphMatch && paragraphMatch[1]) {
    // Remove HTML tags
    const excerpt = encodeHtml(paragraphMatch[1].replace(/<[^>]*>/g, ""))

    // Truncate if needed
    if (excerpt.length > maxLength) {
      return excerpt.substring(0, maxLength) + "..."
    }
    return excerpt
  }

  // Fallback: just take the first maxLength characters
  if (content.length > maxLength) {
    return content.substring(0, maxLength).replace(/<[^>]*>/g, "") + "..."
  }

  return content.replace(/<[^>]*>/g, "")
}
