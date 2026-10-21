import arrowOrange from "../assets/map/arrow-orange.svg";
import know from "../assets/map/know.svg";
import PlaceStatus from "./PlaceStatus";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type PlaceListCardProps = {
  title: string;
  titleEn: string;
  category: string;
  subcategory: string;
  status: string;
  busy: boolean;
  tip: string;
  imageUrl?: string;
  distanceText?: string; // 2.1 km (내 위치를 모르면 없음)
  walkText?: string; // 도보 27분 (내 위치를 모르면 없음)
  onClick?: () => void;
};

// 장소 세로 목록 카드 (주변 장소 바텀시트 최대 단계 등 여러 화면에서 같이 쓴다).
// 사진 + 이름/영문 이름/거리 + 분류·도보 시간 + Know before you go + "여기서는? 가이드".
// "여기서는? 가이드"는 상세 화면이 생기면 연결한다. 지금은 카드 전체가 onClick 하나로 동작한다.
export default function PlaceListCard({
  title,
  titleEn,
  category,
  subcategory,
  status,
  busy,
  tip,
  imageUrl,
  distanceText,
  walkText,
  onClick,
}: PlaceListCardProps) {
  const meta = [category, subcategory, walkText].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-[min(0.875rem,14px)] rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.07)] bg-white p-[min(0.75rem,12px)] text-left font-['Roboto',sans-serif]"
    >
      <div className="relative h-[min(8.5rem,136px)] w-[min(6.75rem,108px)] shrink-0 overflow-hidden rounded-[min(0.75rem,12px)] bg-[#E2E2E2]">
        {imageUrl && <img src={imageUrl} alt="" className="size-full object-cover" />}
        <PlaceStatus
          status={status}
          busy={busy}
          className="absolute top-[min(0.5rem,8px)] left-[min(0.5rem,8px)] text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] text-[#2B2118]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-[min(0.125rem,2px)]">
        <div className="flex items-start justify-between gap-[min(0.5rem,8px)]">
          <div className="min-w-0">
            <p className="truncate text-[min(0.96875rem,15.5px)] leading-[min(1.33rem,21.3125px)] font-semibold text-[#2B2118]">
              {title}
            </p>
            <p className="truncate pt-[min(0.125rem,2px)] text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(43,33,24,0.45)]">
              {titleEn}
            </p>
          </div>
          {distanceText && (
            <span className="shrink-0 text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.55)]">
              {distanceText}
            </span>
          )}
        </div>

        <p className="truncate pt-[min(0.25rem,4px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
          {meta}
        </p>

        <div className="mt-[min(0.625rem,10px)] border-l-2 border-[rgba(224,122,95,0.35)] pl-[min(0.625rem,10px)]">
          <p className="flex items-center gap-[min(0.25rem,4px)] text-[min(0.59375rem,9.5px)] leading-[min(0.890625rem,14.25px)] font-medium tracking-[0.12em] text-[rgba(224,122,95,0.8)]">
            <img src={know} alt="" style={{ width: size(10), height: size(10) }} />
            Know before you go
          </p>
          <p className="line-clamp-2 pt-[min(0.125rem,2px)] text-[min(0.75rem,12px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.65)]">
            {tip}
          </p>
        </div>

        <span className="flex items-center justify-end gap-[min(0.25rem,4px)] pt-[min(0.75rem,12px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] font-medium text-[#E07A5F]">
          여기서는? 가이드
          <img src={arrowOrange} alt="" style={{ width: size(13), height: size(12) }} />
        </span>
      </div>
    </button>
  );
}
