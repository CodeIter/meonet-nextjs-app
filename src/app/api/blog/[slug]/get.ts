
import { type NextRequest, NextResponse } from 'next/server'

import {
  type BlogPost,
  getBlogPostBySlug
} from '@/lib/blog'

interface ContextProps {
  params: Promise<{ slug: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {

  const { slug } = await params

  const post: BlogPost = await getBlogPostBySlug(slug)

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const {
    slug, title, author, license,
    createdAt, updatedAt, keywords,
    excerpt, content
  } = post

  return NextResponse.json({
    slug, title, author, license,
    createdAt, updatedAt, keywords,
    excerpt, content
  })

}

