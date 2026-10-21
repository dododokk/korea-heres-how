import { Navigate, Route, Routes } from 'react-router'
import AiChatPage from '../features/aichat/AiChatPage'
import AroundPage from '../features/around/AroundPage'
import FindPasswordPage from '../features/auth/FindPasswordPage'
import LoginPage from '../features/auth/LoginPage'
import SignupPage from '../features/auth/SignupPage'
import MapPage from '../features/map/MapPage'
import FavoritesPage from '../features/mypage/FavoritesPage'
import MyPage from '../features/mypage/MyPage'
import PhrasebookPage from '../features/mypage/PhrasebookPage'
import ScannedSignsPage from '../features/mypage/ScannedSignsPage'
import ScanPage from '../features/scan/ScanPage'
import RequireAuth from './RequireAuth'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />

      {/* 여기 안의 화면은 로그인해야 들어갈 수 있다. */}
      <Route element={<RequireAuth />}>
        <Route path="/map" element={<MapPage />} />
        <Route path="/list" element={<AroundPage />} />
        <Route path="/aichat" element={<AiChatPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/favorites" element={<FavoritesPage />} />
        <Route path="/mypage/scans" element={<ScannedSignsPage />} />
        <Route path="/mypage/phrasebook" element={<PhrasebookPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/map" replace />} />
    </Routes>
  )
}
