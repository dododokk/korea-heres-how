import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  type FavoritePlace,
  getFavorites,
  getProfile,
  getScannedSigns,
  type Profile,
  type ScannedSign,
} from "../../api/mypage";
import arrowG from "../../assets/mypage/arrow-g.svg";
import arrowO from "../../assets/mypage/arrow-o.svg";
import bookmark from "../../assets/mypage/bookmark.svg";
import edit from "../../assets/mypage/edit.svg";
import languageIcon from "../../assets/mypage/language.svg";
import logoutIcon from "../../assets/mypage/logout.svg";
import mail from "../../assets/mypage/mail.svg";
import offline from "../../assets/mypage/offline.svg";
import scan from "../../assets/mypage/scan.svg";
import user from "../../assets/mypage/user.svg";
import AiButton from "../../components/AiButton";
import LanguageSelect from "../../components/LanguageSelect";
import { useAuth } from "../../contexts/auth";
import PlaceCard from "./components/PlaceCard";
import SignCard from "./components/SignCard";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 마이페이지에는 최대 3개까지만 보여주고, 3개 이상이면 "전체 보기"를 띄운다.
const PREVIEW_COUNT = 3;

// 다른 화면으로 넘어가는 버튼들은 아직 동작 없이 모양만 있다.
export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [signs, setSigns] = useState<ScannedSign[]>([]);

  useEffect(() => {
    Promise.all([getProfile(), getFavorites(), getScannedSigns()])
      .then(([profileResult, favoritesResult, signsResult]) => {
        setProfile(profileResult);
        setFavorites(favoritesResult);
        setSigns(signsResult);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="px-[min(1rem,16px)] pt-[min(1.5rem,24px)] pb-[min(5rem,80px)] font-['Roboto',sans-serif]">
      <header className="pb-[min(1.25rem,20px)]">
        <h1 className="text-[min(1.625rem,26px)] leading-[min(2.03rem,32.5px)] font-bold tracking-[-0.025em] text-[#2B2118]">
          마이페이지
        </h1>
        <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(0.86rem,13.75px)] text-[rgba(43,33,24,0.45)]">
          My Page
        </p>
      </header>

      {/* 프로필 */}
      <section className="overflow-hidden rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.05)] bg-white">
        <div className="flex items-center gap-[min(1rem,16px)] p-[min(1rem,16px)]">
          <span className="flex size-[min(4rem,64px)] shrink-0 items-center justify-center rounded-[min(0.875rem,14px)] bg-[#E07A5F]">
            <img src={user} alt="" style={{ width: size(16), height: size(21) }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[min(1.125rem,18px)] leading-[min(1.40625rem,22.5px)] font-bold text-[#2B2118]">
              {profile?.name}
            </p>
            <p className="truncate text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.45)]">
              {profile?.role}
            </p>
            {profile && (
              <p className="flex items-center gap-[min(0.375rem,6px)] pt-[min(0.25rem,4px)]">
                <img src={mail} alt="" className="shrink-0" style={{ width: size(13), height: size(12) }} />
                <span className="truncate text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.6)]">
                  {profile.email}
                </span>
              </p>
            )}
          </div>
        </div>
        <SettingRow icon={edit} title="프로필 수정" sub="Edit profile" bordered>
          <img src={arrowG} alt="" style={{ width: size(19), height: size(18) }} />
        </SettingRow>
      </section>

      {/* 개수 */}
      <div className="grid grid-cols-2 gap-[min(0.625rem,10px)] pt-[min(1rem,16px)]">
        <StatCard icon={bookmark} count={favorites.length} label="즐겨찾기" sub="Favorites" />
        <StatCard icon={scan} count={signs.length} label="스캔한 안내문" sub="Scanned signs" />
      </div>

      {/* 오프라인 표현 보관함 */}
      <div className="pt-[min(1rem,16px)]">
        <button
          type="button"
          className="flex w-full items-center gap-[min(0.875rem,14px)] rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.05)] bg-white px-[min(1.0625rem,17px)] py-[min(0.9375rem,15px)] text-left"
        >
          <span className="flex size-[min(2.75rem,44px)] shrink-0 items-center justify-center rounded-[min(0.75rem,12px)] bg-[rgba(224,122,95,0.1)]">
            <img src={offline} alt="" style={{ width: size(21), height: size(20) }} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-[min(0.375rem,6px)]">
              <span className="text-[min(0.90625rem,14.5px)] leading-[min(1.359rem,21.75px)] font-semibold text-[#2B2118]">
                오프라인 표현 보관함
              </span>
              <span className="text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] text-[rgba(43,33,24,0.4)]">
                Offline Phrasebook
              </span>
            </span>
            <span className="block pt-[min(0.125rem,2px)] text-[min(0.71875rem,11.5px)] leading-[min(0.988rem,15.8px)] text-[rgba(43,33,24,0.5)]">
              인터넷 없이도 저장한 한국어 표현을 확인할 수 있어요.
            </span>
          </span>
          <img src={arrowG} alt="" className="shrink-0" style={{ width: size(19), height: size(18) }} />
        </button>
      </div>

      {/* 즐겨찾기 */}
      <ListSection
        title="즐겨찾기"
        sub="Favorites"
        count={favorites.length}
        emptyText="즐겨찾기한 장소가 없습니다."
      >
        {favorites.slice(0, PREVIEW_COUNT).map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </ListSection>

      {/* 스캔한 안내문 */}
      <ListSection
        title="스캔한 안내문"
        sub="Scanned signs"
        count={signs.length}
        emptyText="스캔한 안내문이 없습니다."
      >
        {signs.slice(0, PREVIEW_COUNT).map((sign) => (
          <SignCard key={sign.id} sign={sign} />
        ))}
      </ListSection>

      {/* 앱 설정 */}
      <section className="pt-[min(1.5rem,24px)]">
        <SectionTitle title="앱 설정" sub="App settings" />
        <div className="mt-[min(0.625rem,10px)] rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.05)] bg-white">
          <SettingRow icon={languageIcon} title="앱 언어" sub="Language" as="div">
            <LanguageSelect buttonClassName="h-[min(2.09375rem,33.5px)] bg-[rgba(241,230,210,0.5)] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)]" />
          </SettingRow>
          <SettingRow icon={logoutIcon} title="로그아웃" sub="Sign out" bordered onClick={handleLogout}>
            <img src={arrowG} alt="" style={{ width: size(19), height: size(18) }} />
          </SettingRow>
        </div>
      </section>

      <p className="pt-[min(1.5rem,24px)] text-center text-[min(0.71875rem,11.5px)] leading-[min(1.168rem,18.69px)] text-[rgba(43,33,24,0.4)]">
        여기서는? · Korea, Here's How — 한국을 찾은 여행자를 위해 정성껏 만들었습니다.
      </p>

      {/* 하단 Nav 위 오른쪽에 떠 있는 AI 버튼 */}
      <div className="fixed right-[min(1rem,16px)] bottom-[calc(min(3.8125rem,61px)+min(1.1875rem,19px)+env(safe-area-inset-bottom))] z-40">
        <AiButton />
      </div>
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-[min(1rem,16px)] leading-[min(1.5rem,24px)] font-semibold text-[#2B2118]">{title}</h2>
      <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(0.86rem,13.75px)] text-[rgba(43,33,24,0.45)]">
        {sub}
      </p>
    </div>
  );
}

function ListSection({
  title,
  sub,
  count,
  emptyText,
  children,
}: {
  title: string;
  sub: string;
  count: number;
  emptyText: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-[min(1.5rem,24px)]">
      <div className="flex items-center justify-between pb-[min(0.625rem,10px)]">
        <SectionTitle title={title} sub={sub} />
        {count >= PREVIEW_COUNT && (
          <button
            type="button"
            className="flex items-center gap-[min(0.125rem,2px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] font-medium text-[#E07A5F]"
          >
            전체 보기
            <img src={arrowO} alt="" style={{ width: size(14), height: size(13) }} />
          </button>
        )}
      </div>
      {count === 0 ? (
        <p className="py-[min(1.5rem,24px)] text-center text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] text-[rgba(43,33,24,0.35)]">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-col gap-[min(0.5rem,8px)]">{children}</div>
      )}
    </section>
  );
}

function StatCard({ icon, count, label, sub }: { icon: string; count: number; label: string; sub: string }) {
  return (
    <button
      type="button"
      className="flex flex-col items-start rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.05)] bg-white px-[min(0.9375rem,15px)] py-[min(0.8125rem,13px)] text-left"
    >
      <img src={icon} alt="" style={{ width: size(17), height: size(16) }} />
      <span className="pt-[min(0.125rem,2px)] font-['Fraunces',serif] text-[min(1.25rem,20px)] leading-[min(1.5625rem,25px)] text-[#2B2118]">
        {count}
      </span>
      <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] font-medium text-[rgba(43,33,24,0.65)]">
        {label}
      </span>
      <span className="text-[min(0.5625rem,9px)] leading-[min(0.84375rem,13.5px)] text-[rgba(43,33,24,0.35)]">{sub}</span>
    </button>
  );
}

// 아이콘 + 제목/영문 + 오른쪽 요소(화살표, 언어 선택 등) 한 줄
function SettingRow({
  icon,
  title,
  sub,
  bordered = false,
  as = "button",
  onClick,
  children,
}: {
  icon: string;
  title: string;
  sub: string;
  bordered?: boolean;
  // 안에 다른 버튼(언어 선택)이 들어가는 줄은 div로 만든다.
  as?: "button" | "div";
  onClick?: () => void;
  children: ReactNode;
}) {
  const className = `flex w-full items-center gap-[min(0.75rem,12px)] px-[min(1rem,16px)] py-[min(0.875rem,14px)] text-left ${
    bordered ? "border-t border-[rgba(43,33,24,0.05)]" : ""
  }`;
  const content = (
    <>
      <span className="flex size-[min(1.25rem,20px)] shrink-0 items-center justify-center">
        <img src={icon} alt="" style={{ width: size(18), height: size(17) }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[min(0.875rem,14px)] leading-[min(1.3125rem,21px)] font-medium text-[#2B2118]">
          {title}
        </span>
        <span className="block text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
          {sub}
        </span>
      </span>
      {children}
    </>
  );

  return as === "div" ? (
    <div className={className}>{content}</div>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
