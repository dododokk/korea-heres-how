import BottomSheet from './components/BottomSheet'
import Header from './components/header'
import KakaoMap from './components/KakaoMap'

export default function MapPage() {
  return (
    // 화면 높이에서 하단 Nav(App의 main 아래 여백)만큼 뺀 높이를 헤더 + 지도가 나눠 쓴다.
    <div className="flex h-[calc(100svh-min(3.8125rem,61px)-env(safe-area-inset-bottom))] flex-col">
      <Header />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <KakaoMap />
        <BottomSheet />
      </div>
    </div>
  )
}
