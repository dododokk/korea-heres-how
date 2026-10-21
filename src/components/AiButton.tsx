import { useNavigate } from "react-router";
import aiIcon from "../assets/all/ai.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type AiButtonProps = {
  // 화면마다 띄울 위치가 달라서, 위치 관련 클래스는 쓰는 쪽에서 넘긴다.
  className?: string;
};

// 여러 화면에 공통으로 떠 있는 AI 버튼. 누르면 AI 채팅 화면으로 이동한다.
export default function AiButton({ className = "" }: AiButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/aichat")}
      aria-label="AI에게 물어보기"
      className={`flex size-[min(3.5rem,56px)] items-center justify-center rounded-full bg-[#E07A5F] drop-shadow-[0_4px_6px_rgba(224,122,95,0.18)] ${className}`}
    >
      <img src={aiIcon} alt="" style={{ width: size(25), height: size(24) }} />
    </button>
  );
}
