'use client'

import { useEffect, useState } from 'react'

export default function ClientIP() {
  const [ip, setIp] = useState<string>('Loading...')

  useEffect(() => {
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Unknown'))
  }, [])

  return (
    <div className="text-sm text-gray-500">
      Client IP: <span className="font-mono">{ip}</span>
    </div>
  )
}
