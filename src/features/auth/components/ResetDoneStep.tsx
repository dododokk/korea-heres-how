import open from "../../../assets/auth/open.svg";
import { descriptionClassName, primaryButtonClassName } from "./authStyles";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 비밀번호 찾기 완료 화면
export default function ResetDoneStep({ onDone }: { onDone: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-[min(4rem,64px)] items-center justify-center rounded-full bg-[#E07A5F]">
        <img src={open} alt="" style={{ width: size(32), height: size(30) }} />
      </div>
      <h1 className="pt-[min(1.25rem,20px)] text-[min(1.625rem,26px)] leading-[min(2.03125rem,32.5px)] font-bold tracking-[-0.025em] text-[#2B2118]">
        비밀번호가 변경되었어요
      </h1>
      <p className="pt-[min(0.25rem,4px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-medium text-[rgba(43,33,24,0.75)]">
        Password updated
      </p>
      <p className={`pt-[min(1rem,16px)] ${descriptionClassName}`}>
        새 비밀번호로 다시 로그인해주세요.
      </p>
      <div className="pt-[min(1.75rem,28px)]">
        <button type="button" onClick={onDone} className={primaryButtonClassName}>
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
