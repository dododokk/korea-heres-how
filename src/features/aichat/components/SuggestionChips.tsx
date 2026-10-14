const SUGGESTIONS = [
  "지하철에서 통화해도 되나요?",
  "여기서 신발을 벗어야 하나요?",
  "한국 식당에서 팁을 줘야 하나요?",
  "한국 카페에서 어떻게 주문해요?",
  "쟁반은 어떻게 해야 해요?",
];

type SuggestionChipsProps = {
  // 누르면 그 질문이 바로 보내진다.
  onSelect: (question: string) => void;
};

// "이런 걸 물어보세요" 추천 질문 버튼 목록
export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="pt-[min(0.25rem,4px)]">
      <div className="flex items-baseline gap-[min(0.375rem,6px)] pb-[min(0.5rem,8px)] font-['Roboto',sans-serif]">
        <span className="text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.5)]">
          이런 걸 물어보세요
        </span>
        <span className="text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] text-[rgba(43,33,24,0.35)]">
          Try asking
        </span>
      </div>
      <div className="flex flex-wrap gap-[min(0.5rem,8px)]">
        {SUGGESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            className="rounded-full border border-[rgba(43,33,24,0.08)] bg-white px-[min(0.9375rem,15px)] py-[min(0.5625rem,9px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.7)]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
