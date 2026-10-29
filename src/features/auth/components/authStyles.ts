// auth 화면들이 같이 쓰는 스타일

// AuthField 안에 넣는 입력칸. 오류가 있으면 빨간 테두리.
export function inputClassName(hasError: boolean) {
  return `block h-[min(2.625rem,42px)] w-full rounded-[min(0.5rem,8px)] border bg-white px-[min(1.0625rem,17px)] text-[min(0.875rem,14px)] leading-[min(1.25rem,20px)] text-[#2B2118] outline-none placeholder:text-[rgba(43,33,24,0.4)] ${
    hasError ? "border-[rgba(180,69,58,0.7)]" : "border-[rgba(43,33,24,0.15)]"
  }`;
}

// 주황색 큰 버튼 (다음 / 로그인)
export const primaryButtonClassName =
  "flex h-[min(2.8125rem,45px)] w-full items-center justify-center rounded-[min(0.75rem,12px)] bg-[#E07A5F] font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.3125rem,21px)] font-medium text-[#F1E6D2] disabled:cursor-default disabled:opacity-60";

// 큰 제목 (다시 만나서 반가워요 등)
export const titleClassName =
  "text-[min(1.875rem,30px)] leading-[min(2.1375rem,34.2px)] font-bold tracking-[-0.025em] text-[#2B2118]";

// 제목 아래 영문 부제
export const subtitleClassName =
  "pt-[min(0.5rem,8px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-medium text-[rgba(43,33,24,0.75)]";

// 비밀번호 찾기 단계별 제목 (로그인 제목보다 작다)
export const stepTitleClassName =
  "text-[min(1.5rem,24px)] leading-[min(1.875rem,30px)] font-bold tracking-[-0.025em] text-[#2B2118]";

// 비밀번호 찾기 제목 아래 영문 부제
export const stepSubtitleClassName =
  "pt-[min(0.25rem,4px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-medium text-[rgba(43,33,24,0.75)]";

// 제목 아래 설명 문장
export const descriptionClassName =
  "font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.421875rem,22.75px)] text-[rgba(43,33,24,0.9)]";
