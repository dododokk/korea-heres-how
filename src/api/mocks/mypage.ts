import type { FavoritePlace, Profile, ProfileUpdate, ScannedSign } from "../mypage";

// [임시] 서버가 준비되기 전까지 쓰는 마이페이지 데이터.
// 즐겨찾기·스캔한 안내문은 지금은 비어 있는 상태(0개)로 둔다.

const MOCK_DELAY_MS = 500;

// 수정한 내용이 다시 불러와도 남아 있도록 메모리에 들고 있는다. (새로고침하면 처음으로 돌아간다)
let mockProfile: Profile = { name: "수아", email: "admin@example.com" };

export function getMockProfile(): Promise<Profile> {
  return Promise.resolve(mockProfile);
}

export function updateMockProfile(update: ProfileUpdate): Promise<Profile> {
  console.info("[mock] 프로필 수정", update);
  mockProfile = {
    ...mockProfile,
    name: update.name,
    // 서버가 저장한 사진 주소 대신, 브라우저 안에서만 쓰는 임시 주소를 만든다.
    imageUrl: update.photo ? URL.createObjectURL(update.photo) : mockProfile.imageUrl,
  };
  return new Promise((resolve) => setTimeout(() => resolve(mockProfile), MOCK_DELAY_MS));
}

export function deleteMockAccount(): Promise<void> {
  console.info("[mock] 회원 탈퇴");
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export function getMockFavorites(): Promise<FavoritePlace[]> {
  return Promise.resolve([]);
}

export function getMockScannedSigns(): Promise<ScannedSign[]> {
  return Promise.resolve([]);
}
