import { getMockNearbyPlaces, getMockPlaces } from "./mocks/places";

// 서버가 내려줄 장소 한 개 (TourAPI 기반, 백엔드와 필드 확정 전)
export type Place = {
  contentid: string;
  title: string;
  titleEn: string; // Gyeongbokgung Palace
  category: "관광지" | "음식점" | "시장" | "카페";
  subcategory: string; // 고궁, 전통 마을, 전통시장 …
  status: string; // 운영 상태 한 줄 (오후 6시까지 운영, 혼잡 · 오후 11시까지 운영 …)
  busy: boolean; // 혼잡하면 상태 점이 주황, 아니면 초록
  tip: string; // Know before you go 한 줄 (영어)
  open: boolean; // 지금 영업 중인지
  distanceM: number; // 내 위치에서의 거리(m) — [임시] 지금은 더미 고정 값, 서버 연결 시 계산 값으로
  walkMinutes: number; // 도보 시간(분) — [임시] 지금은 더미 고정 값
  imageUrl?: string; // 없으면 회색 기본 칸
  mapx: string; // 경도 (문자열)
  mapy: string; // 위도 (문자열)
};

// 지도에서 지금 보이는 영역 (남서쪽 / 북동쪽 꼭짓점)
export type PlacesQuery = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  category?: Place["category"];
};

// 거리·도보 시간 표시 문구: "2.1 km", "도보 27분", "2.1 km · 도보 27분"
export const formatKm = (place: Place) => `${(place.distanceM / 1000).toFixed(1)} km`;
export const formatWalk = (place: Place) => `도보 ${place.walkMinutes}분`;
export const formatDistance = (place: Place) => `${formatKm(place)} · ${formatWalk(place)}`;

// ⚠️ mapy가 위도, mapx가 경도. 서버 좌표는 항상 이 함수로 바꿔서 쓴다.
export const toLatLng = (place: Place) => ({
  lat: Number(place.mapy),
  lng: Number(place.mapx),
});

// [임시] 서버 연결 전까지는 true. 서버가 준비되면 false로 바꾸고 mocks 폴더를 지운다.
const USE_MOCK = true;

// 영역 안의 장소 목록을 가져온다. 서버(안): GET /places?swLat&swLng&neLat&neLng&category
export async function getPlaces(query: PlacesQuery): Promise<Place[]> {
  if (USE_MOCK) return getMockPlaces(query);

  const params = new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/places?${params}`);
  if (!res.ok) throw new Error(`장소 목록을 불러오지 못했어요 (${res.status})`);
  return res.json();
}

// 주변 탭 목록: 내 위치 주변 장소. 서버(안): GET /places/nearby?lat&lng — 경로·형식은 백엔드와 협의 필요
export async function getNearbyPlaces(): Promise<Place[]> {
  if (USE_MOCK) return getMockNearbyPlaces();

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/places/nearby`);
  if (!res.ok) throw new Error(`장소 목록을 불러오지 못했어요 (${res.status})`);
  return res.json();
}
