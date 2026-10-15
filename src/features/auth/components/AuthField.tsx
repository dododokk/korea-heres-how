import type { ReactNode } from "react";
import notice from "../../../assets/auth/notice.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type AuthFieldProps = {
  label: string;
  error?: string;
  // input과 그 위에 겹쳐 둘 버튼(비밀번호 보기 등)
  children: ReactNode;
};

// "이메일 · Email" 같은 라벨 + 입력칸 + 오류 문구 묶음
export default function AuthField({ label, error, children }: AuthFieldProps) {
  return (
    <label className="block font-['Roboto',sans-serif]">
      <span className="block text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] font-medium text-[rgba(43,33,24,0.85)]">
        {label}
      </span>
      <div className="relative pt-[min(0.375rem,6px)]">{children}</div>
      {error && (
        <span className="flex items-center gap-[min(0.25rem,4px)] pt-[min(0.375rem,6px)]">
          <img src={notice} alt="" style={{ width: size(14), height: size(13) }} />
          <span className="text-[min(0.75rem,12px)] leading-[min(1.03125rem,16.5px)] font-medium text-[#B4453A]">
            {error}
          </span>
        </span>
      )}
    </label>
  );
}
