import { getMockAnswer, sendMockFeedback } from "./mocks/aichat";

// 서버가 내려줄 AI 답변 한 개 (백엔드와 필드 확정 전)
export type AiAnswer = {
  id: string; // 피드백을 보낼 때 어떤 답변인지 알려주기 위한 값
  summary: string; // 맨 위 한 줄 요약
  doList: string[]; // 해야 할 행동
  avoidList: string[]; // 피해야 할 행동
  lookFor: string; // 현장에서 확인하세요
  phrase: {
    korean: string; // 유용한 한국어 표현
    english: string;
    romanization: string;
  };
};

// "어떤 점이 아쉬웠나요?" 선택지
export const FEEDBACK_REASONS = [
  "잘못된 정보",
  "이해하기 어려움",
  "실제 장소와 다름",
  "기타",
] as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number];

// 답변 피드백. 도움됨이면 helpful: true만, 도움 안 됨이면 이유(1개 이상)와 추가 의견(선택)을 함께 보낸다.
export type AnswerFeedback =
  | { answerId: string; helpful: true }
  | {
      answerId: string;
      helpful: false;
      reasons: FeedbackReason[];
      comment?: string;
    };

// [임시] 서버 연결 전까지는 true. 서버가 준비되면 false로 바꾸고 mocks/aichat.ts를 지운다.
const USE_MOCK = true;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 질문을 보내고 답변을 받는다. 서버(안): POST /aichat { question } — 경로·형식은 백엔드와 협의 필요
export async function askAi(question: string): Promise<AiAnswer> {
  if (USE_MOCK) return getMockAnswer();

  const res = await fetch(`${BASE_URL}/aichat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(`답변을 받지 못했어요 (${res.status})`);
  return res.json();
}

// 답변 피드백을 보낸다. 서버(안): POST /aichat/feedback — 경로·형식은 백엔드와 협의 필요
export async function sendFeedback(feedback: AnswerFeedback): Promise<void> {
  if (USE_MOCK) return sendMockFeedback(feedback);

  const res = await fetch(`${BASE_URL}/aichat/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error(`의견을 보내지 못했어요 (${res.status})`);
}
