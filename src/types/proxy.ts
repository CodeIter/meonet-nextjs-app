
import type { NextRequest, NextResponse } from 'next/server'

export type ProxyStorage = Map<string, unknown>

export type ProxyFn = (
  request: NextRequest,
  storage: ProxyStorage
) => Promise<NextResponse | void> | NextResponse | void

