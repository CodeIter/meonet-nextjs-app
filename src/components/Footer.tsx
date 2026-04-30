
import {
  gitUsername, repoUrl
} from '@/app/metadata.ts'

import ClientIP from '@/components/ClientIP'
import { APP_NAME } from '@/app/metadata'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 { APP_NAME }. Built with ❤️ by @{gitUsername}</p>
          <p className="mt-2 text-sm text-center">
            MIT License
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <a href="https://nextjs.org"  className="hover:text-blue-600 transition-colors">Next.js</a>
            <span>•</span>
            <a href="https://tailwindcss.com"  className="hover:text-blue-600 transition-colors">Tailwind CSS</a>
            <span>•</span>
            <a href={repoUrl}  className="hover:text-blue-600 transition-colors">Source</a>
          </div>
          {/* Add client IP component here */}
          <div className="mt-4">
            <ClientIP />
          </div>
        </div>
      </div>
    </footer>
  )
}
