import { useEffect, useRef, useState } from "react";
import select from "../../../assets/auth/select.svg";
import language from "../../../assets/map/language.svg";
import logo from "../../../assets/map/logo.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 지금은 한국어/영어만. 고르면 버튼 표시만 바뀌고 화면 글자 번역은 나중에 한다.
const LANGUAGES = ["한국어", "English"] as const;
type Language = (typeof LANGUAGES)[number];

// 로그인 / 회원가입 / 비밀번호 찾기 화면 맨 위 헤더 (로고 + 언어 선택)
export default function AuthHeader() {
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
    <header className="flex h-[min(2.5rem,40px)] items-center justify-between">
      <div className="flex items-center gap-[min(0.625rem,10px)]">
        <div className="relative flex size-[min(2.5rem,40px)] items-center justify-center rounded-[min(0.8125rem,13px)] bg-[#E07A5F]">
          <img src={logo} alt="" style={{ width: size(20), height: size(19) }} />
          <span className="absolute -top-[min(0.125rem,2px)] left-[min(2rem,32px)] size-[min(0.625rem,10px)] rounded-full border-2 border-[#FBF5EE] bg-[#A9BBA0]" />
        </div>
        <div>
          <p className="text-[min(1.0625rem,17px)] leading-[min(1.328rem,21.25px)] font-semibold tracking-[-0.025em] text-[#2B2118]">
            여기서는?
          </p>
          <p className="font-['Roboto',sans-serif] text-[min(0.65625rem,10.5px)] leading-[min(0.8203rem,13.125px)] tracking-[0.14em] text-[rgba(43,33,24,0.55)]">
            Korea, Here's How
          </p>
        </div>
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-[min(2.047rem,32.75px)] items-center gap-[min(0.375rem,6px)] rounded-full border border-[rgba(43,33,24,0.1)] bg-white px-[min(0.8125rem,13px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[#2B2118]"
        >
          <img src={language} alt="" style={{ width: size(13), height: size(12) }} />
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
    </header>
  );
}
