import { useState } from "react";
import {
  FEEDBACK_REASONS,
  type FeedbackReason,
  type FeedbackResult,
} from "../api/feedback";
import bad from "../assets/aichat/bad.svg";
import ck from "../assets/aichat/ck.svg";
import good from "../assets/aichat/good.svg";
import correct from "../assets/scan/correct.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const COMMENT_MAX = 500;

// idle: 처음 질문 / good: 도움됨 보냄 / form: 도움 안 됨 의견 작성 / bad: 의견 보냄
type Step = "idle" | "good" | "form" | "bad";

type FeedbackProps = {
  // 어디에 보낼지는 화면마다 달라서(AI 답변, 안내문 해석 …) 보내는 함수를 쓰는 쪽에서 넘긴다.
  onSend: (result: FeedbackResult) => Promise<void>;
  // chat: "도움이 되었나요?" 왼쪽 정렬 / scan: "ⓘ 정확했나요?" 가운데 정렬
  variant?: "chat" | "scan";
};

// "도움이 되었나요?" 피드백 영역. 도움 안 됨을 누르면 이유와 의견을 받는다.
export default function Feedback({ onSend, variant = "chat" }: FeedbackProps) {
  const [step, setStep] = useState<Step>("idle");
  const [reasons, setReasons] = useState<FeedbackReason[]>([]);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const sendHelpful = async () => {
    setStep("good");
    try {
      await onSend({ helpful: true });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleReason = (reason: FeedbackReason) => {
    setReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
  };

  // 취소하면 처음 상태로 돌아가고, 고른 이유와 의견도 비운다.
  const cancel = () => {
    setStep("idle");
    setReasons([]);
    setComment("");
  };

  // 이유를 1개 이상 골라야 보낼 수 있다.
  const canSubmit = reasons.length > 0 && !sending;

  const submit = async () => {
    if (!canSubmit) return;
    setSending(true);
    try {
      await onSend({
        helpful: false,
        reasons,
        comment: comment.trim() || undefined,
      });
      setStep("bad");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (step === "good") {
    return <Done>도움이 되었다니 다행이에요.</Done>;
  }

  if (step === "bad") {
    return <Done>감사합니다 — 여러분의 의견이 다른 여행자에게 도움이 됩니다.</Done>;
  }

  if (step === "form") {
    return (
      <div className="pt-[min(0.75rem,12px)]">
        <div className="rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.05)] bg-[rgba(241,230,210,0.5)] p-[min(0.9375rem,15px)]">
          <p className="text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-medium text-[rgba(43,33,24,0.75)]">
            어떤 점이 아쉬웠나요?
          </p>

          <div className="flex flex-wrap gap-[min(0.5rem,8px)] pt-[min(0.5rem,8px)]">
            {FEEDBACK_REASONS.map((reason) => {
              const selected = reasons.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  aria-pressed={selected}
                  className={`flex h-[min(2rem,32px)] items-center rounded-full border px-[min(0.8125rem,13px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] ${
                    selected
                      ? "border-[#E07A5F] bg-[#E07A5F] text-[#F1E6D2]"
                      : "border-[rgba(43,33,24,0.1)] bg-white text-[rgba(43,33,24,0.65)]"
                  }`}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          <div className="pt-[min(0.625rem,10px)]">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={COMMENT_MAX}
              placeholder="추가 의견이 있다면 적어주세요 (선택)"
              aria-label="추가 의견"
              className="block h-[min(3.46875rem,55.5px)] w-full resize-none rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white px-[min(0.8125rem,13px)] py-[min(0.5625rem,9px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[#2B2118] outline-none placeholder:text-[rgba(43,33,24,0.35)]"
            />
          </div>

          <div className="flex items-center justify-between pt-[min(0.5rem,8px)]">
            <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
              {comment.length}/{COMMENT_MAX}
            </span>
            <div className="flex items-center gap-[min(0.5rem,8px)]">
              <button
                type="button"
                onClick={cancel}
                className="px-[min(0.75rem,12px)] py-[min(0.375rem,6px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.5)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="rounded-full bg-[#E07A5F] px-[min(1rem,16px)] py-[min(0.375rem,6px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[#F1E6D2] disabled:cursor-default disabled:opacity-40"
              >
                의견 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "scan") {
    return (
      <div className="flex items-center justify-center gap-[min(0.75rem,12px)] pt-[min(1rem,16px)]">
        <span className="flex items-center gap-[min(0.25rem,4px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.45)]">
          <img src={correct} alt="" style={{ width: size(13), height: size(12) }} />
          정확했나요?
        </span>
        <ScanFeedbackButton icon={good} label="도움됨" onClick={sendHelpful} />
        <ScanFeedbackButton icon={bad} label="도움 안 됨" onClick={() => setStep("form")} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[min(0.75rem,12px)] pt-[min(0.75rem,12px)]">
      <div>
        <p className="text-[min(0.78125rem,12.5px)] leading-[min(0.9766rem,15.625px)] text-[rgba(43,33,24,0.55)]">
          도움이 되었나요?
        </p>
        <p className="text-[min(0.625rem,10px)] leading-[min(0.78125rem,12.5px)] text-[rgba(43,33,24,0.4)]">
          Was this helpful?
        </p>
      </div>
      <FeedbackButton icon={good} label="도움됨" onClick={sendHelpful} />
      <FeedbackButton icon={bad} label="도움 안 됨" onClick={() => setStep("form")} />
    </div>
  );
}

function Done({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-[min(0.375rem,6px)] pt-[min(0.75rem,12px)]">
      <span className="flex h-[min(1.125rem,18px)] w-[min(0.78125rem,12.5px)] shrink-0 items-center justify-center">
        <img src={ck} alt="" style={{ width: size(10), height: size(7) }} />
      </span>
      <p className="text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.5)]">
        {children}
      </p>
    </div>
  );
}

function FeedbackButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-[min(0.25rem,4px)] rounded-full border border-[rgba(43,33,24,0.1)] px-[min(0.6875rem,11px)] py-[min(0.3125rem,5px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.55)]"
    >
      {/* 아이콘 원본은 진한 색이라, 글자와 같은 흐린 정도로 맞춘다. */}
      <img
        src={icon}
        alt=""
        className="opacity-55"
        style={{ width: size(14), height: size(13) }}
      />
      {label}
    </button>
  );
}

// scan 모양 버튼: 테두리 알약 + 진한 글자
function ScanFeedbackButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[min(2rem,32px)] shrink-0 items-center gap-[min(0.25rem,4px)] rounded-full border border-[rgba(43,33,24,0.1)] px-[min(0.75rem,12px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[#2B2118]"
    >
      <img src={icon} alt="" style={{ width: size(12), height: size(11) }} />
      {label}
    </button>
  );
}
