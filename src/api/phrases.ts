import { saveMockPhrase, unsaveMockPhrase } from "./mocks/phrases";

// 여러 화면(안내문 해석, 관광지 상세 등)에 나오는 "이렇게 말해보세요" 한국어 표현 한 개
export type Phrase = {
  id: string;
  korean: string; // 이거 잠깐 맡길 수 있어요?
  romanization: string; // i-geo jam-kkan mat-gil su i-sseo-yo?
  english: string; // Can I leave this here for a moment?
  saved?: boolean; // 북마크(오프라인 표현 보관함)에 저장했는지
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
