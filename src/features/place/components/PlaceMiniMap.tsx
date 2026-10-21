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
  const position = toLatLng(place);

  return (
    <div className="h-[min(11.25rem,180px)] overflow-hidden rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-[#ECE3D2]">
      {error ? (
        <p className="flex size-full items-center justify-center text-[min(0.8125rem,13px)] text-[rgba(43,33,24,0.55)]">
          지도를 불러오지 못했어요.
        </p>
      ) : loading ? null : (
        <Map
          center={position}
          level={LEVEL}
          draggable={false}
          zoomable={false}
          disableDoubleClickZoom
          className="size-full"
        >
          <PlaceMarker position={position} name={place.title} selected showLabel={false} onClick={() => {}} />
        </Map>
      )}
    </div>
  );
}
