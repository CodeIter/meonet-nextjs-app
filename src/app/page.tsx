
import Link from 'next/link'
import { LinkIcon, FileTextIcon, ShieldIcon, ZapIcon } from 'lucide-react'
import { type BlogPostMeta } from '@/lib/blog'
import { BlogPostList } from '@/components/BlogPostList'

async function getRecentPosts() {
  try {
    // Note: Using a direct import or a database call would be more efficient
    // than a fetch call to our own API route in a Server Component.
    // However, for this exercise, we'll stick to the fetch call.
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog/list?page=1&limit=5`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      // Log the error for debugging purposes
      console.error(`Error fetching blog posts: ${res.statusText}`);
      return { posts: [], error: 'Failed to fetch posts.' };
    }

    const data = await res.json();
    return { posts: data.posts || [], error: null };
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return { posts: [], error: 'An unexpected error occurred.' };
  }
}

export default async function HomePage() {
  const { posts, error } = await getRecentPosts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Web App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for URL shortening and secure text sharing.
            Fast, reliable, and built with modern web technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shorten"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <LinkIcon className="w-5 h-5" />
              Shorten URL
            </Link>
            <Link
              href="/paste"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FileTextIcon className="w-5 h-5" />
              Create Paste
            </Link>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Blog Posts</h2>
          {error ? (
            <p className="text-center text-red-500 dark:text-red-400">
              {error}
            </p>
          ) : posts.length > 0 ? (
            <>
              <BlogPostList posts={posts} />
              <div className="mt-8 flex justify-center">
                <Link
                  href="/blog"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  View More
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No blog posts available yet.
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <LinkIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">URL Shortener</h3>
            <p className="text-gray-600">
              Transform long URLs into short, shareable links. Perfect for social media,
              emails, and anywhere character count matters.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ShieldIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Pastebin</h3>
            <p className="text-gray-600">
              Share code snippets and text securely with optional password protection
              and client-side encryption for maximum privacy.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ZapIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with Next.js and modern web technologies for optimal performance
              and user experience across all devices.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Fast</div>
              <div className="text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Secure</div>
              <div className="text-gray-600">Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Simple</div>
              <div className="text-gray-600">Interface</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Free</div>
              <div className="text-gray-600">To Use</div>
            </div>
          </div>
        </div>

      </div>

    </main>
  )
}
