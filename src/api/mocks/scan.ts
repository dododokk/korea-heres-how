import type { ExplainInput, ScanFeedback, SignExplanation } from "../scan";

// [임시] 서버가 준비되기 전까지는 사진/텍스트와 상관없이 이 해석 하나를 돌려준다. (피그마 '외부 음식 반입 금지')
const MOCK_EXPLANATION: Omit<SignExplanation, "id"> = {
  title: "외부 음식 반입 금지",
  titleEn: "No outside food allowed",
  meaning: "밖에서 가져온 음식은 이곳에 들고 들어갈 수 없다는 뜻이에요.",
  meaningEn: "You cannot bring food from outside into this place.",
  action:
    "들어가기 전에 외부 음식을 다 먹거나 버리세요. 방금 산 음식이라면 직원에게 맡기거나 보관함에 두어도 됩니다.",
  phrases: [
    {
      id: "phrase-leave-this",
      korean: "이거 잠깐 맡길 수 있어요?",
      romanization: "i-geo jam-kkan mat-gil su i-sseo-yo?",
      english: "Can I leave this here for a moment?",
    },
    {
      id: "phrase-go-inside",
      korean: "안에 들어가도 돼요?",
      romanization: "an-e deu-reo-ga-do dwae-yo?",
      english: "Can I go inside?",
    },
  ],
  whereSeen: "음료와 간식을 직접 파는 카페, 영화관, 박물관, 일부 음식점에서 흔히 볼 수 있습니다.",
};

const MOCK_DELAY_MS = 800;
const MOCK_FEEDBACK_DELAY_MS = 300;

let mockId = 0;

export function explainMockSign(input: ExplainInput): Promise<SignExplanation> {
  console.info("[mock] 안내문 해석 요청", input);
  // 해석마다 피드백을 따로 보낼 수 있게 id를 새로 붙인다.
  const explanation = { ...MOCK_EXPLANATION, id: `mock-scan-${++mockId}` };
  return new Promise((resolve) => setTimeout(() => resolve(explanation), MOCK_DELAY_MS));
}

export function sendMockScanFeedback(feedback: ScanFeedback): Promise<void> {
  console.info("[mock] 해석 피드백 전송", feedback);
  return new Promise((resolve) => setTimeout(resolve, MOCK_FEEDBACK_DELAY_MS));
}
