// [임시] 서버가 준비되기 전까지는 저장/해제 요청을 콘솔에만 남긴다.

const MOCK_DELAY_MS = 200;

export function saveMockPhrase(id: string): Promise<void> {
  console.info("[mock] 표현 저장", id);
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export function unsaveMockPhrase(id: string): Promise<void> {
  console.info("[mock] 표현 저장 해제", id);
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}
