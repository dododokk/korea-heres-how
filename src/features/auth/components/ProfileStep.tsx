import { type ChangeEvent, useRef, useState } from "react";
import camera from "../../../assets/auth/camera.svg";
import { primaryButtonClassName, stepSubtitleClassName, stepTitleClassName } from "./authStyles";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const smallButtonClassName =
  "flex h-[min(2.046875rem,32.75px)] items-center justify-center rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.15)] bg-white px-[min(0.8125rem,13px)] font-['Roboto',sans-serif] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[#2B2118]";

// 고른 사진 파일과 미리보기 주소
export type ProfilePhoto = { file: File; url: string };

type ProfileStepProps = {
  name: string;
  // 고른 사진은 앞 단계로 갔다 와도 남도록 SignupPage가 들고 있다.
  photo: ProfilePhoto | null;
  onPhotoChange: (photo: ProfilePhoto | null) => void;
  // 가입 요청. 실패하면 오류를 던진다.
  onSubmit: () => Promise<void>;
};

// 회원가입 5단계: 프로필 사진 고르기 (사진이 없으면 이름 첫 글자를 보여준다)
export default function ProfileStep({ name, photo, onPhotoChange, onSubmit }: ProfileStepProps) {
  const [loading, setLoading] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  // 사진을 바꾸면 이전 미리보기 주소는 해제한다.
  const changePhoto = (next: ProfilePhoto | null) => {
    if (photo) URL.revokeObjectURL(photo.url);
    onPhotoChange(next);
  };

  const choosePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) changePhoto({ file, url: URL.createObjectURL(file) });
  };

  const openPicker = () => photoInput.current?.click();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } catch {
      // 실패 안내는 SignupPage가 위쪽 팝업으로 보여준다.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={stepTitleClassName}>프로필을 설정해주세요</h1>
      <p className={stepSubtitleClassName}>Set up your profile</p>

      <div className="flex flex-col items-center pt-[min(1.75rem,28px)]">
        <div className="relative">
          <span className="flex size-[min(6rem,96px)] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#E07A5F] text-[min(2.125rem,34px)] leading-[min(3.1875rem,51px)] font-semibold text-[#F1E6D2]">
            {photo ? <img src={photo.url} alt="" className="size-full object-cover" /> : name.charAt(0)}
          </span>
          <button
            type="button"
            onClick={openPicker}
            aria-label="사진 업로드"
            className="absolute top-[min(4.25rem,68px)] left-[min(4.25rem,68px)] flex size-[min(2rem,32px)] items-center justify-center rounded-full bg-[#2B2118]"
          >
            <img src={camera} alt="" style={{ width: size(16), height: size(15) }} />
          </button>
        </div>
        <input ref={photoInput} type="file" accept="image/*" onChange={choosePhoto} className="hidden" />

        <div className="flex gap-[min(0.5rem,8px)] pt-[min(1rem,16px)]">
          <button type="button" onClick={openPicker} className={smallButtonClassName}>
            사진 업로드
          </button>
          <button type="button" onClick={() => changePhoto(null)} className={smallButtonClassName}>
            기본 이미지 사용
          </button>
        </div>

        <div className="w-full pt-[min(1.5rem,24px)]">
          <div className="rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-[rgba(255,255,255,0.75)] px-[min(1.0625rem,17px)] py-[min(0.8125rem,13px)] text-center font-['Roboto',sans-serif]">
            <p className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.5)]">
              이름 · Name
            </p>
            <p className="truncate text-[min(0.9375rem,15px)] leading-[min(1.40625rem,22.5px)] font-medium text-[#2B2118]">
              {name}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-[min(1.75rem,28px)]">
        <button type="button" onClick={handleSubmit} disabled={loading} className={primaryButtonClassName}>
          다음
        </button>
      </div>
    </div>
  );
}
