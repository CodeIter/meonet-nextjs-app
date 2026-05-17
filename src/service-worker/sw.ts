
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { NetworkOnly, Serwist } from "serwist"

const EXTERNAL_DOMAINS = [
  'disqus.com',
  'disquscdn.com',
  'cdn.jsdelivr.net',  // mobileConsole CDN
]

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  runtimeCaching: [

    // ── Let external domains go straight to network, no caching ──
    {
      matcher: ({ url }) =>
        EXTERNAL_DOMAINS.some(domain =>
          url.hostname === domain || url.hostname.endsWith(`.${domain}`)
        ),
      handler: new NetworkOnly(),
    },

    // ── Default Next.js caching strategy ──
    ...defaultCache,

  ],

  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },

})

serwist.addEventListeners()

