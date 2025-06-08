
import type CustomMiddleware from '@/types/CustomMiddleware'

export type MiddlewareFactory =
  (middleware: CustomMiddleware) => CustomMiddleware

export default MiddlewareFactory

