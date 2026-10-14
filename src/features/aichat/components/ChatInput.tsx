import { type FormEvent, useState } from "react";
import sendOff from "../../../assets/aichat/send-off.svg";
import sendOn from "../../../assets/aichat/send-on.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type ChatInputProps = {
  onSend: (text: string) => void;
  // 답변 중에는 입력은 되지만 보내기만 막는다.
  sendDisabled: boolean;
};

export default function ChatInput({ onSend, sendDisabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const hasText = text.trim() !== "";
  const canSend = hasText && !sendDisabled;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="shrink-0 border-t border-[rgba(43,33,24,0.06)] bg-[rgba(251,245,238,0.95)] backdrop-blur-[4px]">
      <form onSubmit={handleSubmit} className="px-[min(1rem,16px)] py-[min(0.75rem,12px)]">
        <div className="flex h-[min(3.125rem,50px)] items-center gap-[min(0.5rem,8px)] rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.08)] bg-[rgba(241,230,210,0.45)] px-[min(0.5625rem,9px)] py-[min(0.4375rem,7px)]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="팁, 쟁반, 지하철, 카페 무엇이든 물어보세요"
            aria-label="질문 입력"
            className="min-w-0 flex-1 bg-transparent px-[min(0.5rem,8px)] font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.25rem,20px)] text-[#2B2118] outline-none placeholder:text-[rgba(43,33,24,0.4)]"
          />
          {/* 글씨가 있고 답변 중이 아닐 때만 진하게(보낼 수 있게) 바뀐다. */}
          <button
            type="submit"
            disabled={!canSend}
            aria-label="보내기"
            className={`flex size-[min(2.25rem,36px)] shrink-0 items-center justify-center rounded-[min(0.75rem,12px)] bg-[#E07A5F] disabled:cursor-default ${
              canSend ? "" : "opacity-40"
            }`}
          >
            <img
              src={canSend ? sendOn : sendOff}
              alt=""
              style={{ width: size(15), height: size(14) }}
            />
          </button>
        </div>
        <p className="pt-[min(0.5rem,8px)] text-center font-['Roboto',sans-serif] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
          데모 도우미 — 실제 AI 가이드가 답하는 방식의 예시예요.
        </p>
      </form>
    </div>
  );
}
