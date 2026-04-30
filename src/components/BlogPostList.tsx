
'use client'

import { type BlogPostMeta } from '@/lib/blog'

import { BlogPostCard } from '@/components/BlogPostCard'

export function BlogPostList({ posts }: { posts: BlogPostMeta[] }) {

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        No posts found.
      </div>
    )
  }

  return (
    <section
      aria-label="Blog post list"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
    >
      <h2 className="sr-only">Latest Blog Posts</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: BlogPostMeta) => (
          <li key={post.slug}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )

}

