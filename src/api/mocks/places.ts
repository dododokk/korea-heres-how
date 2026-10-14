import type { Place, PlacesQuery } from "../places";

// [임시] 서버가 준비되기 전까지 쓰는 가짜 장소 목록.
// 어디서 테스트해도 마커가 보이도록, 조회한 영역 안의 비율 위치(x: 서→동, y: 남→북)에 장소를 만든다.
// 바텀시트에 가려지지 않게 영역 위쪽(y 0.55~0.92)에 몰아 둔다.
const MOCK_ITEMS: (Omit<Place, "mapx" | "mapy"> & { x: number; y: number })[] = [
  { contentid: "1", title: "경복궁", category: "관광지", x: 0.42, y: 0.88 },
  { contentid: "2", title: "북촌한옥마을", category: "관광지", x: 0.5, y: 0.83 },
  { contentid: "3", title: "창덕궁", category: "관광지", x: 0.37, y: 0.74 },
  { contentid: "4", title: "광장시장", category: "시장", x: 0.55, y: 0.66 },
  { contentid: "5", title: "통인시장", category: "시장", x: 0.62, y: 0.66 },
  { contentid: "6", title: "토속촌 삼계탕", category: "음식점", x: 0.28, y: 0.58 },
  { contentid: "7", title: "어니언 안국", category: "카페", x: 0.66, y: 0.56 },
];

export function getMockPlaces(query: PlacesQuery): Place[] {
  return MOCK_ITEMS.filter(
    (item) => !query.category || item.category === query.category,
  ).map(({ x, y, ...item }) => ({
    ...item,
    // 서버처럼 문자열 좌표로 만든다. (mapx: 경도, mapy: 위도)
    mapx: String(query.swLng + (query.neLng - query.swLng) * x),
    mapy: String(query.swLat + (query.neLat - query.swLat) * y),
  }));
}
