
'use client'

import { useEffect } from 'react'

export default function StorageWarning() {
  useEffect(() => {
    fetch('/api/storage')
      .then(res => res.json())
      .then(data => {
        if (data.storageType === 'disabled') {
          alert('⚠️ Warning: Database storage disabled.')
        }
      })
  }, [])
  return null
}
