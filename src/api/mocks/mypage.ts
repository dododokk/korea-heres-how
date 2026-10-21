import type { FavoritePlace, Profile, ProfileUpdate, ScannedSign } from "../mypage";

// [임시] 서버가 준비되기 전까지 쓰는 마이페이지 데이터.
// 즐겨찾기·스캔한 안내문은 피그마 화면과 같은 더미 4개씩 (사진 없이 회색 기본 칸)

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

const MOCK_FAVORITES: FavoritePlace[] = [
  { id: "place-gyeongbokgung", name: "경복궁", nameEn: "Gyeongbokgung Palace", category: "문화", distanceM: 2100 },
  { id: "place-bukchon", name: "북촌한옥마을", nameEn: "Bukchon Hanok Village", category: "관광지", distanceM: 400 },
  { id: "place-gwangjang", name: "광장시장", nameEn: "Gwangjang Market", category: "시장", distanceM: 1200 },
  { id: "place-anthracite", name: "앤트러사이트 커피", nameEn: "Anthracite Coffee", category: "카페", distanceM: 800 },
];

const MOCK_SCANNED_SIGNS: ScannedSign[] = [
  {
    id: "scan-no-outside-food",
    title: "외부 음식 반입 금지",
    titleEn: "No outside food allowed",
    description: "밖에서 가져온 음식은 이곳에 들고 들어갈 수 없다는 뜻이에요.",
    scannedAt: "2026-10-06T12:00:00+09:00",
  },
  {
    id: "scan-slippery",
    title: "미끄럼 주의",
    titleEn: "Caution: slippery floor",
    description: "바닥이 미끄러우니 조심하라는 안내예요.",
    scannedAt: "2026-10-04T12:00:00+09:00",
  },
  {
    id: "scan-no-smoking",
    title: "금연 구역",
    titleEn: "No smoking area",
    description: "이 구역에서는 담배를 피울 수 없다는 뜻이에요. 전자담배도 포함됩니다.",
    scannedAt: "2026-10-01T12:00:00+09:00",
  },
  {
    id: "scan-closed-today",
    title: "오늘 휴무",
    titleEn: "Closed today",
    description: "이 가게는 오늘 문을 열지 않는다는 뜻이에요.",
    scannedAt: "2026-09-28T12:00:00+09:00",
  },
];

export function getMockFavorites(): Promise<FavoritePlace[]> {
  return Promise.resolve(MOCK_FAVORITES);
}

export function getMockScannedSigns(): Promise<ScannedSign[]> {
  return Promise.resolve(MOCK_SCANNED_SIGNS);
}
