import type { ReactNode } from "react";
import AuthHeader from "./AuthHeader";

// 로그인 / 회원가입 / 비밀번호 찾기 공통 틀: 맨 위 헤더 + 가운데 내용
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-[#FBF5EE]">
      <div className="mx-auto flex min-h-svh max-w-[384px] flex-col px-[min(1.25rem,20px)] py-[min(2rem,32px)]">
        <AuthHeader />
        <main className="flex flex-1 flex-col justify-center pt-[min(1.5rem,24px)] pb-[min(3rem,48px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
