
import { type NextRequest, NextResponse } from 'next/server'

import {
  type BlogPostMeta,
  type BlogPost,
  type PaginationParams,
  getAllBlogPosts,
  getBlogPostBySlug
} from '@/lib/blog'

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url)

  const query: string = searchParams.get('q')?.toLowerCase()

  if (!query) {
    return NextResponse.json({
      error: 'Missing search query'
    }, { status: 400 })
  }

  const terms: string[] = query.split(/\W+/).filter(Boolean)

  // Stop-words (all lowercase for consistent comparison)
  const STOP_WORDS: string[] = [
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an',
    'and', 'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been',
    'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't",
    'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't",
    'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from',
    'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having',
    'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers',
    'herself', "'s", "'t", "'d", "'ll", "'ve", "'m",
    'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm",
    "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
    "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor',
    'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
    'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she',
    "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such',
    'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves',
    'then', 'there', "there's", 'these', 'they', "they'd", "they'll",
    "they're", "they've", 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're",
    "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
    "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's",
    'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're",
    "you've", 'your', 'yours', 'yourself', 'yourselves'
  ]

  // Filter out any term that (lowercased) appears in STOP_WORDS
  const filteredTerms = terms.filter( (term: string) => {
    return !STOP_WORDS.includes(term.toLowerCase())
  })

  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const limitParam = parseInt(searchParams.get('limit') ?? '10', 10)

  const paginationParams: PaginationParams = {
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
    limit: Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 10
  }

  const posts: BlogPostMeta[] = await getAllBlogPosts(paginationParams)

  const results: BlogPostMeta[] = []

  for (const post of posts) {

    const postWithContent: BlogPost | null = await getBlogPostBySlug(post.slug)

    if (!postWithContent) continue

    const { content } = postWithContent

    const searchableText = `
      ${post.slug.toLowerCase()}
      ${post.title.toLowerCase()}
      ${post.keywords.join(' ').toLowerCase() || ''}
      ${content?.toLowerCase() || ''}
    `

    const found = filteredTerms.some( (term: string) => {
      return searchableText.includes(term)
    })

    if (found) {
      results.push(post)
    }

  }

  const simplified = results.map( (post: BlogPostMeta) => {
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

