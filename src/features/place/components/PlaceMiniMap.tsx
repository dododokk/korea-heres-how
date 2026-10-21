import { useEffect, useRef, useState } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { type Place, toLatLng } from "../../../api/places";
import PlaceMarker from "../../map/components/PlaceMarker";

const LEVEL = 3;

// 관광지 상세 "기본 정보" 아래 작은 지도. 장소를 가운데 두고 주황 마커 하나만 보여준다.
// 화면 스크롤을 방해하지 않게 끌기·확대는 막아 둔다.
export default function PlaceMiniMap({ place }: { place: Place }) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
  });
  const boxRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const { lat, lng } = toLatLng(place);

  // 카카오맵은 처음 크기를 기억해서, 화면 크기가 바뀌면 장소가 가운데에서 밀린다.
  // 지도 상자 크기가 바뀔 때마다 다시 배치(relayout)하고 장소를 가운데로 맞춘다.
  useEffect(() => {
    const box = boxRef.current;
    if (!map || !box) return;
    const recenter = () => {
      map.relayout();
      map.setCenter(new kakao.maps.LatLng(lat, lng));
    };
    recenter();
    const observer = new ResizeObserver(recenter);
    observer.observe(box);
    return () => observer.disconnect();
  }, [map, lat, lng]);

  return (
    <div
      ref={boxRef}
      className="h-[min(11.25rem,180px)] overflow-hidden rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-[#ECE3D2]"
    >
      {error ? (
        <p className="flex size-full items-center justify-center text-[min(0.8125rem,13px)] text-[rgba(43,33,24,0.55)]">
          지도를 불러오지 못했어요.
        </p>
      ) : loading ? null : (
        <Map
          center={{ lat, lng }}
          level={LEVEL}
          draggable={false}
          zoomable={false}
          disableDoubleClickZoom
          onCreate={setMap}
          className="size-full"
        >
          <PlaceMarker position={{ lat, lng }} name={place.title} selected showLabel={false} onClick={() => {}} />
        </Map>
      )}
    </div>
  );
}
