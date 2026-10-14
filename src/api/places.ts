import { getMockPlaces } from "./mocks/places";

// 서버가 내려줄 장소 한 개 (TourAPI 기반, 백엔드와 필드 확정 전)
export type Place = {
  contentid: string;
  title: string;
  category: "관광지" | "음식점" | "시장" | "카페";
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
