
export default function Head() {
  return (
    <>
      {/* Favicon */}
      <link rel="icon" href="/static/favicon.ico" sizes="any" />
      <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
      <link rel="icon" type="image/png" sizes="96x96" href="/static/favicon-96x96.png" />

      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-icon-180x180.png" />

      {/* PWA Icons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/static/web-app-manifest-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/static/web-app-manifest-512x512.png" />

      {/* Apple Metadata */}
      <meta name="apple-mobile-web-app-title" content="Web App" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />

    </>
  )
}
