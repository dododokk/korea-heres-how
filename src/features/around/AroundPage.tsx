import { useEffect, useState } from "react";
import { formatKm, formatWalk, getNearbyPlaces, type Place } from "../../api/places";
import distanceIcon from "../../assets/around/distance.svg";
import nameIcon from "../../assets/around/name.svg";
import searchIcon from "../../assets/around/search.svg";
import timeIcon from "../../assets/around/time.svg";
import AiButton from "../../components/AiButton";
import CategoryChips from "../../components/CategoryChips";
import PlaceListCard from "../../components/PlaceListCard";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 분류 칩: 지도 화면 카테고리와 같다.
const FILTERS = ["전체", "관광지", "음식점", "시장", "카페"] as const;
type Filter = (typeof FILTERS)[number];
type Sort = "distance" | "name";

// 하단 Nav "주변" 탭 (/list). 지도에서 보는 장소를 목록으로 보여준다.
// 검색어·분류·영업 중 필터를 함께 적용하고, 가까운 순 또는 이름순으로 정렬한다.
// 카드를 누르는 동작(상세 화면)은 아직 없다.
export default function AroundPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [sort, setSort] = useState<Sort>("distance");
  const [openOnly, setOpenOnly] = useState(false);

  useEffect(() => {
    getNearbyPlaces()
      .then(setPlaces)
      .catch((e) => console.error(e));
  }, []);

  // 분류 칩 개수는 검색어·영업 중 필터를 적용한 뒤의 개수로 보여준다.
  const keyword = query.trim().toLowerCase();
  const searched = places.filter(
    (place) =>
      (!openOnly || place.open) &&
      (keyword === "" ||
        [place.title, place.titleEn, place.subcategory].some((text) => text.toLowerCase().includes(keyword))),
  );
  const countOf = (item: Filter) =>
    item === "전체" ? searched.length : searched.filter((place) => place.category === item).length;

  const visible = searched
    .filter((place) => filter === "전체" || place.category === filter)
    .sort((a, b) => (sort === "distance" ? a.distanceM - b.distanceM : a.title.localeCompare(b.title, "ko")));

  return (
    <div className="px-[min(1rem,16px)] pt-[min(1.5rem,24px)] pb-[min(5rem,80px)] font-['Roboto',sans-serif]">
      <header className="pb-[min(1rem,16px)]">
        <h1 className="text-[min(1.625rem,26px)] leading-[min(2.03rem,32.5px)] font-bold tracking-[-0.025em] text-[#2B2118]">
          주변 장소
        </h1>
        <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(0.86rem,13.75px)] text-[rgba(43,33,24,0.45)]">
          Nearby Places
        </p>
        <p className="pt-[min(0.375rem,6px)] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.6)]">
          지도에서 본 장소들을 목록으로 둘러보세요. 각 장소마다 행동 가이드가 함께 있어요.
        </p>
      </header>

      {/* 검색 */}
      <label className="mt-[min(0.25rem,4px)] flex items-center gap-[min(0.5rem,8px)] rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-white px-[min(0.5rem,8px)] py-[min(0.375rem,6px)]">
        <span className="flex size-[min(2.25rem,36px)] shrink-0 items-center justify-center">
          <img src={searchIcon} alt="" style={{ width: size(15), height: size(14) }} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소, 음식, 키워드 검색"
          aria-label="장소 검색"
          className="min-w-0 flex-1 bg-transparent text-[min(0.875rem,14px)] leading-[min(1.25rem,20px)] text-[#2B2118] outline-none placeholder:text-[rgba(43,33,24,0.4)]"
        />
      </label>

      {/* 분류 칩 */}
      <CategoryChips
        className="pt-[min(0.625rem,10px)]"
        items={FILTERS.map((item) => ({ value: item, count: countOf(item) }))}
        selected={filter}
        onSelect={setFilter}
      />

      {/* 개수 + 정렬 */}
      <div className="flex flex-col gap-[min(0.625rem,10px)] pt-[min(1rem,16px)]">
        <p className="text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.6)]">
          <span className="font-medium text-[#2B2118]">{visible.length}</span>곳 찾았어요
        </p>
        <div className="flex gap-[min(0.125rem,2px)] self-start rounded-full border border-[rgba(43,33,24,0.1)] bg-white p-[min(0.25rem,4px)]">
          <SortButton icon={distanceIcon} label="가까운 순" active={sort === "distance"} onClick={() => setSort("distance")} />
          <SortButton icon={nameIcon} label="이름순" active={sort === "name"} onClick={() => setSort("name")} />
          {/* 정렬과 별개로 켜고 끄는 필터 */}
          <SortButton icon={timeIcon} label="영업 중" active={openOnly} onClick={() => setOpenOnly((prev) => !prev)} />
        </div>
      </div>

      {/* 장소 목록 */}
      {visible.length === 0 ? (
        <p className="py-[min(1.5rem,24px)] text-center text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.35)]">
          찾는 장소가 없어요.
        </p>
      ) : (
        <div className="flex flex-col gap-[min(0.75rem,12px)] pt-[min(1rem,16px)]">
          {visible.map((place) => (
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
            />
          ))}
        </div>
      )}

      <p className="pt-[min(1.25rem,20px)] text-center text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.45)]">
        카드를 누르면 그 장소의 <span className="font-medium text-[rgba(43,33,24,0.7)]">행동 가이드</span>가 열려요.
      </p>

      {/* 하단 Nav 위 오른쪽에 떠 있는 AI 버튼 */}
      <div className="fixed right-[min(1rem,16px)] bottom-[calc(min(3.8125rem,61px)+min(1.1875rem,19px)+env(safe-area-inset-bottom))] z-40">
        <AiButton />
      </div>
    </div>
  );
}

function SortButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-[min(2.0625rem,33px)] items-center gap-[min(0.375rem,6px)] rounded-full px-[min(0.75rem,12px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] ${
        active ? "bg-[#F1E6D2] text-[#2B2118]" : "text-[rgba(43,33,24,0.55)]"
      }`}
    >
      <img src={icon} alt="" className={active ? "" : "opacity-55"} style={{ width: size(15), height: size(14) }} />
      {label}
    </button>
  );
}
