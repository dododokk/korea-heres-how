import { useEffect, useState } from "react";
import { getScannedSigns, type ScannedSign } from "../../api/mypage";
import scan from "../../assets/mypage/scan.svg";
import ListPageLayout from "./components/ListPageLayout";
import SignCard from "./components/SignCard";

// 마이페이지 스캔한 안내문 "전체 보기" 화면 (/mypage/scans)
export default function ScannedSignsPage() {
  const [signs, setSigns] = useState<ScannedSign[]>([]);

  useEffect(() => {
    getScannedSigns()
      .then(setSigns)
      .catch((e) => console.error(e));
  }, []);

  return (
    <ListPageLayout
      icon={scan}
      title="스캔한 안내문"
      sub="Scanned signs"
      description="사진을 찍거나 입력해서 해석한 안내문 기록이에요."
      count={signs.length}
      emptyText="스캔한 안내문이 없습니다."
    >
      {signs.map((sign) => (
        <SignCard key={sign.id} sign={sign} />
      ))}
    </ListPageLayout>
  );
}
