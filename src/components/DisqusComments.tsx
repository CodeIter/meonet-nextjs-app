
'use client'

import { useEffect } from 'react'


/*
Firefox Browser Uncaught Error: parseColor received unparseable color: oklch(0.210.034264.665)
    w https://meonet-vercel-app.disqus.com/embed.js:52
    j https://meonet-vercel-app.disqus.com/embed.js:52
    k https://meonet-vercel-app.disqus.com/embed.js:52
    m https://meonet-vercel-app.disqus.com/embed.js:52
    toJSON https://meonet-vercel-app.disqus.com/embed.js:52
    loadEmbed https://meonet-vercel-app.disqus.com/embed.js:54
    <anonymous> https://meonet-vercel-app.disqus.com/embed.js:54
embed.js:52:9713

Chromium Browser Error:
The FetchEvent for "https://meonet-vercel-app.disqus.com/embed.js" resulted in a network error response: the promise was rejected.
sw.js:1 Uncaught (in promise) no-response: no-response :: [{"url":"https://meonet-vercel-app.disqus.com/embed.js","error":{}}]
...
page-865d2d5069f27246.js:1  GET https://meonet-vercel-app.disqus.com/embed.js net::ERR_FAILED

*/

interface DisqusCommentsProps {
  url: string
  identifier: string
  shortname: string
}

export function DisqusComments({
  url,
  identifier,
  shortname,
}: DisqusCommentsProps) {

  useEffect(() => {
    window.disqus_config = function () {
      this.page.url = url
      this.page.identifier = identifier
    }

    const d = document
    const s = d.createElement('script')
    s.src = `https://${shortname}.disqus.com/embed.js`
    s.setAttribute('data-timestamp', String(+new Date()))
    ;(d.head || d.body).appendChild(s)

    return () => {
      // cleanup on unmount
      const script = d.querySelector(`script[src="${s.src}"]`)
      script?.remove()
      const thread = d.getElementById('disqus_thread')
      if (thread) thread.innerHTML = ''
    }
  }, [url, identifier, shortname])

  return (
    <>
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">
          comments powered by Disqus.
        </a>
      </noscript>
    </>
  )
}

export default DisqusComments

