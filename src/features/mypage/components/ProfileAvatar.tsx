import user from "../../../assets/mypage/user.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 64px 프로필 사진. 사진이 없으면 주황 칸에 사람 아이콘을 보여준다.
export default function ProfileAvatar({ src }: { src?: string }) {
  return (
    <span className="flex size-[min(4rem,64px)] shrink-0 items-center justify-center overflow-hidden rounded-[min(0.875rem,14px)] bg-[#E07A5F]">
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <img src={user} alt="" style={{ width: size(16), height: size(21) }} />
      )}
    </span>
  );
}
