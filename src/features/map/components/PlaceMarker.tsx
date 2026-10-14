import { CustomOverlayMap } from "react-kakao-maps-sdk";
import placeOrange from "../../../assets/map/place-orange.svg";
import placeWhite from "../../../assets/map/place-white.svg";
import { formatDistance, type LatLng } from "./useMyLocation";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type PlaceMarkerProps = {
  // 서버 좌표는 { lat: Number(mapy), lng: Number(mapx) }로 바꿔서 넘긴다. (mapy가 위도)
  position: LatLng;
  name: string;
  // 내 위치에서의 거리(m). 있으면 말풍선에 "2.1 km · 도보 27분"으로 보여준다.
  distanceM?: number;
  selected: boolean;
  onClick: () => void;
};

// 지도 위 장소 마커. 기본은 흰 원 + 주황 핀, 선택되면 더 큰 주황 원 + 흰 핀 + 위에 말풍선.
export default function PlaceMarker({
  position,
  name,
  distanceM,
  selected,
  onClick,
}: PlaceMarkerProps) {
  return (
    <CustomOverlayMap
      position={position}
      yAnchor={1}
      clickable
      // 선택된 마커가 다른 마커에 가려지지 않게 위로 올린다.
      zIndex={selected ? 5 : 1}
    >
      {/*
        카카오 오버레이는 처음 크기로 기준점을 잡아서, 내용 크기가 바뀌면 마커가 밀린다.
        그래서 바깥 상자는 선택 여부와 상관없이 큰 원(40px) 크기로 고정하고 원을 그 가운데에 둔다.
        말풍선은 absolute로 띄워서 상자 크기에 영향을 주지 않게 한다. → 흰색/주황색 원의 중심이 항상 같은 자리.
      */}
      <div className="relative flex size-[min(2.5rem,40px)] items-center justify-center">
        {selected && (
          <div className="absolute bottom-[calc(100%+min(0.25rem,4px))] left-1/2 -translate-x-1/2 rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-[#FBF6EA] px-[min(0.8125rem,13px)] py-[min(0.5625rem,9px)] whitespace-nowrap drop-shadow-[0_4px_7px_rgba(43,33,24,0.12)]">
            <p className="font-['Fraunces','Noto_Serif_KR',serif] text-[min(0.8125rem,13px)] font-semibold leading-[min(1.015625rem,16.25px)] text-[#2B2118]">
              {name}
            </p>
            {distanceM !== undefined && (
              <p className="mt-[min(0.125rem,2px)] font-['Roboto',sans-serif] text-[min(0.65625rem,10.5px)] leading-[min(0.984375rem,15.75px)] text-[rgba(43,33,24,0.55)]">
                {formatDistance(distanceM)}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClick}
          aria-label={name}
          aria-pressed={selected}
          className={
            selected
              ? "flex size-[min(2.5rem,40px)] items-center justify-center rounded-full border-2 border-[#FBF6EA] bg-[#E07A5F] drop-shadow-[0_3px_5px_rgba(43,33,24,0.14)]"
              : "flex size-[min(2rem,32px)] items-center justify-center rounded-full border-2 border-[#FBF6EA] bg-white/95 shadow-[0_3px_10px_rgba(43,33,24,0.14)]"
          }
        >
          {selected ? (
            <img
              src={placeWhite}
              alt=""
              style={{ width: size(14), height: size(17) }}
            />
          ) : (
            <img
              src={placeOrange}
              alt=""
              style={{ width: size(12), height: size(14) }}
            />
          )}
        </button>
      </div>
    </CustomOverlayMap>
  );
}
