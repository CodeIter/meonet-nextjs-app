
import { NextResponse } from 'next/server'

import {
  type BlogPostMeta,
  type PaginationParams,
  getAllBlogPosts
} from '@/lib/blog'

export async function GET() {

  const { searchParams } = request.nextUrl

  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const limitParam = parseInt(searchParams.get('limit') ?? '10', 10)

  const paginationParams: PaginationParams = {
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
    limit: Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 10
  }

  const posts: BlogPostMeta[] = await getAllBlogPosts(paginationParams)

  const simplified = posts.map( (post: BlogPostMeta) => {
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

