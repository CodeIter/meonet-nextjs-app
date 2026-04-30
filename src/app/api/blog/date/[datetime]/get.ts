
import { type NextRequest, NextResponse } from 'next/server'

import {
  type BlogPostMeta,
  type PaginationParams,
  getAllBlogPosts
} from '@/lib/blog'

interface ContextProps {
  params: Promise<{ datetime: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {

  const { datetime } = await params

  const targetDate = new Date(datetime)

  if (isNaN(targetDate.getTime())) {
    return NextResponse.json({
      error: 'Invalid date format'
    }, { status: 400 })
  }

  const { searchParams } = request.nextUrl

  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const limitParam = parseInt(searchParams.get('limit') ?? '10', 10)

  const paginationParams: PaginationParams = {
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
    limit: Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 10
  }

  const posts: BlogPostMeta[] = await getAllBlogPosts(paginationParams)

  const targetDateString = targetDate.toISOString().split('T')[0]

  const filtered: BlogPostMeta[] = posts.filter( (post: BlogPostMeta) => {
    const createdAt = new Date(post.createdAt).toISOString().split('T')[0]
    const updatedAt = new Date(post.updatedAt).toISOString().split('T')[0]
    return createdAt === targetDateString
      || updatedAt === targetDateString
  })

  const simplified = filtered.map( (post: BlogPostMeta) => {
    const {
      slug, title, author, license,
      createdAt, updatedAt, keywords, excerpt
    } = post
    return {
      slug, title, author, license,
      createdAt, updatedAt, keywords, excerpt
    }
  })

  return NextResponse.json({
    pagination: paginationParams,
    count: simplified.length,
    posts: simplified
  })

}

