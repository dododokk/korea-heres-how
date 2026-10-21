import notice from "../../../assets/mypage/notice.svg";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean; // 요청 중이면 버튼을 막는다.
  onCancel: () => void;
  onConfirm: () => void;
};

// 되돌릴 수 없는 일(회원 탈퇴, 표현 전체 삭제 등) 전에 띄우는 빨간 확인창. 취소 버튼으로만 닫힌다.
export default function ConfirmDialog({ title, message, confirmLabel, busy, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(43,33,24,0.45)] p-[min(1rem,16px)] font-['Roboto',sans-serif] backdrop-blur-[2px]"
    >
      <div className="w-full max-w-[448px] overflow-hidden rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] bg-white">
        <div className="px-[min(1.25rem,20px)] pt-[min(1.25rem,20px)]">
          <span className="flex size-[min(2.5rem,40px)] items-center justify-center rounded-[min(0.75rem,12px)] bg-[rgba(180,69,58,0.1)]">
            <img src={notice} alt="" style={{ width: size(23), height: size(22) }} />
          </span>
          <h2
            id="confirm-dialog-title"
            className="pt-[min(0.75rem,12px)] text-[min(1rem,16px)] leading-[min(1.5rem,24px)] font-bold text-[#2B2118]"
          >
            {title}
          </h2>
          <p className="pt-[min(0.375rem,6px)] text-[min(0.8125rem,13px)] leading-[min(1.3203rem,21.125px)] text-[rgba(43,33,24,0.6)]">
            {message}
          </p>
        </div>
        <div className="mt-[min(0.5rem,8px)] flex items-center justify-end gap-[min(0.5rem,8px)] px-[min(1.25rem,20px)] py-[min(1rem,16px)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex h-[min(2.390625rem,38.25px)] items-center rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.1)] px-[min(1rem,16px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-[rgba(43,33,24,0.7)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex h-[min(2.265625rem,36.25px)] items-center rounded-[min(0.875rem,14px)] bg-[#B4453A] px-[min(1rem,16px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] font-medium text-white disabled:cursor-default disabled:opacity-40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
