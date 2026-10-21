import {
  clearMockSavedPhrases,
  getMockSavedPhrases,
  saveMockPhrase,
  unsaveMockPhrase,
} from "./mocks/phrases";
import type { Place } from "./places";

// 여러 화면(안내문 해석, 관광지 상세 등)에 나오는 "이렇게 말해보세요" 한국어 표현 한 개
export type Phrase = {
  id: string;
  korean: string; // 이거 잠깐 맡길 수 있어요?
  romanization: string; // i-geo jam-kkan mat-gil su i-sseo-yo?
  english: string; // Can I leave this here for a moment?
  saved?: boolean; // 북마크(오프라인 표현 보관함)에 저장했는지
};

// 보관함 분류는 지도 화면 카테고리와 같다. 분류가 없는 표현(안내문 해석 등)은 "기타"로 묶는다.
export type PhraseCategory = Place["category"] | "기타";

// 오프라인 표현 보관함에 저장된 표현
export type SavedPhrase = Phrase & {
  category?: Place["category"]; // 어느 분류의 장소에서 저장했는지. 없으면 "기타"
};

// [임시] 서버 연결 전까지는 true. 서버가 준비되면 false로 바꾸고 mocks/phrases.ts를 지운다.
const USE_MOCK = true;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(method: "PUT" | "DELETE", path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { method });
  if (!res.ok) throw new Error(`저장하지 못했어요 (${res.status})`);
}

// 표현을 북마크(나중에 마이페이지 "오프라인 표현 보관함")에 저장한다. 서버(안): PUT /me/phrases/:id
export function savePhrase(id: string): Promise<void> {
  return USE_MOCK ? saveMockPhrase(id) : request("PUT", `/me/phrases/${id}`);
}

// 북마크를 해제한다. 서버(안): DELETE /me/phrases/:id
export function unsavePhrase(id: string): Promise<void> {
  return USE_MOCK ? unsaveMockPhrase(id) : request("DELETE", `/me/phrases/${id}`);
}

// 저장한 표현 목록. 서버(안): GET /me/phrases
export async function getSavedPhrases(): Promise<SavedPhrase[]> {
  if (USE_MOCK) return getMockSavedPhrases();

  const res = await fetch(`${BASE_URL}/me/phrases`);
  if (!res.ok) throw new Error(`불러오지 못했어요 (${res.status})`);
  return res.json();
}

// 저장한 표현을 모두 지운다. 서버(안): DELETE /me/phrases
export function clearSavedPhrases(): Promise<void> {
  return USE_MOCK ? clearMockSavedPhrases() : request("DELETE", "/me/phrases");
}
