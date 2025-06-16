
import type { MetadataRoute } from 'next'

import packageJson from '#/package.json'

export default function manifest(): MetadataRoute.Manifest {
  return {

    name: 'Web App',
    short_name: packageJson.name,
    description: packageJson.description,

    start_url: '/',
    scope: '/',
    orientation: 'portrait',
    lang: 'en',
    display: 'standalone',

    // Adjust as needed for your brand
    theme_color: '#1a202c',
    background_color: '#ffffff',

    screenshots: [],

    // Icons generator https://realfavicongenerator.net/
    icons: [
      {
        src: '/static/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/static/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/static/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/static/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      }
    ], // End Icons

  } // End Return

} // End function manifest

