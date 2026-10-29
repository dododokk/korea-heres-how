import { useState } from "react";
import done from "../../../assets/auth/done.svg";
import { primaryButtonClassName } from "./authStyles";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const LANGUAGES = [
  { id: "en", badge: "EN", label: "English", sub: "English guide" },
  { id: "ko", badge: "한", label: "한국어", sub: "한국어 안내" },
] as const;

type LanguageId = (typeof LANGUAGES)[number]["id"];

// 회원가입을 마친 뒤 안내 언어 고르기. 지금은 고르기만 하고 저장·번역은 나중에 한다.
export default function LanguageStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<LanguageId>("en");

  return (
    <div className="rounded-[min(1.125rem,18px)] border border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.95)] p-[min(1.3125rem,21px)] text-center font-['Roboto',sans-serif]">
      <h1 className="text-[min(1.4375rem,23px)] leading-[min(1.796875rem,28.75px)] font-bold tracking-[-0.025em] text-[#2B2118]">
        어떤 언어로 안내해드릴까요?
      </h1>
      <p className="pt-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.7)]">
        Choose your guide language
      </p>

      <div role="radiogroup" aria-label="안내 언어" className="flex flex-col gap-[min(0.75rem,12px)] pt-[min(1.25rem,20px)]">
        {LANGUAGES.map((lang) => {
          const active = lang.id === selected;
          return (
            <button
              key={lang.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(lang.id)}
              className={`flex h-[min(4.25rem,68px)] items-center gap-[min(0.75rem,12px)] rounded-[min(0.875rem,14px)] border-2 px-[min(1.125rem,18px)] text-left ${
                active
                  ? "border-[#E07A5F] bg-white shadow-[0_0_0_2px_rgba(224,122,95,0.25)]"
                  : "border-[rgba(43,33,24,0.1)] bg-[rgba(255,255,255,0.6)]"
              }`}
            >
              <span
                className={`flex size-[min(2.25rem,36px)] shrink-0 items-center justify-center rounded-full text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-semibold ${
                  active ? "bg-[#E07A5F] text-[#F1E6D2]" : "bg-[#F1E6D2] text-[rgba(43,33,24,0.6)]"
                }`}
              >
                {lang.badge}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className={`text-[min(0.9375rem,15px)] leading-[min(1.171875rem,18.75px)] ${
                    active ? "font-semibold text-[#2B2118]" : "font-medium text-[rgba(43,33,24,0.8)]"
                  }`}
                >
                  {lang.label}
                </span>
                <span className="text-[min(0.6875rem,11px)] leading-[min(0.859375rem,13.75px)] text-[rgba(43,33,24,0.55)]">
                  {lang.sub}
                </span>
              </span>
              <span
                className={`flex size-[min(1.5rem,24px)] shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-[#E07A5F] bg-[#E07A5F]" : "border-[rgba(43,33,24,0.2)]"
                }`}
              >
                {active && <img src={done} alt="" style={{ width: size(15), height: size(14) }} />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="pt-[min(1rem,16px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.7)]">
        언제든 마이페이지에서 바꿀 수 있어요.
      </p>
      <div className="pt-[min(1.25rem,20px)]">
        <button type="button" onClick={onNext} className={primaryButtonClassName}>
          다음
        </button>
      </div>
    </div>
  );
}
