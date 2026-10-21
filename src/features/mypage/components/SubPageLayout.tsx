import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import back from "../../../assets/mypage/back.svg";
import AiButton from "../../../components/AiButton";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type SubPageLayoutProps = {
  icon: string;
  title: string;
  sub: string;
  children: ReactNode;
};

// 마이페이지에서 들어가는 세부 화면(즐겨찾기, 스캔한 안내문, 오프라인 표현 보관함) 공통 틀.
// 뒤로가기 버튼은 항상 마이페이지로 돌아간다. (주소로 바로 들어온 경우에도 앱 밖으로 나가지 않게)
export default function SubPageLayout({ icon, title, sub, children }: SubPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="px-[min(1rem,16px)] pt-[min(1.5rem,24px)] pb-[min(5rem,80px)] font-['Roboto',sans-serif]">
      <header className="flex items-center gap-[min(0.75rem,12px)]">
        <button
          type="button"
          onClick={() => navigate("/mypage")}
          aria-label="마이페이지로 돌아가기"
          className="flex size-[min(2.25rem,36px)] shrink-0 items-center justify-center rounded-full border border-[rgba(43,33,24,0.1)] bg-white"
        >
          <img src={back} alt="" style={{ width: size(19), height: size(18) }} />
        </button>
        <div className="min-w-0">
          <h1 className="flex items-center gap-[min(0.5rem,8px)] text-[min(1.25rem,20px)] leading-[min(1.5625rem,25px)] font-semibold tracking-[-0.025em] text-[#2B2118]">
            <img src={icon} alt="" style={{ width: size(18), height: size(17) }} />
            {title}
          </h1>
          <p className="text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.45)]">{sub}</p>
        </div>
      </header>

      {children}

      {/* 하단 Nav 위 오른쪽에 떠 있는 AI 버튼 */}
      <div className="fixed right-[min(1rem,16px)] bottom-[calc(min(3.8125rem,61px)+min(1.1875rem,19px)+env(safe-area-inset-bottom))] z-40">
        <AiButton />
      </div>
    </div>
  );
}
