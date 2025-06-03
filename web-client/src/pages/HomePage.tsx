import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import ImageUpload from '../components/ImageUpload'
import GalleryWidget from '../components/widgets/Gallery/GalleryWidget'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>HomePage</div>
      <GalleryWidget />
    </ProtectedRoute>
  )
}
