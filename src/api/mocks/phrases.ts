import type { SavedPhrase } from "../phrases";

// [임시] 서버가 준비되기 전까지 쓰는 오프라인 표현 보관함 더미 데이터.
// 다른 화면에서 저장한 표현은 아직 여기 반영되지 않는다. (저장/해제 요청은 콘솔에만 남긴다)
// 보관함에서 지우면 새로고침 전까지 지운 상태가 유지된다.

const MOCK_DELAY_MS = 200;

const MOCK_SAVED_PHRASES: Omit<SavedPhrase, "saved">[] = [
  {
    id: "saved-photo-ok",
    korean: "사진 찍어도 되나요?",
    romanization: "sa-jin jjik-eo-do doe-na-yo?",
    english: "Is it okay to take a photo?",
    category: "관광지",
  },
  {
    id: "saved-keep-quiet",
    korean: "조용히 하겠습니다.",
    romanization: "jo-yong-hi ha-get-seum-ni-da.",
    english: "I will keep quiet.",
    category: "관광지",
  },
  {
    id: "saved-not-spicy",
    korean: "안 맵게 해 주세요.",
    romanization: "an maep-ge hae ju-se-yo.",
    english: "Please make it not spicy.",
    category: "음식점",
  },
  {
    id: "saved-how-much",
    korean: "이거 얼마예요?",
    romanization: "i-geo eol-ma-ye-yo?",
    english: "How much is this?",
    category: "시장",
  },
  {
    id: "saved-take-out",
    korean: "포장해 주세요.",
    romanization: "po-jang-hae ju-se-yo.",
    english: "To go, please.",
    category: "카페",
  },
  {
    id: "saved-excuse-me",
    korean: "실례합니다, 지나갈게요.",
    romanization: "sil-lye-ham-ni-da, ji-na-gal-ge-yo.",
    english: "Excuse me, let me through.",
  },
];

let mockSavedPhrases: SavedPhrase[] = MOCK_SAVED_PHRASES.map((phrase) => ({ ...phrase, saved: true }));

export function getMockSavedPhrases(): Promise<SavedPhrase[]> {
  return Promise.resolve(mockSavedPhrases);
}

export function saveMockPhrase(id: string): Promise<void> {
  console.info("[mock] 표현 저장", id);
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export function unsaveMockPhrase(id: string): Promise<void> {
  console.info("[mock] 표현 저장 해제", id);
  mockSavedPhrases = mockSavedPhrases.filter((phrase) => phrase.id !== id);
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export function clearMockSavedPhrases(): Promise<void> {
  console.info("[mock] 저장한 표현 전체 삭제");
  mockSavedPhrases = [];
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}
