import { useEffect, useRef, useState } from "react";
import select from "../assets/auth/select.svg";
import globe from "../assets/map/language.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 지금은 한국어/영어만. 고르면 버튼 표시만 바뀌고 화면 글자 번역은 나중에 한다.
const LANGUAGES = ["한국어", "English"] as const;
type Language = (typeof LANGUAGES)[number];

type LanguageSelectProps = {
  // 버튼 앞에 지구본 아이콘을 붙일지 (로그인 화면 헤더)
  showGlobe?: boolean;
  // 화면마다 다른 버튼 모양(배경·크기·글자)
  buttonClassName: string;
};

// 언어 선택 버튼 + 드롭다운 (로그인 화면 헤더, 마이페이지 앱 언어)
export default function LanguageSelect({ showGlobe = false, buttonClassName }: LanguageSelectProps) {
  const [lang, setLang] = useState<Language>("한국어");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 바깥을 누르면 닫는다.
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-[min(0.375rem,6px)] rounded-full border border-[rgba(43,33,24,0.1)] px-[min(0.8125rem,13px)] font-['Roboto',sans-serif] text-[#2B2118] ${buttonClassName}`}
      >
        {showGlobe && <img src={globe} alt="" style={{ width: size(13), height: size(12) }} />}
        {lang}
        <img src={select} alt="" style={{ width: size(13), height: size(12) }} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="언어 선택"
          className="absolute top-[calc(100%+min(0.5rem,8px))] right-0 z-30 w-[min(9rem,144px)] rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-white p-[min(0.4375rem,7px)]"
        >
          {LANGUAGES.map((item) => {
            const selected = item === lang;
            return (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLang(item);
                    setOpen(false);
                  }}
                  className={`flex h-[min(2.21875rem,35.5px)] w-full items-center rounded-[min(0.75rem,12px)] px-[min(0.75rem,12px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] ${
                    selected ? "bg-[#F1E6D2] text-[#2B2118]" : "text-[rgba(43,33,24,0.7)]"
                  }`}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
