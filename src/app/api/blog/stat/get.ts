
import { NextResponse } from 'next/server'

import {
  type BlogPostMeta,
  getBlogPostCount,
  getAllBlogPosts,
} from '@/lib/blog'

export async function GET() {

  const count: number = await getBlogPostCount()

  const posts: BlogPostMeta[] = await getAllBlogPosts()

  const latestDate = posts.reduce((latest, post) => {
    const postDate = new Date(post.createdAt)
    return postDate > latest ? postDate : latest
  }, new Date(0))

  return NextResponse.json({
    totalPosts: count,
    latestPostDate: latestDate.toISOString()
  })

}

