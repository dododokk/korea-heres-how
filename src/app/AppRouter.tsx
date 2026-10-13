import { Route, Routes } from 'react-router'
import MapPage from '../features/map/MapPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/map" element={<MapPage />} />
    </Routes>
  )
}
