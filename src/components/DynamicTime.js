"use client"

import { useState, useEffect } from 'react'

export default function DynamicTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString()
      setTime(currentTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h2>Current Time</h2>
      <p>{time}</p>
    </div>
  )
}
