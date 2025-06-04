
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const CODE_LENGTH = 7

export function generateShortCode(): string {
  let result = ""
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }
  return result
}

// Generate a UUID for the short URL using browser-compatible method
export function generateUuid(): string {
  // This implementation works in both browser and Edge runtime
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Validate a URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

type HttpRequestWithSocket = {
  headers: Headers | Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}

/**
 * Gets the client IP address from request headers with secure proxy handling
 * @param request - The incoming Request object or IncomingMessage
 * @returns The client IP address (with appropriate fallbacks)
 *
 * Header priority:
 * 1. X-Vercel-Forwarded-For (Vercel-specific)
 * 2. True-Client-IP (Akamai/Akamai-based services)
 * 3. CF-Connecting-IP (Cloudflare)
 *
 * x-forwarded-for is processed with security best practices:
 *     - Only trusts the rightmost IP in the chain (the one added by our trusted reverse proxy)
 *
 * Update this function and only enable http header that is controlled by your trusted reverse proxy. Comment not used http header.
 *
 * Always ensure XFF and similar HTTP headers are set and controlled exclusively by your trusted reverse proxy.
 *
 * For robust security, always ensure XFF and similar HTTP headers are
 * exclusively set and controlled by your trusted reverse proxy.
 * Crucially, configure your reverse proxy (or web server, via middleware,
 * or configuration files like NGINX/Apache) to clear or overwrite any
 * incoming untrusted XFF and XFF-like headers from the client.
 * This proactive measure is vital because many third-party libraries might
 * prioritize untrusted XFF-like headers or process the XFF chain in an
 * insecure manner (e.g., by trusting the first IP in the chain),
 * potentially leading to vulnerabilities.
 * By clearing these headers before they reach your application and its
 * libraries, you prevent misinterpretation and enhance your overall
 * security posture.
 *
 */
export function getClientIp(request: Request | HttpRequestWithSocket): string {
  // Check trusted headers first (non-proxy-chain headers)
  const trustedHeaders = [
    "x-vercel-forwarded-for", // Vercel's custom header
    "true-client-ip", // Akamai and Cloudflare
    "cf-connecting-ip", // Cloudflare
  ]

  for (const header of trustedHeaders) {
    // Check if headers has a get method (standard Request object)
    if (typeof request.headers === "object" && "get" in request.headers && typeof request.headers.get === "function") {
      const value = request.headers.get(header)
      if (value) return value.trim()
    }
    // Otherwise, try to access as a record (Node.js IncomingMessage)
    else if (typeof request.headers === "object" && !("get" in request.headers)) {
      // Use type assertion to tell TypeScript this is a record with string keys
      const headers = request.headers as Record<string, string | string[] | undefined>
      const value = headers[header]
      if (typeof value === "string") return value.trim()
      // Handle string[] case
      if (Array.isArray(value) && value.length > 0) {
        const first: string | undefined = value[0]
        if (typeof first === "string") {
          return first.trim()
        }
      }
    }
  }

  // Process x-forwarded-for with security best practices
  let xForwardedFor: string | undefined = undefined

  // Check if headers has a get method (standard Request object)
  if (typeof request.headers === "object" && "get" in request.headers && typeof request.headers.get === "function") {
    xForwardedFor = request.headers.get("x-forwarded-for") ?? undefined
  }
  // Otherwise, try to access as a record (Node.js IncomingMessage)
  else if (typeof request.headers === "object" && !("get" in request.headers)) {
    // Use type assertion to tell TypeScript this is a record with string keys
    const headers = request.headers as Record<string, string | string[] | undefined>
    const value = headers["x-forwarded-for"]
    if (typeof value === "string") xForwardedFor = value
    // Handle string[] case
    if (Array.isArray(value) && value.length > 0) {
      xForwardedFor = value[0] ?? undefined
    }
  }

  if (xForwardedFor) {
    // Security note: We take the RIGHTMOST IP as it's added by our trusted reverse proxy
    // This prevents spoofing from client-supplied values in left positions
    const ips = xForwardedFor
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip)
    return ips[ips.length - 1] || "127.0.0.1"
  }

  // Fallback to socket remoteAddress if available (Node.js server)
  // Type guard to check if request has a socket property (HttpRequestWithSocket)
  if ("socket" in request && request.socket && request.socket.remoteAddress) {
    const socketIp = request.socket.remoteAddress
    if (socketIp !== "::1" && socketIp !== "::ffff:127.0.0.1") {
      return socketIp
    }
  }

  // Final fallbacks with localhost detection
  return typeof process !== "undefined" && process.env?.NODE_ENV !== "production" ? "localhost" : "127.0.0.1"
}

// Format a date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
}

