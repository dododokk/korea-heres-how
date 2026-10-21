import { useEffect } from "react";
import notice from "../assets/auth/notice.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const SHOW_MS = 3000;

type ErrorToastProps = {
  message: string;
  onClose: () => void;
  // 화면마다 띄울 높이가 달라서, 위치 클래스(top)는 쓰는 쪽에서 바꿀 수 있다.
  topClassName?: string;
};

// 화면 위쪽에 잠깐 떴다가 사라지는 오류 알림 (반투명 회색 배경 + 흰 글자/아이콘)
export default function ErrorToast({
  message,
  onClose,
  topClassName = "top-[calc(min(2rem,32px)+min(2.5rem,40px)+min(0.75rem,12px))]",
}: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, SHOW_MS);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      role="alert"
      className={`fixed inset-x-0 ${topClassName} z-50 flex justify-center px-[min(1.25rem,20px)]`}
    >
      <div className="flex items-center gap-[min(0.5rem,8px)] rounded-[min(0.75rem,12px)] bg-[rgba(43,43,43,0.75)] px-[min(1rem,16px)] py-[min(0.75rem,12px)] backdrop-blur-[4px]">
        <img
          src={notice}
          alt=""
          className="brightness-0 invert"
          style={{ width: size(14), height: size(13) }}
        />
        <p className="font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-medium text-white">
          {message}
        </p>
      </div>
    </div>
  );
}
