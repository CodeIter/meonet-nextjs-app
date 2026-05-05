
'use client'

import { SerwistProvider } from "@serwist/next/react"
import type { ReactNode } from "react"

interface SerwistProviderWrapperProps {
  children: ReactNode
  swUrl: string
  disable?: boolean
}

export default function SerwistProviderWrapper({
  children,
  swUrl,
  disable,
}: SerwistProviderWrapperProps) {
  return (
    <SerwistProvider swUrl={swUrl} disable={disable}>
      {children}
    </SerwistProvider>
  )
}

