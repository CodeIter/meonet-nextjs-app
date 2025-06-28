'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-8 text-center text-red-700 bg-red-50 rounded-lg shadow-md max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  )
}
