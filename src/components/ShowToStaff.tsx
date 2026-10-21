import { type MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Phrase } from "../api/phrases";
import soundWhiteIcon from "../assets/scan/soundw.svg";
import closeIcon from "../assets/scan/x-black.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type ShowToStaffProps = {
  phrase: Phrase;
  onClose: () => void;
};

// "Show to staff"를 누르면 화면 전체에 크게 띄워서 직원·상인에게 보여주는 화면.
// 카드 바깥(어두운 배경)이나 닫기 버튼을 누르면 닫힌다. 떠 있는 동안 휴대폰 화면이 꺼지지 않게 한다.
export default function ShowToStaff({ phrase, onClose }: ShowToStaffProps) {
  // 떠 있는 동안 뒤 화면이 같이 스크롤되지 않게 막는다.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 화면 꺼짐 막기 (Wake Lock API). 지원하지 않는 브라우저에서는 그냥 넘어간다.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    let closed = false;
    navigator.wakeLock
      ?.request("screen")
      .then((sentinel) => {
        // 요청이 끝나기 전에 닫혔으면 바로 풀어준다.
        if (closed) sentinel.release();
        else lock = sentinel;
      })
      .catch((e) => console.error(e));
    return () => {
      closed = true;
      lock?.release();
    };
  }, []);

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.korean);
    utterance.lang = "ko-KR";
    synth.speak(utterance);
  };

  // 뒤에 있는 다른 팝업까지 클릭이 전달되지 않게 막고 닫는다.
  const close = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // 다른 팝업(해석 결과 등) 위에도 항상 맨 위에 뜨도록 body에 바로 붙인다.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="직원에게 보여주기"
      onClick={close}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[rgba(43,33,24,0.92)] px-[min(1.5rem,24px)] text-center font-['Roboto',sans-serif]"
    >
      <p className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] tracking-[0.24em] text-[rgba(241,230,210,0.6)]">
        Show this to staff
      </p>
      <p className="pt-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(241,230,210,0.5)]">
        직원·상인에게 이 화면을 보여주세요
      </p>

      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-[min(1.5rem,24px)] w-full max-w-[672px] rounded-[min(0.875rem,14px)] bg-[#FBF6EA] px-[min(1.5rem,24px)] py-[min(2.5rem,40px)]"
      >
        <p className="text-[min(2rem,32px)] leading-[min(2.5rem,40px)] font-semibold break-keep text-[#2B2118]">
          {phrase.korean}
        </p>
        <p className="pt-[min(1rem,16px)] text-[min(0.9375rem,15px)] leading-[min(1.40625rem,22.5px)] tracking-[0.025em] text-[rgba(224,122,95,0.8)]">
          {phrase.romanization}
        </p>
        <p className="pt-[min(0.75rem,12px)] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.55)]">
          {phrase.english}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-[min(0.625rem,10px)] pt-[min(2rem,32px)]">
          <button
            type="button"
            onClick={speak}
            className="flex h-[min(2.515625rem,40.25px)] items-center gap-[min(0.5rem,8px)] rounded-full bg-[#E07A5F] px-[min(1.25rem,20px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[#F1E6D2]"
          >
            <img src={soundWhiteIcon} alt="" style={{ width: size(15), height: size(14) }} />
            발음 듣기
          </button>
          <button
            type="button"
            onClick={close}
            className="flex h-[min(2.640625rem,42.25px)] items-center gap-[min(0.5rem,8px)] rounded-full border border-[rgba(43,33,24,0.1)] bg-white px-[min(1.25rem,20px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[rgba(43,33,24,0.7)]"
          >
            <img src={closeIcon} alt="" style={{ width: size(15), height: size(14) }} />
            닫기
          </button>
        </div>
      </div>

      <p className="pt-[min(1.25rem,20px)] text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(241,230,210,0.4)]">
        화면을 누르면 닫혀요
      </p>
    </div>,
    document.body,
  );
}
