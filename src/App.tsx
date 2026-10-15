import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import AppRouter from './app/AppRouter'
import { AUTH_PATHS } from './app/paths'
import Nav from './components/Nav'
import SplashPage from './features/splash/SplashPage'

// 이 탭에서 스플래시를 이미 봤는지. 새로고침하면 유지되고, 탭을 새로 열면 지워진다.
const SPLASH_SEEN_KEY = 'splashSeen'

function hasSeenSplash() {
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // 사이트를 처음 열었을 때만 스플래시를 보여주고, 끝나면 무조건 로그인 화면으로 보낸다.
  // 새로고침했을 때는 스플래시 없이 원래 있던 화면을 그대로 보여준다.
  const [showSplash, setShowSplash] = useState(() => !hasSeenSplash())
  const hideSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
    } catch {
      // 저장이 막힌 환경에서는 새로고침할 때마다 스플래시가 다시 나온다.
    }
    setShowSplash(false)
    navigate('/login', { replace: true })
  }, [navigate])

  const isAuthPage = AUTH_PATHS.includes(pathname)

  return (
    <>
      {showSplash && <SplashPage onFinish={hideSplash} />}
      {isAuthPage ? (
        <AppRouter />
      ) : (
        <>
          {/* 하단 고정 Nav에 콘텐츠가 가려지지 않도록 Nav 높이만큼 여백을 둔다. */}
          <main className="pb-[calc(min(3.8125rem,61px)+env(safe-area-inset-bottom))]">
            <AppRouter />
          </main>
          <Nav />
        </>
      )}
    </>
  )
}

export default App
