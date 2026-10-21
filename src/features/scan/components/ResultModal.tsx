import { type ReactNode, useEffect } from "react";
import { type SignExplanation, sendScanFeedback } from "../../../api/scan";
import closeIcon from "../../../assets/scan/x-black.svg";
import Feedback from "../../../components/Feedback";
import PhraseCard from "../../../components/PhraseCard";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type ResultModalProps = {
  result: SignExplanation;
  onClose: () => void;
};

// "안내문 해석하기"를 누르면 scan 화면 위에 뜨는 해석 결과 팝업.
// X 버튼이나 어두운 배경을 누르면 닫힌다.
export default function ResultModal({ result, onClose }: ResultModalProps) {
  // 팝업이 떠 있는 동안 뒤 화면이 같이 스크롤되지 않게 막는다.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="안내문 해석 결과"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(43,33,24,0.5)] p-[min(1rem,16px)] font-['Roboto',sans-serif]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90svh] w-full max-w-[576px] flex-col overflow-hidden rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.06)] bg-[#FBF6EA]"
      >
        <div className="overflow-y-auto px-[min(1.25rem,20px)] py-[min(1rem,16px)]">
          <div className="bg-white">
            {/* 1. 이 안내문의 뜻 */}
            <Section>
              <div className="flex items-start gap-[min(0.625rem,10px)]">
                <Badge>1</Badge>
                <h3 className={`min-w-0 flex-1 ${TITLE_CLASS}`}>이 안내문의 뜻</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="닫기"
                  className="flex size-[min(2rem,32px)] shrink-0 items-center justify-center rounded-full border border-[rgba(43,33,24,0.1)] bg-white"
                >
                  <img src={closeIcon} alt="" style={{ width: size(15), height: size(14) }} />
                </button>
              </div>
              <div className="mt-[min(0.875rem,14px)] border-l-2 border-[rgba(224,122,95,0.35)] pl-[min(0.875rem,14px)]">
                <p className="font-['Fraunces',serif] text-[min(1.25rem,20px)] leading-[min(1.875rem,30px)] text-[#2B2118]">
                  {result.title}
                </p>
                <p className="pt-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.5)]">
                  {result.titleEn}
                </p>
              </div>
              <p className="pt-[min(0.75rem,12px)] text-[min(0.90625rem,14.5px)] leading-[min(1.47rem,23.563px)] text-[rgba(43,33,24,0.8)]">
                {result.meaning}
              </p>
              <p className="pt-[min(0.375rem,6px)] text-[min(0.78125rem,12.5px)] leading-[min(1.27rem,20.313px)] text-[rgba(43,33,24,0.45)]">
                {result.meaningEn}
              </p>
            </Section>

            {/* 2. 그래서 어떻게 해야 하나요? */}
            <Section className="bg-[rgba(224,122,95,0.06)]">
              <SectionTitle number={2} title="그래서 어떻게 해야 하나요?" sub="What should you do?" />
              <p className="pt-[min(0.75rem,12px)] text-[min(0.9375rem,15px)] leading-[min(1.5234375rem,24.375px)] font-medium text-[rgba(43,33,24,0.85)]">
                {result.action}
              </p>
            </Section>

            {/* 3. 이렇게 말해보세요 */}
            <Section>
              <SectionTitle number={3} title="이렇게 말해보세요" sub="Try saying this" />
              <div className="flex flex-col gap-[min(0.75rem,12px)] pt-[min(0.875rem,14px)]">
                {result.phrases.map((phrase) => (
                  <PhraseCard key={phrase.id} phrase={phrase} />
                ))}
              </div>
            </Section>

            {/* 이런 곳에서 볼 수 있어요 */}
            <div className="p-[min(1.25rem,20px)]">
              <p className="flex flex-wrap items-baseline gap-x-[min(0.375rem,6px)] tracking-[0.05em]">
                <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
                  이런 곳에서 볼 수 있어요
                </span>
                <span className="text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] text-[rgba(43,33,24,0.35)]">
                  Where you may see this
                </span>
              </p>
              <p className="pt-[min(0.25rem,4px)] text-[min(0.84375rem,13.5px)] leading-[min(1.16rem,18.563px)] text-[rgba(43,33,24,0.7)]">
                {result.whereSeen}
              </p>
            </div>
          </div>

          <Feedback
            variant="scan"
            onSend={(feedback) => sendScanFeedback({ scanId: result.id, ...feedback })}
          />
        </div>
      </div>
    </div>
  );
}

const TITLE_CLASS =
  "font-['Fraunces',serif] text-[min(1.0625rem,17px)] leading-[min(1.328125rem,21.25px)] font-bold tracking-[-0.025em] text-[#2B2118]";

function Section({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <section className={`border-b border-[rgba(43,33,24,0.05)] px-[min(1.25rem,20px)] pt-[min(1.25rem,20px)] pb-[min(1.25rem,20px)] ${className}`}>
      {children}
    </section>
  );
}

// 제목 앞 주황 동그라미 번호
function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="mt-px flex size-[min(1.25rem,20px)] shrink-0 items-center justify-center rounded-full bg-[#E07A5F] text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] font-medium text-[#F1E6D2]">
      {children}
    </span>
  );
}

function SectionTitle({ number, title, sub }: { number: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-[min(0.625rem,10px)]">
      <Badge>{number}</Badge>
      <div className="min-w-0 flex-1">
        <h3 className={TITLE_CLASS}>{title}</h3>
        <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
          {sub}
        </p>
      </div>
    </div>
  );
}
