import { useNavigate } from "react-router";
import aiIcon from "../../../assets/all/ai.svg";
import backIcon from "../../../assets/aichat/back.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

export default function ChatHeader() {
  const navigate = useNavigate();

  // 바로 전 화면으로 돌아간다. 주소를 직접 열어서 이전 화면이 없으면 지도 화면으로 보낸다.
  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/map", { replace: true });
  };

  return (
    <header className="shrink-0 border-b border-[rgba(43,33,24,0.06)] bg-[rgba(251,245,238,0.9)] backdrop-blur-[4px]">
      <div className="flex items-center gap-[min(0.75rem,12px)] px-[min(1rem,16px)] py-[min(0.75rem,12px)]">
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로 가기"
          className="flex size-[min(2.25rem,36px)] items-center justify-center rounded-full"
        >
          <img src={backIcon} alt="" style={{ width: size(19), height: size(18) }} />
        </button>
        <span className="flex size-[min(2.5rem,40px)] items-center justify-center rounded-[min(0.875rem,14px)] bg-[#E07A5F]">
          <img src={aiIcon} alt="" style={{ width: size(19), height: size(18) }} />
        </span>
        <div>
          <h1 className="font-['Fraunces','Noto_Serif_KR',serif] text-[min(0.96875rem,15.5px)] font-semibold leading-[min(1.2109rem,19.375px)] text-[#2B2118]">
            AI 여행 도우미
          </h1>
          <p className="font-['Roboto',sans-serif] text-[min(0.625rem,10px)] leading-[min(0.78125rem,12.5px)] text-[rgba(43,33,24,0.45)]">
            AI travel guide
          </p>
        </div>
      </div>
    </header>
  );
}
