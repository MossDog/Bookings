import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import ImageUpload from '../components/ImageUpload'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>HomePage</div>
      <ImageUpload path="Folder/Fart/Smell"/>
    </ProtectedRoute>
  )
}
