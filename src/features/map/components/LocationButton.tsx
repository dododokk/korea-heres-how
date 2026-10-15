import locationIcon from "../../../assets/map/location.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type LocationButtonProps = {
  onClick: () => void;
};

// 지도를 내 위치로 다시 맞추는 흰색 버튼 (map 화면 전용)
export default function LocationButton({ onClick }: LocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="내 위치로 이동"
      className="flex size-[min(2.75rem,44px)] items-center justify-center rounded-full border border-[rgba(43,33,24,0.08)] bg-[rgba(251,245,238,0.95)] shadow-[0_4px_14px_rgba(43,33,24,0.1)]"
    >
      <img
        src={locationIcon}
        alt=""
        style={{ width: size(19), height: size(18) }}
      />
    </button>
  );
}
