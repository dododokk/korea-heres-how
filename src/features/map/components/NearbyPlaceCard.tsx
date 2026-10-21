import type { Place } from "../../../api/places";
import arrowOrange from "../../../assets/map/arrow-orange.svg";
import PlaceStatus from "../../../components/PlaceStatus";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type NearbyPlaceCardProps = {
  place: Place;
  distanceText?: string; // "2.1 km · 도보 27분"
  onClick: () => void; // 카드를 누르면 마커 선택
  onGuideClick: () => void; // 오른쪽 아래 화살표를 누르면 관광지 상세로
};

// 지도 바텀시트 중간 단계에서 옆으로 넘겨 보는 장소 카드. 사진은 아직 회색 칸.
export default function NearbyPlaceCard({ place, distanceText, onClick, onGuideClick }: NearbyPlaceCardProps) {
  return (
    // 안에 화살표 버튼이 있어서 카드는 button 대신 div에 버튼 역할을 준다.
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex w-[min(14.25rem,228px)] cursor-pointer shrink-0 snap-start flex-col overflow-hidden rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.07)] bg-white text-left font-['Roboto',sans-serif]"
    >
      <div className="relative h-[min(7rem,112px)] w-full bg-[#E2E2E2]">
        {place.imageUrl && <img src={place.imageUrl} alt="" className="size-full object-cover" />}
        <PlaceStatus
          status={place.status}
          busy={place.busy}
          className="absolute top-[min(0.5rem,8px)] left-[min(0.5rem,8px)] max-w-[calc(100%-min(4.5rem,72px))] text-[min(0.59375rem,9.5px)] leading-[min(0.890625rem,14.25px)] text-[#2B2118]"
        />
        <span className="absolute top-[min(0.5rem,8px)] right-[min(0.5rem,8px)] rounded-full bg-[rgba(251,246,234,0.9)] px-[min(0.5rem,8px)] py-[min(0.125rem,2px)] text-[min(0.59375rem,9.5px)] leading-[min(0.890625rem,14.25px)] text-[#2B2118]">
          {place.category}
        </span>
      </div>

      <div className="w-full p-[min(0.75rem,12px)]">
        <p className="truncate text-[min(0.875rem,14px)] leading-[min(1.203125rem,19.25px)] font-semibold text-[#2B2118]">
          {place.title}
        </p>
        <p className="truncate pt-[min(0.125rem,2px)] text-[min(0.65625rem,10.5px)] leading-[min(0.984375rem,15.75px)] text-[rgba(43,33,24,0.45)]">
          {place.titleEn}
        </p>
        <div className="mt-[min(0.5rem,8px)] flex h-[min(1.40625rem,22.5px)] items-center justify-between gap-[min(0.5rem,8px)]">
          <span className="truncate text-[min(0.65625rem,10.5px)] leading-[min(0.984375rem,15.75px)] text-[rgba(43,33,24,0.45)]">
            {distanceText}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGuideClick();
            }}
            aria-label={`${place.title} 가이드 보기`}
            className="flex shrink-0 items-center justify-center"
          >
            <img src={arrowOrange} alt="" style={{ width: size(16), height: size(15) }} />
          </button>
        </div>
      </div>
    </div>
  );
}
