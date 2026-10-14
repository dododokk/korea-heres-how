import { useEffect, useRef, useState } from "react";
import { getPlaces, type Place, toLatLng } from "../../api/places";
import AiButton from "../../components/AiButton";
import BottomSheet from "./components/BottomSheet";
import Header from "./components/header";
import KakaoMap from "./components/KakaoMap";
import LocationButton from "./components/LocationButton";
import PlaceMarker from "./components/PlaceMarker";
import { distanceM, useMyLocation } from "./components/useMyLocation";

export default function MapPage() {
  const myLocation = useMyLocation();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  // 따라가기 모드: 현재 위치 버튼을 누르면 켜지고, 지도를 끌면 꺼진다.
  const [following, setFollowing] = useState(false);

  const [places, setPlaces] = useState<Place[]>([]);
  // 마커와 바텀시트 카드가 같이 쓰는 선택 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchedOnce = useRef(false);

  // 지도에 지금 보이는 영역으로 장소를 조회한다. ("이 지역에서 다시 검색" 버튼도 나중에 이 함수를 쓴다)
  const searchArea = async (target: kakao.maps.Map) => {
    const bounds = target.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    try {
      const result = await getPlaces({
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      });
      setPlaces(result);
      setSelectedId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // 앱 진입 시 처음 지도가 자리 잡으면(첫 idle) 현재 영역을 자동으로 조회한다.
  const handleIdle = (target: kakao.maps.Map) => {
    if (searchedOnce.current) return;
    searchedOnce.current = true;
    searchArea(target);
  };

  // 따라가기 중에는 내 위치가 바뀔 때마다 지도도 따라간다.
  useEffect(() => {
    if (!map || !following || myLocation.status === "loading") return;
    const { lat, lng } = myLocation.position;
    map.panTo(new kakao.maps.LatLng(lat, lng));
  }, [map, following, myLocation]);

  const goToMyLocation = () => {
    setFollowing(true);
    // 이미 따라가기 중이어도 버튼을 누르면 바로 내 위치로 다시 맞춘다.
    if (map && myLocation.status !== "loading") {
      const { lat, lng } = myLocation.position;
      map.panTo(new kakao.maps.LatLng(lat, lng));
    }
  };

  return (
    // 화면 높이에서 하단 Nav(App의 main 아래 여백)만큼 뺀 높이를 헤더 + 지도가 나눠 쓴다.
    <div className="flex h-[calc(100svh-min(3.8125rem,61px)-env(safe-area-inset-bottom))] flex-col">
      <Header />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <KakaoMap
          myLocation={myLocation}
          onCreate={setMap}
          onDragStart={() => setFollowing(false)}
          onIdle={handleIdle}
        >
          {places.map((place) => {
            const position = toLatLng(place);
            return (
              <PlaceMarker
                key={place.contentid}
                position={position}
                name={place.title}
                // 진짜 내 위치를 받았을 때만 거리를 보여준다.
                distanceM={
                  myLocation.status === "success"
                    ? distanceM(myLocation.position, position)
                    : undefined
                }
                selected={place.contentid === selectedId}
                onClick={() => setSelectedId(place.contentid)}
              />
            );
          })}
        </KakaoMap>
        {/* 현재 위치 버튼과 AI 버튼은 시트 위에 붙어서 시트와 같이 움직인다. */}
        <BottomSheet
          floating={
            <div className="flex flex-col items-center gap-[min(0.75rem,12px)]">
              <LocationButton onClick={goToMyLocation} />
              <AiButton />
            </div>
          }
        />
      </div>
    </div>
  );
}
