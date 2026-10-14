type MessageBubbleProps = {
  // ai: 왼쪽 흰 말풍선, user: 오른쪽 주황 말풍선
  from: "ai" | "user";
  children: string;
};

export default function MessageBubble({ from, children }: MessageBubbleProps) {
  if (from === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[min(0.875rem,14px)] rounded-tr-[2px] bg-[#E07A5F] px-[min(1rem,16px)] py-[min(0.625rem,10px)] font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.203rem,19.25px)] break-words text-[#F1E6D2]">
          {children}
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      <p className="max-w-[85%] rounded-[min(0.875rem,14px)] rounded-tl-[2px] border border-[rgba(43,33,24,0.06)] bg-white px-[min(1.0625rem,17px)] py-[min(0.6875rem,11px)] font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.421875rem,22.75px)] break-words text-[#2B2118]">
        {children}
      </p>
    </div>
  );
}
