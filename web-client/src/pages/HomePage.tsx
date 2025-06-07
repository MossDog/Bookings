
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import GalleryWidget from '../components/widgets/Gallery/GalleryWidget'

export default function HomePage() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
// Step 1: Navbar with conditional rendering of auth or profile
// 