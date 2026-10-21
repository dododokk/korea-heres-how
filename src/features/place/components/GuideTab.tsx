import type { ReactNode } from "react";
import type { PlaceDetail } from "../../../api/places";
import arrowDown from "../../../assets/guide/arrow-down.svg";
import SectionTitle from "./SectionTitle";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 관광지 상세 "행동 가이드" 탭: 헷갈릴 수 있는 점 / 이렇게 하면 돼요 / 주의하세요
// "자세히"는 아직 화면이 없어서 동작 없이 모양만 있다.
export default function GuideTab({ detail }: { detail: PlaceDetail }) {
  return (
    <div className="flex flex-col gap-[min(1.5rem,24px)]">
      <section>
        <SectionTitle title="여기서 헷갈릴 수 있어요" sub="You might find this confusing" />
        <Box>
          {detail.confusions.map(({ question, answer }, i) => (
            <div key={question} className={`px-[min(0.875rem,14px)] py-[min(0.875rem,14px)] ${i > 0 ? DIVIDER : ""}`}>
              <p className="text-[min(0.84375rem,13.5px)] leading-[min(1.16rem,18.563px)] font-medium text-[#2B2118]">
                {question}
              </p>
              <p className="pt-[min(0.125rem,2px)] text-[min(0.78125rem,12.5px)] leading-[min(1.0742rem,17.188px)] text-[rgba(43,33,24,0.55)]">
                {answer}
              </p>
            </div>
          ))}
        </Box>
      </section>

      <section>
        <SectionTitle title="이렇게 하면 돼요" sub="Here's what to do" />
        <Box>
          <ol>
            {detail.steps.map((step, i) => (
              <li key={step} className={`flex items-center gap-[min(0.75rem,12px)] p-[min(0.75rem,12px)] ${i > 0 ? DIVIDER : ""}`}>
                <span className="flex size-[min(1.5rem,24px)] shrink-0 items-center justify-center rounded-full bg-[#E07A5F] text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] font-medium text-[#F1E6D2]">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-[min(0.84375rem,13.5px)] leading-[min(1.16rem,18.563px)] text-[#2B2118]">
                  {step}
                </span>
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(224,122,95,0.7)]"
                >
                  자세히
                  <img src={arrowDown} alt="" style={{ width: size(12), height: size(11) }} />
                </button>
              </li>
            ))}
          </ol>
        </Box>
      </section>

      <section>
        <SectionTitle title="주의하세요" sub="Good to know" />
        <div className="mt-[min(0.625rem,10px)] flex flex-col gap-[min(0.625rem,10px)] rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white p-[min(0.875rem,14px)]">
          {detail.cautions.map((caution) => (
            <p
              key={caution}
              className="text-[min(0.78125rem,12.5px)] leading-[min(1.0742rem,17.188px)] text-[rgba(43,33,24,0.7)]"
            >
              {caution}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

const DIVIDER = "border-t border-[rgba(43,33,24,0.05)]";

function Box({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[min(0.625rem,10px)] overflow-hidden rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white">
      {children}
    </div>
  );
}
