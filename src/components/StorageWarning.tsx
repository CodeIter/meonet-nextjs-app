
'use client'
import { useEffect } from 'react'

export default function StorageWarning() {
  useEffect(() => {
    fetch('/api/storage')
      .then(res => res.json())
      .then(data => {
        if (data.storageType === 'temp_fs') {
          alert('⚠️ Warning: Using temporary storage. Data will be lost on restart.')
        }
      })
  }, [])
  return null
}