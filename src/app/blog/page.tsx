
'use client'

import { useEffect, useState } from 'react'

import { type BlogPostMeta } from '@/lib/blog'

import { BlogPostList } from '@/components/BlogPostList'
import { LoadMoreButton } from '@/components/LoadMoreButton'

export default function BlogPage() {

  const [posts, setPosts] = useState<BlogPostMeta[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Fetch posts whenever `page` changes
  useEffect(() => {
    fetchPosts(page)
  }, [page])

  async function fetchPosts(pageNum: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/blog/list?page=${pageNum}&limit=10`)
      const data = await res.json()
      if (!data.posts || data.posts.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev =>
          pageNum === 1 ? data.posts : [...prev, ...data.posts]
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
      </header>

      {/* Post list or loading indicator */}
      {posts.length === 0 && loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading posts…
        </p>
      ) : (
        <BlogPostList posts={posts} />
      )}

      {/* Load more button */}
      {hasMore && !loading && (
        <div className="mt-8 flex justify-center">
          <LoadMoreButton
            onClick={() => setPage(prev => prev + 1)}
            disabled={!hasMore || loading}
          />
        </div>
      )}

      {/* Spinner while fetching next page */}
      {loading && posts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div
            className="
              inline-block
              h-8 w-8
              animate-spin
              rounded-full
              border-4
              border-blue-600
              border-t-transparent
            "
            role="status"
            aria-label="Loading more posts…"
          />
        </div>
      )}

    </section>
  )

}

