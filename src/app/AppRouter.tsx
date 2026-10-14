import { Route, Routes } from 'react-router'
import AiChatPage from '../features/aichat/AiChatPage'
import MapPage from '../features/map/MapPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/map" element={<MapPage />} />
      <Route path="/aichat" element={<AiChatPage />} />
    </Routes>
  )
}
