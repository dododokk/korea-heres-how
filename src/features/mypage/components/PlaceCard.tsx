import type { FavoritePlace } from "../../../api/mypage";
import arrow from "../../../assets/mypage/arrow-g.svg";
import Thumbnail from "./Thumbnail";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 즐겨찾기한 장소 카드 한 개. 누르면 상세로 가는 건 나중에 연결한다.
export default function PlaceCard({ place }: { place: FavoritePlace }) {
  const meta = [
    place.category,
    place.distanceM !== undefined && `${(place.distanceM / 1000).toFixed(1)} km`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      className="flex w-full items-center gap-[min(0.75rem,12px)] rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.05)] bg-white px-[min(0.8125rem,13px)] py-[min(0.6875rem,11px)] text-left font-['Roboto',sans-serif]"
    >
      <Thumbnail src={place.imageUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[min(0.875rem,14px)] leading-[min(1.3125rem,21px)] font-semibold text-[#2B2118]">
          {place.name}
        </p>
        <p className="truncate text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(43,33,24,0.45)]">
          {place.nameEn}
        </p>
        <p className="truncate pt-[min(0.125rem,2px)] text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(43,33,24,0.55)]">
          {meta}
        </p>
      </div>
      <img src={arrow} alt="" className="shrink-0" style={{ width: size(19), height: size(18) }} />
    </button>
  );
}
