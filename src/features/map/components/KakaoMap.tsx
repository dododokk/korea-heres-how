import { useState } from "react";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { type LatLng, useMyLocation } from "./useMyLocation";

const DEFAULT_LEVEL = 2;

export default function KakaoMap() {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
  });
  const myLocation = useMyLocation();

  // 앱 진입 시 처음 받은 위치(또는 기본 위치)로 한 번만 지도를 옮긴다.
  // 이후에는 위치가 바뀌어도 지도는 그대로 두고 파란 점만 움직인다. (따라가기 모드는 현재 위치 버튼 구현 때 추가)
  const [center, setCenter] = useState<LatLng | null>(null);
  if (center === null && myLocation.status !== "loading") {
    setCenter(myLocation.position);
  }

  if (error) {
    return <MapMessage>지도를 불러오지 못했어요.</MapMessage>;
  }
  if (loading || center === null) {
    return <MapMessage>지도를 불러오는 중이에요…</MapMessage>;
  }

  return (
    <Map center={center} level={DEFAULT_LEVEL} className="size-full">
      {myLocation.status === "success" && (
        <CustomOverlayMap
          position={myLocation.position}
          xAnchor={0.5}
          yAnchor={0.5}
          zIndex={10}
        >
          <MyLocationDot />
        </CustomOverlayMap>
      )}
    </Map>
  );
}

function MyLocationDot() {
  return (
    <span
      className="relative flex size-[22px] items-center justify-center"
      aria-label="내 위치"
    >
      <span className="absolute inset-0 rounded-full bg-[#3B82F6]/25" />
      <span className="relative size-[14px] rounded-full border-[2.5px] border-white bg-[#3B82F6] shadow-[0_1px_4px_rgba(0,0,0,0.3)]" />
    </span>
  );
}

function MapMessage({ children }: { children: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-[#ECE3D2] text-[min(0.8125rem,13px)] text-[rgba(43,33,24,0.55)]">
      {children}
    </div>
  );
}
