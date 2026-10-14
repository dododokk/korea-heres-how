// 점이 하나씩 진해지는 간격(s). 세 점이 왼쪽부터 차례로 진해진다.
const DOT_DELAY_S = 0.2;

// AI가 답변을 만드는 중일 때 보여주는 점점점 말풍선
export default function TypingIndicator() {
  return (
    <div className="flex">
      <div
        className="flex items-center gap-[min(0.375rem,6px)] rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.06)] bg-white px-[min(1.0625rem,17px)] py-[min(0.8125rem,13px)]"
        role="status"
        aria-label="답변을 작성하고 있어요"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[min(0.5rem,8px)] animate-[typing-dot_1.2s_ease-in-out_infinite] rounded-full bg-[rgba(224,122,95,0.5)]"
            style={{ animationDelay: `${i * DOT_DELAY_S}s` }}
          />
        ))}
      </div>
    </div>
  );
}
