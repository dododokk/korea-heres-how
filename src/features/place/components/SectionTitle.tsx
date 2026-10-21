// 관광지 상세 섹션 제목 + 영어 부제
export default function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h3 className="text-[min(1rem,16px)] leading-[min(1.25rem,20px)] font-semibold text-[#2B2118]">{title}</h3>
      <p className="pt-[min(0.25rem,4px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
        {sub}
      </p>
    </div>
  );
}
