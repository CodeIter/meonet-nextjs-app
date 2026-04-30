
'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { type BlogPost } from '@/lib/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: Props) {

  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const { slug } = await params
      const res = await fetch(`/api/blog/${slug}`)
      const data = await res.json()
      setPost(data)
    }
    fetchPost()
  }, [params])

  if (!post) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div
          className="
            inline-block
            h-12
            w-12
            animate-spin
            rounded-full
            border-4
            border-blue-600
            border-t-transparent
          "
          role="status"
          aria-label="Loading…"
        />
      </div>
    )
  }

  return (
    <article className="prose prose-lg dark:prose-invert mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-block mb-6 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to all posts
      </Link>

      {/* Title */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

        {/* Featured Image (optional) */}
        {post.image && (
          <div className="mt-6">
            <Image
              src={post.image}
              alt={post.alt ?? `Featured image for ${post.title}`}
              width={800}
              height={400}
              className="w-full rounded-lg object-cover"
              priority
            />
          </div>
        )}

        {/* Meta info */}
        <div className="mt-4 flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-4">
          {post.author && <span>By {post.author}</span>}
          {post.license && <span>License: {post.license}</span>}
          <time dateTime={post.createdAt.toString()}>
            Created: {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <time dateTime={post.updatedAt.toString()}>
            Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </time>
        </div>

        {/* Keywords */}
        {(post.keywords ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(post.keywords ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Post Content */}
      <section
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

    </article>
  )

}

