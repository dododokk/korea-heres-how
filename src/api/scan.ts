import type { FeedbackResult } from "./feedback";
import { explainMockSign, sendMockScanFeedback } from "./mocks/scan";
import type { Phrase } from "./phrases";

// 서버가 내려줄 안내문 해석 결과 (백엔드와 필드 확정 전)
export type SignExplanation = {
  id: string; // 피드백을 보낼 때 어떤 해석인지 알려주기 위한 값
  title: string; // 외부 음식 반입 금지
  titleEn: string; // No outside food allowed
  meaning: string; // 1. 이 안내문의 뜻 — 쉬운 설명
  meaningEn: string;
  action: string; // 2. 그래서 어떻게 해야 하나요?
  phrases: Phrase[]; // 3. 이렇게 말해보세요
  whereSeen: string; // 이런 곳에서 볼 수 있어요
};

// 사진 또는 텍스트 중 하나만 보낸다.
export type ExplainInput = { photo: File } | { text: string };

// 해석 피드백. 어떤 해석인지(scanId)와 피드백 내용을 함께 보낸다.
export type ScanFeedback = { scanId: string } & FeedbackResult;

// [임시] 서버 연결 전까지는 true. 서버가 준비되면 false로 바꾸고 mocks/scan.ts를 지운다.
const USE_MOCK = true;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 안내문을 해석한다. 서버(안): POST /scans (multipart: photo 또는 text) — 경로·형식은 백엔드와 협의 필요
// 사진은 서버에 저장돼서, 나중에 마이페이지 "스캔한 안내문"의 imageUrl로 내려온다.
export async function explainSign(input: ExplainInput): Promise<SignExplanation> {
  if (USE_MOCK) return explainMockSign(input);

  const body = new FormData();
  if ("photo" in input) body.append("photo", input.photo);
  else body.append("text", input.text);

  const res = await fetch(`${BASE_URL}/scans`, { method: "POST", body });
  if (!res.ok) throw new Error(`해석하지 못했어요 (${res.status})`);
  return res.json();
}

// 해석 피드백을 보낸다. 서버(안): POST /scans/feedback
export async function sendScanFeedback(feedback: ScanFeedback): Promise<void> {
  if (USE_MOCK) return sendMockScanFeedback(feedback);

  const res = await fetch(`${BASE_URL}/scans/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error(`의견을 보내지 못했어요 (${res.status})`);
}
