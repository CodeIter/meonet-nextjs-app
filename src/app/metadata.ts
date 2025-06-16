
import type { Metadata } from 'next'

import packageJson from '#/package.json'

// Get author name, username and email
export const authorName = packageJson.author.name || 'Anonymous'
export const gitUsername = packageJson.author.username || 'Anonymous'
export const authorUrl = packageJson.author.url || packageJson.homepage

// Extract Git repo URL and username from package.json
export const repoUrl = packageJson.repository?.url || ''

export const APP_NAME = "Web App"
export const APP_DEFAULT_TITLE = "PWA Web App"
export const APP_TITLE_TEMPLATE = `%s - ${APP_NAME}`
export const APP_DESCRIPTION = packageJson.description

export const metadata: Metadata = {

  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: packageJson.keywords,
  authors: [{ name: authorName, url: authorUrl }],
  creator: gitUsername,
  publisher: gitUsername,

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  }

}

export default metadata
