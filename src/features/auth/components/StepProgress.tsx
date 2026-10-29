import back from "../../../assets/aichat/back.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type StepProgressProps = {
  step: number;
  total: number;
  onBack: () => void;
};

// 비밀번호 찾기 / 회원가입 맨 위 "뒤로 · Step n of N · 진행 바"
export default function StepProgress({ step, total, onBack }: StepProgressProps) {
  return (
    <div className="font-['Roboto',sans-serif]">
      <div className="flex h-[min(1.40625rem,22.5px)] items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.7)]"
        >
          <img src={back} alt="" style={{ width: size(16), height: size(15) }} />
          뒤로
        </button>
        <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.55)]">
          Step {step} of {total}
        </span>
      </div>
      <div className="flex gap-[min(0.375rem,6px)] pt-[min(0.5rem,8px)]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[min(0.375rem,6px)] flex-1 rounded-full ${
              i < step ? "bg-[#E07A5F]" : "bg-[rgba(43,33,24,0.15)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
