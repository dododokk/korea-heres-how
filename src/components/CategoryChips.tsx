type CategoryChipsProps<T extends string> = {
  items: { value: T; count: number }[];
  selected: T;
  onSelect: (value: T) => void;
  className?: string;
};

// 분류 칩 한 줄 (글자 + 개수, 아이콘 없음). 오프라인 표현 보관함, 주변 장소 등에서 같이 쓴다.
// 칩이 화면보다 길면 옆으로 밀어서 본다. 페이지 좌우 여백(16px)까지 스크롤되게 바깥으로 넓혀 둔다.
export default function CategoryChips<T extends string>({ items, selected, onSelect, className = "" }: CategoryChipsProps<T>) {
  return (
    <div
      className={`-mx-[min(1rem,16px)] flex gap-[min(0.5rem,8px)] overflow-x-auto px-[min(1rem,16px)] pb-[min(0.25rem,4px)] ${className}`}
    >
      {items.map(({ value, count }) => {
        const active = value === selected;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={active}
            className={`flex h-[min(2.1875rem,35px)] shrink-0 items-center gap-[min(0.375rem,6px)] rounded-full border px-[min(0.875rem,14px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-medium ${
              active
                ? "border-[#E07A5F] bg-[#E07A5F] text-[#F1E6D2]"
                : "border-[rgba(43,33,24,0.1)] bg-white text-[rgba(43,33,24,0.6)]"
            }`}
          >
            {value}
            <span className={active ? "text-[rgba(241,230,210,0.75)]" : "text-[rgba(43,33,24,0.35)]"}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
