import { useEffect, useState } from 'react'

export type LatLng = { lat: number; lng: number }

// 위치 권한이 없거나 실패했을 때 쓰는 기본 위치 (종로구 중심, 종로구청 부근)
export const DEFAULT_LOCATION: LatLng = { lat: 37.5735, lng: 126.979 }

// 이전 위치와 이 거리(m) 미만으로 차이 나면 좌표 떨림으로 보고 무시한다.
const MIN_MOVE_M = 5

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 5000,
  timeout: 10000,
}

// 두 좌표 사이 거리(m) — 하버사인 공식
export function distanceM(a: LatLng, b: LatLng) {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

type MyLocationState =
  | { status: 'loading' }
  | { status: 'success'; position: LatLng }
  | { status: 'fallback'; position: LatLng }

// 내 위치를 실시간으로 추적한다. 실패하면 기본 위치(종로구)를 돌려준다.
export function useMyLocation(): MyLocationState {
  const [state, setState] = useState<MyLocationState>(() =>
    'geolocation' in navigator ? { status: 'loading' } : { status: 'fallback', position: DEFAULT_LOCATION },
  )

  useEffect(() => {
    if (!('geolocation' in navigator)) return

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const next = { lat: coords.latitude, lng: coords.longitude }
        setState((prev) =>
          prev.status === 'success' && distanceM(prev.position, next) < MIN_MOVE_M
            ? prev
            : { status: 'success', position: next },
        )
      },
      () => {
        // 이미 위치를 한 번 받은 뒤의 일시적인 실패는 마지막 위치를 유지한다.
        setState((prev) => (prev.status === 'success' ? prev : { status: 'fallback', position: DEFAULT_LOCATION }))
      },
      WATCH_OPTIONS,
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}
