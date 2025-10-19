
import { NextResponse } from 'next/server'

import he from 'he' // HTML entity encoder

import {
  type BlogPostMeta,
  getAllBlogPosts
} from '@/lib/blog'

import { BASE_URL } from '@/lib/config'

export async function GET() {

  const posts: BlogPostMeta[] = await getAllBlogPosts()

  const entries = posts.map(post => {
    return `
      <entry>
        <title><![CDATA[${he.encode(post.title)}]]></title>
        <link href="${BASE_URL}/blog/${post.slug}"/>
        <id>${BASE_URL}/blog/${post.slug}</id>
        <updated>${new Date(post.updatedAt).toISOString()}</updated>
        <published>${new Date(post.createdAt).toISOString()}</published>
        <summary type="html"><![CDATA[${he.encode(post.excerpt)}]]></summary>
      </entry>
      `.trim().replace(/\r?\n/g, '')
  }).join('')

  const atom = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>My Blog</title>
      <link href="${BASE_URL}/blog/atom" rel="self"/>
      <link href="${BASE_URL}/blog"/>
      <id>${BASE_URL}</id>
      <updated>${new Date(posts[0]?.updatedAt || new Date()).toISOString()}</updated>
      ${entries}
    </feed>`.trim().replace(/\r?\n/g, '')

  return new NextResponse(atom, {
    headers: {
      'Content-Type': 'application/atom+xml'
    }
  })

}

