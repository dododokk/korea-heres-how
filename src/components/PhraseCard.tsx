import { type ReactNode, useEffect, useRef, useState } from "react";
import { type Phrase, savePhrase, unsavePhrase } from "../api/phrases";
import bookmarkIcon from "../assets/scan/bookmark.svg";
import bookmarkFillIcon from "../assets/scan/bookmark-fill.svg";
import checkIcon from "../assets/scan/check.svg";
import copyIcon from "../assets/scan/copy.svg";
import showIcon from "../assets/scan/show.svg";
import soundIcon from "../assets/scan/soundg.svg";
import soundWhiteIcon from "../assets/scan/soundw.svg";
import ShowToStaff from "./ShowToStaff";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 복사 후 체크 아이콘을 보여주는 시간(ms)
const COPIED_MS = 2000;

// "이렇게 말해보세요" 한국어 표현 카드. 안내문 해석, 관광지 상세 등 여러 화면에서 같이 쓴다.
// 북마크: 저장/해제 토글 / 소리: 한국어로 읽어주기 / 복사: 한국어 문장 복사
// Show to staff: 화면 전체에 크게 띄워 직원에게 보여주기(ShowToStaff)
export default function PhraseCard({ phrase }: { phrase: Phrase }) {
  const [saved, setSaved] = useState(phrase.saved ?? false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showingStaff, setShowingStaff] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // 이 카드가 지금 읽고 있는 문장. 화면을 나갈 때 다른 카드 소리까지 끊지 않으려고 따로 들고 있는다.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 화면을 나가면 읽던 소리와 체크 타이머를 정리한다.
  useEffect(
    () => () => {
      clearTimeout(copiedTimer.current);
      if (utteranceRef.current) window.speechSynthesis?.cancel();
    },
    [],
  );

  // 누르자마자 바꾸고, 저장에 실패하면 원래대로 되돌린다.
  const toggleSaved = async () => {
    const next = !saved;
    setSaved(next);
    try {
      await (next ? savePhrase(phrase.id) : unsavePhrase(phrase.id));
    } catch (e) {
      console.error(e);
      setSaved(!next);
    }
  };

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    // 다른 카드가 읽고 있으면 멈추고 이 문장을 읽는다.
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.korean);
    utterance.lang = "ko-KR";
    // 다시 눌러서 이전 문장이 끊긴 경우에는 새로 읽는 중이니 끄지 않는다.
    const stop = () => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      setSpeaking(false);
    };
    utterance.onend = stop;
    utterance.onerror = stop;
    utteranceRef.current = utterance;
    setSpeaking(true);
    synth.speak(utterance);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.korean);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.1)] bg-white p-[min(0.75rem,12px)] font-['Roboto',sans-serif]">
      <div className="flex items-start justify-between gap-[min(0.5rem,8px)]">
        <div className="min-w-0 flex-1">
          <p className="text-[min(0.9375rem,15px)] leading-[min(1.2890625rem,20.625px)] font-medium text-[#2B2118]">
            {phrase.korean}
          </p>
          <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] tracking-[0.025em] text-[rgba(224,122,95,0.75)]">
            {phrase.romanization}
          </p>
          <p className="pt-[min(0.125rem,2px)] text-[min(0.75rem,12px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.55)]">
            {phrase.english}
          </p>
        </div>
        <div className="flex shrink-0 gap-[min(0.5rem,8px)]">
          <CircleButton
            active={saved}
            onClick={toggleSaved}
            label={saved ? "표현 저장 해제" : "표현 저장"}
            pressed={saved}
          >
            {saved ? (
              <img
                src={bookmarkFillIcon}
                alt=""
                style={{ width: size(15), height: size(14) }}
              />
            ) : (
              <img
                src={bookmarkIcon}
                alt=""
                style={{ width: size(11), height: size(13) }}
              />
            )}
          </CircleButton>
          <CircleButton active={speaking} onClick={speak} label="한국어로 듣기">
            <img
              src={speaking ? soundWhiteIcon : soundIcon}
              alt=""
              style={{ width: size(16), height: size(15) }}
            />
          </CircleButton>
        </div>
      </div>

      <div className="flex items-center gap-[min(0.5rem,8px)] pt-[min(0.625rem,10px)]">
        <button
          type="button"
          onClick={() => setShowingStaff(true)}
          className="flex h-[min(1.875rem,30px)] items-center gap-[min(0.375rem,6px)] rounded-full bg-[#E07A5F] px-[min(1rem,16px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] font-medium text-[#F1E6D2]"
        >
          <img
            src={showIcon}
            alt=""
            style={{ width: size(13), height: size(12) }}
          />
          Show to staff
        </button>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "복사됨" : "한국어 문장 복사"}
          className="flex size-[min(2rem,32px)] items-center justify-center rounded-full border border-[rgba(43,33,24,0.1)]"
        >
          <img
            src={copied ? checkIcon : copyIcon}
            alt=""
            style={{ width: size(15), height: size(14) }}
          />
        </button>
      </div>

      {showingStaff && <ShowToStaff phrase={phrase} onClose={() => setShowingStaff(false)} />}
    </div>
  );
}

// 오른쪽 위 동그란 버튼(북마크, 소리). 켜지면 주황 배경이 된다.
function CircleButton({
  active,
  onClick,
  label,
  pressed,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`flex size-[min(2rem,32px)] items-center justify-center rounded-full border ${
        active
          ? "border-[#E07A5F] bg-[#E07A5F]"
          : "border-[rgba(43,33,24,0.1)] bg-white"
      }`}
    >
      {children}
    </button>
  );
}
