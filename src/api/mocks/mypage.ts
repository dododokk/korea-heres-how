import type { FavoritePlace, Profile, ScannedSign } from "../mypage";

// [임시] 서버가 준비되기 전까지 쓰는 마이페이지 데이터.
// 즐겨찾기·스캔한 안내문은 지금은 비어 있는 상태(0개)로 둔다.

export function getMockProfile(): Promise<Profile> {
  return Promise.resolve({ name: "수아", role: "Traveler", email: "admin@example.com" });
}

export function getMockFavorites(): Promise<FavoritePlace[]> {
  return Promise.resolve([]);
}

export function getMockScannedSigns(): Promise<ScannedSign[]> {
  return Promise.resolve([]);
}
