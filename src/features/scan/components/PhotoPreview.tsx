import { useEffect, useRef } from "react";
import xIcon from "../../../assets/scan/x.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type PhotoPreviewProps = {
  file: File;
  onRemove: () => void;
};

// 고른 사진 미리보기. 오른쪽 위 X를 누르면 사진만 지운다.
export default function PhotoPreview({ file, onRemove }: PhotoPreviewProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  // 미리보기용 주소를 만들어 붙이고, 사진이 바뀌거나 화면을 나가면 해제한다.
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    if (imgRef.current) imgRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="relative h-[min(18.125rem,290px)] overflow-hidden rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-[rgba(43,33,24,0.05)]">
      <img ref={imgRef} alt="고른 안내문 사진" className="size-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="사진 지우기"
        className="absolute top-[min(0.75rem,12px)] right-[min(0.75rem,12px)] flex size-[min(2.25rem,36px)] items-center justify-center rounded-full bg-[rgba(43,33,24,0.55)]"
      >
        <img src={xIcon} alt="" style={{ width: size(19), height: size(18) }} />
      </button>
    </div>
  );
}
