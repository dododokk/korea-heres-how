// AI 답변, 안내문 해석 등 여러 화면에서 같이 쓰는 "도움이 되었나요?" 피드백 형식

// "어떤 점이 아쉬웠나요?" 선택지
export const FEEDBACK_REASONS = [
  "잘못된 정보",
  "이해하기 어려움",
  "실제 장소와 다름",
  "기타",
] as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number];

// 도움됨이면 helpful: true만, 도움 안 됨이면 이유(1개 이상)와 추가 의견(선택)을 함께 보낸다.
export type FeedbackResult =
  | { helpful: true }
  | { helpful: false; reasons: FeedbackReason[]; comment?: string };
