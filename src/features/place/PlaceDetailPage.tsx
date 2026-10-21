import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { addFavorite, removeFavorite } from "../../api/mypage";
import { formatDistance, getPlaceDetail, type PlaceDetail } from "../../api/places";
import ai from "../../assets/all/ai.svg";
import message from "../../assets/guide/message.svg";
import notice from "../../assets/guide/notice.svg";
import walk from "../../assets/guide/walk.svg";
import back from "../../assets/mypage/back.svg";
import bookmarkIcon from "../../assets/scan/bookmark.svg";
import bookmarkFillIcon from "../../assets/scan/bookmark-fill.svg";
import AiButton from "../../components/AiButton";
import GuideTab from "./components/GuideTab";
import InfoTab from "./components/InfoTab";
import PhrasesTab from "./components/PhrasesTab";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const TABS = [
  { key: "guide", label: "행동 가이드", sub: "Action guide" },
  { key: "phrases", label: "현장 한국어", sub: "Phrases" },
  { key: "info", label: "기본 정보", sub: "Info" },
] as const;
type Tab = (typeof TABS)[number]["key"];

// 관광지 상세 (/place/:id). 장소 카드의 "여기서는? 가이드"(가로 카드는 화살표)를 누르면 들어온다.
// 위쪽(사진·칩·이것만 기억하세요)은 공통이고, 아래는 행동 가이드 / 현장 한국어 / 기본 정보 탭으로 나뉜다.
export default function PlaceDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("guide");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    // 목록을 내려본 상태에서 들어와도 맨 위부터 보이게 한다.
    window.scrollTo(0, 0);
    getPlaceDetail(id)
      .then((result) => {
        setDetail(result);
        setFavorite(result.favorite);
      })
      .catch((e) => {
        console.error(e);
        setFailed(true);
      });
  }, [id]);

  // 앱 안에서 들어왔으면 이전 화면으로, 주소로 바로 들어왔으면 지도로 돌아간다.
  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate("/map", { replace: true });
  };

  // 누르자마자 바꾸고, 저장에 실패하면 원래대로 되돌린다.
  const toggleFavorite = async () => {
    const next = !favorite;
    setFavorite(next);
    try {
      await (next ? addFavorite(id) : removeFavorite(id));
    } catch (e) {
      console.error(e);
      setFavorite(!next);
    }
  };

  if (failed) {
    return (
      <p className="px-[min(1rem,16px)] py-[min(3rem,48px)] text-center font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] text-[rgba(43,33,24,0.45)]">
        장소 정보를 불러오지 못했어요.
      </p>
    );
  }
  if (!detail) return null;

  return (
    <div className="pb-[min(5rem,80px)] font-['Roboto',sans-serif]">
      {/* 사진 (아직 회색 칸) */}
      <div className="relative h-[min(14.375rem,230px)] bg-[#E2E2E2]">
        {detail.imageUrl && <img src={detail.imageUrl} alt="" className="size-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(43,33,24,0.8)] via-[rgba(43,33,24,0.25)] to-[rgba(43,33,24,0.25)]" />

        <div className="absolute inset-x-[min(1rem,16px)] top-[min(1rem,16px)] flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            aria-label="뒤로 가기"
            className="flex size-[min(2.5rem,40px)] items-center justify-center rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-[4px]"
          >
            <img src={back} alt="" style={{ width: size(19), height: size(18) }} />
          </button>
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기"}
            aria-pressed={favorite}
            className={`flex size-[min(2.5rem,40px)] items-center justify-center rounded-full backdrop-blur-[4px] ${
              favorite ? "bg-[#E07A5F]" : "bg-[rgba(255,255,255,0.9)]"
            }`}
          >
            {favorite ? (
              <img src={bookmarkFillIcon} alt="" style={{ width: size(15), height: size(14) }} />
            ) : (
              <img src={bookmarkIcon} alt="" style={{ width: size(11), height: size(13) }} />
            )}
          </button>
        </div>

        <div className="absolute inset-x-[min(1rem,16px)] bottom-[min(1rem,16px)]">
          <span className="inline-flex items-center gap-[min(0.375rem,6px)] rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.15)] px-[min(0.75rem,12px)] py-[min(0.25rem,4px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] tracking-[0.05em] text-[#F1E6D2] backdrop-blur-[4px]">
            <span className="size-[min(0.375rem,6px)] rounded-full bg-[#F1E6D2]" />
            {detail.category} · {detail.subcategory}
          </span>
          <h1 className="pt-[min(0.5rem,8px)] text-[min(1.625rem,26px)] leading-[min(2.03rem,32.5px)] font-semibold tracking-[-0.025em] text-[#F1E6D2]">
            {detail.title}
          </h1>
          <p className="pt-[min(0.125rem,2px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(241,230,210,0.8)]">
            {detail.titleEn}
          </p>
        </div>
      </div>

      <div className="px-[min(1rem,16px)]">
        {/* 상태 · 거리 · 한 줄 특징 */}
        <div className="flex flex-wrap gap-[min(0.5rem,8px)] pt-[min(0.875rem,14px)]">
          <Chip>
            <span className={`size-[min(0.5rem,8px)] rounded-full ${detail.busy ? "bg-[#E07A5F]" : "bg-[#A9BBA0]"}`} />
            {detail.status}
          </Chip>
          <Chip>
            <img src={walk} alt="" style={{ width: size(13), height: size(12) }} />
            {formatDistance(detail)}
          </Chip>
          <Chip>
            <img src={notice} alt="" style={{ width: size(13), height: size(12) }} />
            {detail.highlight}
          </Chip>
        </div>

        <p className="pt-[min(0.625rem,10px)] text-[min(0.8125rem,13px)] leading-[min(1.117rem,17.875px)] text-[rgba(43,33,24,0.6)]">
          {detail.description}
        </p>

        {/* 여기서는? 이것만 기억하세요 */}
        <section className="pt-[min(1rem,16px)]">
          <p className="pb-[min(0.5rem,8px)] text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] font-medium tracking-[0.16em] text-[rgba(224,122,95,0.8)]">
            여기서는? · What should I know here
          </p>
          <div className="rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white p-[min(1rem,16px)]">
            <div className="flex gap-[min(0.625rem,10px)]">
              <span className="mt-[min(0.25rem,4px)] h-[min(1rem,16px)] w-[min(0.25rem,4px)] shrink-0 rounded-full bg-[#E07A5F]" />
              <div>
                <h2 className="text-[min(1rem,16px)] leading-[min(1.25rem,20px)] font-semibold text-[#2B2118]">
                  {detail.title}에서 이것만 기억하세요
                </h2>
                <p className="pt-[min(0.25rem,4px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
                  The 3 things to remember here
                </p>
              </div>
            </div>
            <ul className="pt-[min(0.75rem,12px)]">
              {detail.remember.map(({ text, textEn }, i) => (
                <li
                  key={text}
                  className={`py-[min(0.625rem,10px)] ${i === 0 ? "pt-0" : "border-t border-[rgba(43,33,24,0.05)]"} ${
                    i === detail.remember.length - 1 ? "pb-0" : ""
                  }`}
                >
                  <p className="text-[min(0.8125rem,13px)] leading-[min(1.117rem,17.875px)] text-[#2B2118]">{text}</p>
                  <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(0.9453rem,15.125px)] text-[rgba(43,33,24,0.45)]">
                    {textEn}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 탭 */}
        <div className="mt-[min(1.25rem,20px)] flex border-b border-[rgba(43,33,24,0.1)]">
          {TABS.map(({ key, label, sub }) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-pressed={active}
                className="relative flex flex-1 flex-col items-center pt-[min(0.75rem,12px)] pb-[min(0.625rem,10px)]"
              >
                <span
                  className={`text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-bold ${
                    active ? "text-[#E07A5F]" : "text-[rgba(43,33,24,0.45)]"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`pt-[min(0.25rem,4px)] text-[min(0.625rem,10px)] leading-[min(0.625rem,10px)] ${
                    active ? "text-[rgba(224,122,95,0.6)]" : "text-[rgba(43,33,24,0.3)]"
                  }`}
                >
                  {sub}
                </span>
                {active && (
                  <span className="absolute inset-x-[min(0.5rem,8px)] -bottom-px h-[2px] rounded-full bg-[#E07A5F]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-[min(1.25rem,20px)]">
          {tab === "guide" && <GuideTab detail={detail} />}
          {tab === "phrases" && <PhrasesTab detail={detail} />}
          {tab === "info" && <InfoTab detail={detail} />}
        </div>

        {/* AI에게 묻기 */}
        <div className="mt-[min(2rem,32px)] flex flex-col items-start gap-[min(0.875rem,14px)] rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white p-[min(1rem,16px)]">
          <span className="flex size-[min(2.5rem,40px)] items-center justify-center rounded-[min(0.5rem,8px)] bg-[rgba(224,122,95,0.1)]">
            <img src={message} alt="" style={{ width: size(19), height: size(18) }} />
          </span>
          <div>
            <h3 className="text-[min(0.9375rem,15px)] leading-[min(1.40625rem,22.5px)] font-semibold text-[#2B2118]">
              여기서 아직 헷갈리나요?
            </h3>
            <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
              Still unsure about something here?
            </p>
            <p className="pt-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.6)]">
              팁, 쟁반, 자리 같은 것까지 AI 여행 도우미에게 물어보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/aichat")}
            className="flex h-[min(2.21875rem,35.5px)] items-center gap-[min(0.375rem,6px)] rounded-full bg-[#E07A5F] px-[min(1rem,16px)] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-medium text-[#F1E6D2]"
          >
            <img src={ai} alt="" style={{ width: size(14), height: size(13) }} />
            AI에게 묻기
          </button>
        </div>
      </div>

      {/* 하단 Nav 위 오른쪽에 떠 있는 AI 버튼 */}
      <div className="fixed right-[min(1rem,16px)] bottom-[calc(min(3.8125rem,61px)+min(1.1875rem,19px)+env(safe-area-inset-bottom))] z-40">
        <AiButton />
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-[min(2rem,32px)] items-center gap-[min(0.375rem,6px)] rounded-full border border-[rgba(43,33,24,0.1)] bg-white px-[min(0.75rem,12px)] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[#2B2118]">
      {children}
    </span>
  );
}
