
import { NextResponse } from 'next/server'

import he from 'he' // HTML entity encoder

import {
  type BlogPostMeta,
  getAllBlogPosts
} from '@/lib/blog'

import { BASE_URL } from '@/lib/config'

export async function GET() {

  const posts: BlogPostMeta[] = await getAllBlogPosts()

  const items = posts.map(post => {
    return `
        <item>
          <title><![CDATA[${he.encode(post.title)}]]></title>
          <link>${BASE_URL}/blog/${post.slug}</link>
          <description><![CDATA[${he.encode(post.excerpt)}]]></description>
          <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
          <guid>${BASE_URL}/blog/${post.slug}</guid>
        </item>
      `.trim().replace(/\r?\n/g, '')
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title><![CDATA[My Blog]]></title>
        <link>${BASE_URL}/blog</link>
        <description>Latest blog posts</description>
        <language>en-us</language>
        <pubDate>${new Date().toUTCString()}</pubDate>
        ${items}
      </channel>
    </rss>`.trim().replace(/\r?\n/g, '')

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml'
    }
  })

}

