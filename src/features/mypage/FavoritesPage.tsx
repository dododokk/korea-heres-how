import { useEffect, useState } from "react";
import { type FavoritePlace, getFavorites } from "../../api/mypage";
import bookmark from "../../assets/mypage/bookmark.svg";
import ListPageLayout from "./components/ListPageLayout";
import PlaceCard from "./components/PlaceCard";

// 마이페이지 즐겨찾기 "전체 보기" 화면 (/mypage/favorites)
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((e) => console.error(e));
  }, []);

  return (
    <ListPageLayout
      icon={bookmark}
      title="즐겨찾기"
      sub="Favorites"
      description="저장하거나 즐겨찾기한 장소와 가이드 모음이에요."
      count={favorites.length}
      emptyText="즐겨찾기한 장소가 없습니다."
    >
      {favorites.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </ListPageLayout>
  );
}
