
import ProtectedRoute from '../components/ProtectedRoute'
import GalleryWidget from '../components/widgets/Gallery/GalleryWidget'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>HomePage</div>
      <GalleryWidget />
    </ProtectedRoute>
  )
}
