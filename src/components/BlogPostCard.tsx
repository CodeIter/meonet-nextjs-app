
'use client'

import Link from 'next/link'
import Image from 'next/image'

import { type BlogPostMeta } from '@/lib/blog'

interface BlogPostCardProps {
  post: BlogPostMeta
}

export function BlogPostCard({ post }: BlogPostCardProps) {

  const created = new Date(post.createdAt).toLocaleDateString()
  const updated = new Date(post.updatedAt).toLocaleDateString()

  return (
    <article
      className="
        border 
        rounded-lg 
        overflow-hidden 
        bg-white 
        dark:bg-gray-800 
        transition-shadow 
        hover:shadow-lg
        focus-within:shadow-lg
      "
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Read full post: ${post.title}`}
      >
        {/* Featured image (if available) */}
        {post.image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.image}
              alt={post.alt ?? `Featured image for ${post.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Textual content */}
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          <div className="mt-2 flex flex-wrap text-sm text-gray-600 dark:text-gray-400 gap-4">
            <span>By {post.author}</span>
            <span>License: {post.license}</span>
          </div>

          <div className="mt-2 flex flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-4">
            <time dateTime={post.createdAt}>Created: {created}</time>
            <time dateTime={post.updatedAt}>Updated: {updated}</time>
          </div>

          <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
            {post.excerpt}
          </p>

          {post.keywords.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.keywords.map((tag) => (
                <li key={tag}>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    #{tag}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <span
              className="
                inline-block 
                text-sm 
                font-medium 
                text-blue-600 
                dark:text-blue-400 
                group-hover:underline
              "
            >
              Read more &rarr;
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

