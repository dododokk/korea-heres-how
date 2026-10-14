import { useState } from "react";
import languageIcon from "../../../assets/map/language.svg";
import logo from "../../../assets/map/logo.svg";

export type Language = "EN" | "KOR";

const CATEGORIES = ["전체", "관광지", "음식점", "시장", "카페"] as const;
export type Category = (typeof CATEGORIES)[number];

type HeaderProps = {
  onLanguageChange?: (language: Language) => void;
  onCategoryChange?: (category: Category) => void;
};

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

export default function Header({
  onLanguageChange,
  onCategoryChange,
}: HeaderProps) {
  const [language, setLanguage] = useState<Language>("EN");
  const [category, setCategory] = useState<Category>("전체");

  const toggleLanguage = () => {
    const next = language === "EN" ? "KOR" : "EN";
    setLanguage(next);
    onLanguageChange?.(next);
  };

  const selectCategory = (next: Category) => {
    setCategory(next);
    onCategoryChange?.(next);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(43,33,24,0.06)] bg-[#FBF5EE] px-[min(1rem,16px)] pt-[min(0.875rem,14px)]">
      <div className="flex h-[min(2.25rem,36px)] items-center justify-between">
        <div className="flex items-center gap-[min(0.5rem,8px)]">
          <div className="relative flex size-[min(2.25rem,36px)] items-center justify-center rounded-[min(0.6875rem,11px)] bg-[#E07A5F]">
            <img
              src={logo}
              alt=""
              style={{ width: size(18), height: size(17) }}
            />
            <span className="absolute -top-[min(0.125rem,2px)] left-[min(1.75rem,28px)] size-[min(0.625rem,10px)] rounded-full border-2 border-[#FBF6EA] bg-[#A9BBA0]" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-['Fraunces',serif] text-[min(1rem,16px)] font-semibold leading-[min(1.25rem,20px)] tracking-[-0.025em] text-[#2B2118]">
              여기서는?
            </h1>
            <p className="font-['Roboto',sans-serif] text-[min(0.5625rem,9px)] leading-[min(0.703rem,11.25px)] tracking-[0.14em] text-[rgba(43,33,24,0.55)]">
              Korea, Here's How
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={language === "EN" ? "한국어로 변경" : "Switch to English"}
          className="flex h-[min(2rem,32px)] items-center gap-[min(0.375rem,6px)] rounded-full border border-[rgba(43,33,24,0.15)] bg-[rgba(43,33,24,0.05)] px-[min(0.8125rem,13px)] font-['Roboto',sans-serif] text-[min(0.75rem,12px)] font-medium leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.7)]"
        >
          <img
            src={languageIcon}
            alt=""
            style={{ width: size(15), height: size(14) }}
          />
          {language}
        </button>
      </div>

      <nav className="mt-[min(0.875rem,14px)] flex gap-[min(1.25rem,20px)] overflow-x-auto">
        {CATEGORIES.map((item) => {
          const isActive = item === category;
          return (
            <button
              key={item}
              type="button"
              onClick={() => selectCategory(item)}
              aria-pressed={isActive}
              className={`relative shrink-0 pb-[min(0.625rem,10px)] font-['Roboto',sans-serif] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] ${
                isActive
                  ? "font-semibold text-[#2B2118]"
                  : "font-normal text-[rgba(43,33,24,0.55)]"
              }`}
            >
              {item}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#E07A5F]" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
