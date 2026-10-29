import type { ReactNode } from "react";
import AuthHeader from "./AuthHeader";

type AuthLayoutProps = {
  // 헤더 바로 아래에 붙는 영역 (비밀번호 찾기의 단계 표시줄 등)
  top?: ReactNode;
  children: ReactNode;
};

// 로그인 / 회원가입 / 비밀번호 찾기 공통 틀: 맨 위 헤더 + 가운데 내용
export default function AuthLayout({ top, children }: AuthLayoutProps) {
  return (
    <div className="min-h-svh bg-[#FBF5EE]">
      <div className="mx-auto flex min-h-svh max-w-[384px] flex-col px-[min(1.25rem,20px)] py-[min(2rem,32px)]">
        <AuthHeader />
        {top && <div className="pt-[min(1.75rem,28px)]">{top}</div>}
        <main className="flex flex-1 flex-col justify-center pt-[min(1.5rem,24px)] pb-[min(3rem,48px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
