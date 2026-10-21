import type { ReactNode } from "react";
import SubPageLayout from "./SubPageLayout";

type ListPageLayoutProps = {
  icon: string;
  title: string;
  sub: string;
  description: string;
  count: number;
  emptyText: string;
  children: ReactNode;
};

// 마이페이지 "전체 보기" 화면(즐겨찾기, 스캔한 안내문) 공통 틀
export default function ListPageLayout({
  icon,
  title,
  sub,
  description,
  count,
  emptyText,
  children,
}: ListPageLayoutProps) {
  return (
    <SubPageLayout icon={icon} title={title} sub={sub}>
      <p className="pt-[min(0.75rem,12px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.55)]">
        {description}{" "}
        <span className="font-medium text-[rgba(43,33,24,0.7)]">총 {count}개</span>
      </p>

      {count === 0 ? (
        <p className="py-[min(1.5rem,24px)] text-center text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.35)]">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-col gap-[min(0.5rem,8px)] pt-[min(1rem,16px)]">{children}</div>
      )}
    </SubPageLayout>
  );
}
