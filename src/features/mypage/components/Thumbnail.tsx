// 카드 왼쪽 44px 사진. 사진이 없으면 회색 기본 칸으로 자리만 잡는다.
export default function Thumbnail({ src }: { src?: string }) {
  return (
    <span className="block size-[min(2.75rem,44px)] shrink-0 overflow-hidden rounded-[min(0.375rem,6px)] bg-[#E2E2E2]">
      {src && <img src={src} alt="" className="size-full object-cover" />}
    </span>
  );
}
