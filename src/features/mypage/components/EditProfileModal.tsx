import { type ChangeEvent, type InputHTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deleteAccount, type Profile, updateProfile } from "../../../api/mypage";
import arrowG from "../../../assets/mypage/arrow-g.svg";
import deleteAccountIcon from "../../../assets/mypage/delete-account.svg";
import photoIcon from "../../../assets/mypage/photo.svg";
import closeIcon from "../../../assets/scan/x-black.svg";
import ErrorToast from "../../../components/ErrorToast";
import { useAuth } from "../../../contexts/auth";
import DeleteAccountDialog from "./DeleteAccountDialog";
import ProfileAvatar from "./ProfileAvatar";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type EditProfileModalProps = {
  profile: Profile;
  onClose: () => void;
  onSaved: (profile: Profile) => void;
};

// 마이페이지 "프로필 수정"을 누르면 뜨는 팝업. X나 취소로만 닫힌다(배경을 눌러도 안 닫힘).
// 이름·사진은 바꿀 수 있고, 이메일은 로그인 아이디라서 보여주기만 한다.
export default function EditProfileModal({ profile, onClose, onSaved }: EditProfileModalProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);
  const photoInput = useRef<HTMLInputElement>(null);

  // 미리보기 주소는 다른 사진을 고르거나 팝업을 닫으면 해제한다.
  const previewRef = useRef<string | undefined>(undefined);
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  // 팝업이 떠 있는 동안 뒤 화면이 같이 스크롤되지 않게 막는다.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const changed = name !== profile.name || photo !== null;
  const canSave = changed && name.trim() !== "" && !saving;

  const choosePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPhoto(file);
    setPhotoPreview(previewRef.current);
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const saved = await updateProfile({ name: name.trim(), photo: photo ?? undefined });
      onSaved(saved);
    } catch (e) {
      console.error(e);
      setToast("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      logout();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error(e);
      // 확인창을 닫아야 프로필 수정 팝업 위에 뜨는 토스트가 보인다.
      setToast("탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(43,33,24,0.45)] p-[min(1rem,16px)] font-['Roboto',sans-serif] backdrop-blur-[2px]"
    >
      {toast && <ErrorToast message={toast} onClose={closeToast} />}

      <div className="flex max-h-[90svh] w-full max-w-[448px] flex-col overflow-hidden rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-white">
        {/* 제목 */}
        <div className="flex items-center justify-between border-b border-[rgba(43,33,24,0.05)] px-[min(1.25rem,20px)] py-[min(1rem,16px)]">
          <h2 id="edit-profile-title" className="flex items-baseline gap-[min(0.25rem,4px)]">
            <span className="text-[min(1rem,16px)] leading-[min(1.5rem,24px)] font-bold text-[#2B2118]">프로필 수정</span>
            <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
              Edit profile
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-[min(2rem,32px)] items-center justify-center rounded-full"
          >
            <img src={closeIcon} alt="" style={{ width: size(21), height: size(20) }} />
          </button>
        </div>

        <div className="overflow-y-auto p-[min(1.25rem,20px)]">
          {/* 사진 */}
          <div className="flex items-center gap-[min(1rem,16px)]">
            <ProfileAvatar src={photoPreview ?? profile.imageUrl} />
            <div>
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                className="flex h-[min(2.34375rem,37.5px)] items-center gap-[min(0.375rem,6px)] rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.1)] px-[min(0.75rem,12px)] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-medium text-[#2B2118]"
              >
                <img src={photoIcon} alt="" style={{ width: size(14), height: size(13) }} />
                사진 변경
              </button>
              <p className="pt-[min(0.375rem,6px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
                JPG · PNG, 정사각형 권장
              </p>
              <input ref={photoInput} type="file" accept="image/jpeg,image/png" hidden onChange={choosePhoto} />
            </div>
          </div>

          {/* 입력칸 */}
          <div className="flex flex-col gap-[min(0.875rem,14px)] pt-[min(1.25rem,20px)]">
            <Field label="이름 · Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Field label="이메일 · Email" value={profile.email} readOnly />
          </div>

          {/* 계정 관리 */}
          <div className="pt-[min(1.5rem,24px)]">
            <h3 className="flex items-baseline gap-[min(0.25rem,4px)]">
              <span className="text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)] font-bold text-[#2B2118]">계정 관리</span>
              <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
                Account
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="mt-[min(0.5rem,8px)] flex w-full items-center gap-[min(0.75rem,12px)] rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.1)] bg-white px-[min(0.9375rem,15px)] py-[min(0.8125rem,13px)] text-left"
            >
              <span className="flex size-[min(1.25rem,20px)] shrink-0 items-center justify-center">
                <img src={deleteAccountIcon} alt="" style={{ width: size(18), height: size(17) }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[rgba(180,69,58,0.9)]">
                  회원 탈퇴
                </span>
                <span className="block text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
                  Delete account
                </span>
              </span>
              <img src={arrowG} alt="" className="shrink-0" style={{ width: size(19), height: size(18) }} />
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-end gap-[min(0.5rem,8px)] border-t border-[rgba(43,33,24,0.05)] px-[min(1.25rem,20px)] py-[min(1rem,16px)]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[min(2.390625rem,38.25px)] items-center rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.1)] px-[min(1rem,16px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[rgba(43,33,24,0.7)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="flex h-[min(2.265625rem,36.25px)] items-center rounded-[min(0.5rem,8px)] bg-[#E07A5F] px-[min(1rem,16px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[#F1E6D2] disabled:cursor-default disabled:opacity-40"
          >
            저장하기
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <DeleteAccountDialog
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// 라벨 + 입력칸. 읽기 전용이면 흐리게 보여준다.
function Field({ label, readOnly, ...inputProps }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.55)]">{label}</span>
      <input
        {...inputProps}
        readOnly={readOnly}
        className={`mt-[min(0.375rem,6px)] block h-[min(2.625rem,42px)] w-full rounded-[min(0.5rem,8px)] border border-[rgba(43,33,24,0.1)] px-[min(0.9375rem,15px)] text-[min(0.875rem,14px)] leading-[min(1.25rem,20px)] outline-none ${
          readOnly ? "bg-[rgba(43,33,24,0.03)] text-[rgba(43,33,24,0.5)]" : "bg-white text-[#2B2118]"
        }`}
      />
    </label>
  );
}
