import { useCallback, useState } from 'react'
import AppRouter from './app/AppRouter'
import Nav from './components/Nav'
import SplashPage from './features/splash/SplashPage'

function App() {
  // 사이트를 처음 열었을 때만 스플래시를 보여준다.
  const [showSplash, setShowSplash] = useState(true)
  const hideSplash = useCallback(() => setShowSplash(false), [])

  return (
    <>
      {showSplash && <SplashPage onFinish={hideSplash} />}
      {/* 하단 고정 Nav에 콘텐츠가 가려지지 않도록 Nav 높이만큼 여백을 둔다. */}
      <main className="pb-[calc(min(3.8125rem,61px)+env(safe-area-inset-bottom))]">
        <AppRouter />
      </main>
      <Nav />
    </>
  )
}

export default App
