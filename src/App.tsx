import AppRouter from './app/AppRouter'
import Nav from './components/Nav'

function App() {
  return (
    <>
      {/* 하단 고정 Nav에 콘텐츠가 가려지지 않도록 Nav 높이만큼 여백을 둔다. */}
      <main className="pb-[calc(min(4.6875rem,75px)+env(safe-area-inset-bottom))]">
        <AppRouter />
      </main>
      <Nav />
    </>
  )
}

export default App
