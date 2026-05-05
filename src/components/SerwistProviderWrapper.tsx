
'use client'

import { SerwistProvider } from "@serwist/next/react"

interface SerwistProviderWrapperProps {
  swUrl: string
  disable?: boolean
}

export default function SerwistProviderWrapper({
  swUrl,
  disable,
}: SerwistProviderWrapperProps) {
  return (
    <SerwistProvider swUrl={swUrl} disable={disable} />
  )
}

