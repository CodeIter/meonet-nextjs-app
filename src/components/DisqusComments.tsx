
'use client'

import { useEffect } from 'react'

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

