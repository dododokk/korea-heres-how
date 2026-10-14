import { useEffect, useState } from "react";
import background from "../../assets/splash/background.svg";
import logo from "../../assets/splash/logo.svg";

const SHOW_MS = 1500;
const FADE_MS = 500;

type SplashPageProps = {
  onFinish: () => void;
};

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

export default function SplashPage({ onFinish }: SplashPageProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), SHOW_MS);
    const finishTimer = setTimeout(onFinish, SHOW_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#2B2118] px-[min(1.5rem,24px)] transition-opacity ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <img
        src={background}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(43,33,24,0.45)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex size-[min(4rem,64px)] items-center justify-center rounded-[min(1.25rem,20px)] bg-[#F1E6D2]">
          <img
            src={logo}
            alt=""
            style={{ width: size(32), height: size(30) }}
          />
          <span className="absolute -top-[min(0.25rem,4px)] left-[min(3.375rem,54px)] size-[min(0.875rem,14px)] rounded-full border-2 border-[#E07A5F] bg-[#A9BBA0]" />
        </div>

        <h1 className="mt-[min(1.25rem,20px)] font-['Noto_Serif_KR',serif] text-[min(2.125rem,34px)] font-bold leading-[min(2.125rem,34px)] tracking-[-0.025em] text-[#F1E6D2]">
          여기서는?
        </h1>
        <p className="mt-[min(0.5rem,8px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] tracking-[0.16em] text-[rgba(241,230,210,0.75)]">
          Korea, Here's How
        </p>
      </div>
    </div>
  );
}
