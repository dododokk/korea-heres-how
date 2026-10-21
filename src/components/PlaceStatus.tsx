type PlaceStatusProps = {
  status: string;
  busy: boolean;
  className?: string;
};

// 장소 사진 위에 얹는 운영 상태 알약. 혼잡하면 주황 점, 아니면 초록 점.
export default function PlaceStatus({ status, busy, className = "" }: PlaceStatusProps) {
  return (
    <span
      className={`flex max-w-[calc(100%-min(1rem,16px))] items-center gap-[min(0.25rem,4px)] rounded-full bg-[rgba(251,246,234,0.9)] px-[min(0.5rem,8px)] py-[min(0.125rem,2px)] ${className}`}
    >
      <span
        className={`size-[min(0.375rem,6px)] shrink-0 rounded-full ${busy ? "bg-[#E07A5F]" : "bg-[#A9BBA0]"}`}
      />
      <span className="truncate">{status}</span>
    </span>
  );
}
