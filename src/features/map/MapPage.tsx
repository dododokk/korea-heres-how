import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  formatDistance,
  formatKm,
  formatWalk,
  getPlaces,
  type Place,
  toLatLng,
} from "../../api/places";
import arrowOrange from "../../assets/map/arrow-orange.svg";
import AiButton from "../../components/AiButton";
import PlaceListCard from "../../components/PlaceListCard";
import BottomSheet from "./components/BottomSheet";
import Header, { type Category } from "./components/header";
import KakaoMap from "./components/KakaoMap";
import LocationButton from "./components/LocationButton";
import NearbyPlaceCard from "./components/NearbyPlaceCard";
import PlaceMarker from "./components/PlaceMarker";
import { useMyLocation } from "./components/useMyLocation";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

export default function MapPage() {
  const navigate = useNavigate();
  const myLocation = useMyLocation();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  // 따라가기 모드: 현재 위치 버튼을 누르면 켜지고, 지도를 끌면 꺼진다.
  const [following, setFollowing] = useState(false);

  const [places, setPlaces] = useState<Place[]>([]);
  // 마커와 바텀시트 카드가 같이 쓰는 선택 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchedOnce = useRef(false);
  // 헤더 카테고리 탭: 마커와 카드를 함께 거른다.
  const [category, setCategory] = useState<Category>("전체");
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // 앱 진입 시 현재 영역을 한 번 자동으로 조회한다.
  const searchFirstTime = (target: kakao.maps.Map) => {
    if (searchedOnce.current) return;
    searchedOnce.current = true;
    searchArea(target);
  };

  // 카카오맵은 처음 그려질 때 idle 이벤트를 안 보내기도 해서(지도를 한 번 건드려야 옴),
  // 지도가 만들어지면 화면 배치가 끝난 다음 프레임에 바로 조회한다. idle은 혹시 몰라 그대로 둔다.
  useEffect(() => {
    if (!map) return;
    const frame = requestAnimationFrame(() => searchFirstTime(map));
    return () => cancelAnimationFrame(frame);
    // searchFirstTime은 searchedOnce로 한 번만 동작하므로 map이 생길 때만 실행하면 된다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // 따라가기 중에는 내 위치가 바뀔 때마다 지도도 따라간다.
  useEffect(() => {
    if (!map || !following || myLocation.status === "loading") return;
    const { lat, lng } = myLocation.position;
    map.panTo(new kakao.maps.LatLng(lat, lng));
  }, [map, following, myLocation]);

  const visiblePlaces =
    category === "전체"
      ? places
      : places.filter((place) => place.category === category);
  // 선택한 장소는 카드 목록 맨 앞으로 보낸다.
  const orderedPlaces = [...visiblePlaces].sort(
    (a, b) =>
      Number(b.contentid === selectedId) - Number(a.contentid === selectedId),
  );

  // 장소가 선택되면 맨 앞으로 온 카드가 보이게 가로 목록을 처음으로 되돌린다.
  useEffect(() => {
    carouselRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [selectedId]);

  const changeCategory = (next: Category) => {
    setCategory(next);
    // 선택된 장소가 걸러져서 안 보이게 되면 선택을 푼다.
    const selected = places.find((place) => place.contentid === selectedId);
    if (selected && next !== "전체" && selected.category !== next)
      setSelectedId(null);
  };

  // 카드를 누르면 해당 마커를 선택하고 지도를 그 장소로 옮긴다. (따라가기는 끈다)
  const selectFromCard = (place: Place) => {
    setSelectedId(place.contentid);
    setFollowing(false);
    const { lat, lng } = toLatLng(place);
    map?.panTo(new kakao.maps.LatLng(lat, lng));
  };

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
      <Header onCategoryChange={changeCategory} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <KakaoMap
          myLocation={myLocation}
          onCreate={setMap}
          onDragStart={() => setFollowing(false)}
          onIdle={searchFirstTime}
        >
          {visiblePlaces.map((place) => {
            const position = toLatLng(place);
            return (
              <PlaceMarker
                key={place.contentid}
                position={position}
                name={place.title}
                // [임시] 거리는 더미 고정 값. 서버 연결 후 내 위치로 계산한다.
                distanceText={formatDistance(place)}
                selected={place.contentid === selectedId}
                onClick={() => setSelectedId(place.contentid)}
              />
            );
          })}
        </KakaoMap>
        {/* 현재 위치 버튼과 AI 버튼은 시트 위에 붙어서 시트와 같이 움직인다. */}
        <BottomSheet
          count={visiblePlaces.length}
          scrollResetKey={selectedId}
          action={
            <button
              type="button"
              onClick={() => navigate("/list")}
              className="flex items-center gap-[min(0.25rem,4px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[#E07A5F]"
            >
              전체 보기
              <img
                src={arrowOrange}
                alt=""
                style={{ width: size(13), height: size(12.5) }}
              />
            </button>
          }
          expandedContent={
            <div className="flex flex-col gap-[min(0.75rem,12px)] px-[min(1rem,16px)] pb-[min(1rem,16px)]">
              {orderedPlaces.map((place) => (
                <PlaceListCard
                  key={place.contentid}
                  title={place.title}
                  titleEn={place.titleEn}
                  category={place.category}
                  subcategory={place.subcategory}
                  status={place.status}
                  busy={place.busy}
                  tip={place.tip}
                  imageUrl={place.imageUrl}
                  distanceText={formatKm(place)}
                  walkText={formatWalk(place)}
                  onClick={() => selectFromCard(place)}
                  onGuideClick={() => navigate(`/place/${place.contentid}`)}
                />
              ))}
            </div>
          }
          floating={
            <div className="flex flex-col items-center gap-[min(0.75rem,12px)]">
              <LocationButton onClick={goToMyLocation} />
              <AiButton />
            </div>
          }
        >
          {/* 중간 단계: 옆으로 넘겨 보는 카드 */}
          <div
            ref={carouselRef}
            className="flex snap-x gap-[min(0.625rem,10px)] overflow-x-auto scroll-px-[min(1rem,16px)] px-[min(1rem,16px)] pb-[min(0.25rem,4px)]"
          >
            {orderedPlaces.map((place) => (
              <NearbyPlaceCard
                key={place.contentid}
                place={place}
                distanceText={formatDistance(place)}
                onClick={() => selectFromCard(place)}
                onGuideClick={() => navigate(`/place/${place.contentid}`)}
              />
            ))}
          </div>
          <p className="px-[min(1rem,16px)] pt-[min(0.5rem,8px)] text-center font-['Roboto',sans-serif] text-[min(0.6875rem,11px)] leading-[min(0.9453rem,15.125px)] text-[rgba(43,33,24,0.45)]">
            카드를 누르면{" "}
            <span className="font-medium text-[rgba(43,33,24,0.7)]">
              “여기서 어떻게 행동하는지”
            </span>{" "}
            볼 수 있어요.
          </p>
        </BottomSheet>
      </div>
    </div>
  );
}
