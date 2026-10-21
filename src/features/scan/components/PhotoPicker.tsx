import { type ChangeEvent, useRef } from "react";
import cameraIcon from "../../../assets/scan/camera.svg";
import imageIcon from "../../../assets/scan/image.svg";
import photoIcon from "../../../assets/scan/photo.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type PhotoPickerProps = {
  onSelect: (file: File) => void;
  // 텍스트가 이미 입력돼 있으면 true. 이때 버튼을 누르면 선택 창 대신 onLocked를 부른다.
  locked?: boolean;
  onLocked?: () => void;
};

// 사진이 아직 없을 때의 점선 영역. "사진 찍기"는 카메라를, "사진 업로드"는 사진/파일 선택 창을 연다.
export default function PhotoPicker({ onSelect, locked = false, onLocked }: PhotoPickerProps) {
  const cameraInput = useRef<HTMLInputElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);

  const open = (input: HTMLInputElement | null) => {
    if (locked) onLocked?.();
    else input?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 사진을 다시 골라도 change가 일어나도록 비워 둔다.
    e.target.value = "";
    if (file) onSelect(file);
  };

  return (
    <div className="flex flex-col items-center rounded-[min(0.875rem,14px)] border-2 border-dashed border-[rgba(43,33,24,0.1)] bg-[rgba(241,230,210,0.25)] px-[min(1.25rem,20px)] py-[min(2rem,32px)] text-center">
      <span className="flex size-[min(4rem,64px)] items-center justify-center rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-white">
        <img src={cameraIcon} alt="" style={{ width: size(25), height: size(24) }} />
      </span>
      <p className="pt-[min(0.75rem,12px)] text-[min(0.875rem,14px)] leading-[min(1.3125rem,21px)] font-medium text-[#2B2118]">
        안내문에 카메라를 맞춰주세요
      </p>
      <p className="pt-[min(0.25rem,4px)] text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)] text-[rgba(43,33,24,0.55)]">
        출입구, 시장, 역에서 볼 수 있는 한국어 안내문이
        <br />
        가장 잘 인식돼요.
      </p>

      <div className="flex w-full flex-col gap-[min(0.625rem,10px)] pt-[min(1.25rem,20px)]">
        <PickerButton
          icon={photoIcon}
          label="사진 찍기"
          sub="Take a photo"
          primary
          onClick={() => open(cameraInput.current)}
        />
        <PickerButton
          icon={imageIcon}
          label="사진 업로드"
          sub="Upload image"
          onClick={() => open(uploadInput.current)}
        />
      </div>

      {/* capture가 있으면 휴대폰에서 바로 카메라가 열린다. (일부 인앱 브라우저·PC에서는 선택 창으로 대신 열린다.) */}
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={handleChange} />
      <input ref={uploadInput} type="file" accept="image/*" hidden onChange={handleChange} />
    </div>
  );
}

function PickerButton({
  icon,
  label,
  sub,
  primary = false,
  onClick,
}: {
  icon: string;
  label: string;
  sub: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-[min(0.5rem,8px)] rounded-full ${
        primary
          ? "h-[min(3.0859375rem,49.375px)] bg-[#E07A5F]"
          : "h-[min(3.2109375rem,51.375px)] border border-[rgba(43,33,24,0.1)] bg-white"
      }`}
    >
      <img src={icon} alt="" style={{ width: size(15), height: size(14) }} />
      <span className="flex flex-col items-start">
        <span
          className={`text-[min(0.84375rem,13.5px)] leading-[min(1.0546875rem,16.875px)] font-medium ${
            primary ? "text-[#F1E6D2]" : "text-[#2B2118]"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-[min(0.625rem,10px)] leading-[min(0.78125rem,12.5px)] font-medium ${
            primary ? "text-[rgba(241,230,210,0.7)]" : "text-[rgba(43,33,24,0.45)]"
          }`}
        >
          {sub}
        </span>
      </span>
    </button>
  );
}
