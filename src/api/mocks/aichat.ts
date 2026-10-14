import type { AiAnswer, AnswerFeedback } from "../aichat";

// [임시] 서버가 준비되기 전까지는 질문과 상관없이 이 답변 하나를 돌려준다. (피그마 '지하철 통화' 답변)
const MOCK_ANSWER: Omit<AiAnswer, "id"> = {
  summary: "통화는 짧고 조용하게 — 대부분 거의 무음으로 이동합니다.",
  doList: [
    "전화 대신 문자를 보내세요.",
    "꼭 받아야 한다면 작은 소리로 짧게 끝내세요.",
  ],
  avoidList: ["스피커폰, 음악·영상 소리를 크게 틀기.", "칸 전체에 들리는 긴 통화."],
  lookFor:
    '칸 안의 "조용한 칸" 표시와 우선석 안내, 주변 사람들의 분위기를 확인하세요. 이어폰을 끼고 조용히 있다면 통화도 짧게 끝내세요.',
  phrase: {
    korean: "조용히 할게요",
    english: "I’ll keep it quiet",
    romanization: "jo-yong-hi hal-ge-yo",
  },
};

// 서버 응답을 기다리는 느낌을 내기 위한 지연 시간(ms) — 이 동안 점점점 애니메이션이 보인다.
const MOCK_DELAY_MS = 1500;
const MOCK_FEEDBACK_DELAY_MS = 300;

let mockId = 0;

export function getMockAnswer(): Promise<AiAnswer> {
  // 답변마다 피드백을 따로 보낼 수 있게 id를 새로 붙인다.
  const answer = { ...MOCK_ANSWER, id: `mock-${++mockId}` };
  return new Promise((resolve) => setTimeout(() => resolve(answer), MOCK_DELAY_MS));
}

export function sendMockFeedback(feedback: AnswerFeedback): Promise<void> {
  console.info("[mock] 피드백 전송", feedback);
  return new Promise((resolve) => setTimeout(resolve, MOCK_FEEDBACK_DELAY_MS));
}
