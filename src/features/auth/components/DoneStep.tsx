import { descriptionClassName, primaryButtonClassName } from "./authStyles";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type DoneStepProps = {
  // 주황 원 안에 넣을 32×30 아이콘
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  onDone: () => void;
};

// 비밀번호 변경 / 회원가입이 끝났을 때 보여주는 완료 화면
export default function DoneStep({
  icon,
  title,
  subtitle,
  description,
  buttonLabel,
  onDone,
}: DoneStepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-[min(4rem,64px)] items-center justify-center rounded-full bg-[#E07A5F]">
        <img src={icon} alt="" style={{ width: size(32), height: size(30) }} />
      </div>
      <h1 className="pt-[min(1.25rem,20px)] text-[min(1.625rem,26px)] leading-[min(2.03125rem,32.5px)] font-bold tracking-[-0.025em] text-[#2B2118]">
        {title}
      </h1>
      <p className="pt-[min(0.25rem,4px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-medium text-[rgba(43,33,24,0.75)]">
        {subtitle}
      </p>
      <p className={`pt-[min(1rem,16px)] ${descriptionClassName}`}>{description}</p>
      <div className="pt-[min(1.75rem,28px)]">
        <button type="button" onClick={onDone} className={primaryButtonClassName}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
