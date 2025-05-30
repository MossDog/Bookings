import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>HomePage</div>
    </ProtectedRoute>
  )
}
