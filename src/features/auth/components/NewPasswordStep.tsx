import { type FormEvent, useState } from "react";
import eyeOff from "../../../assets/auth/eye-off.svg";
import eye from "../../../assets/auth/eye.svg";
import AuthField from "./AuthField";
import {
  inputClassName,
  primaryButtonClassName,
  stepSubtitleClassName,
  stepTitleClassName,
} from "./authStyles";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 영문과 숫자를 모두 포함한 8자 이상
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PASSWORD_RULE = "영문, 숫자를 포함해 8자 이상 입력해주세요.";

type NewPasswordStepProps = {
  title: string;
  subtitle: string;
  passwordLabel: string;
  confirmLabel: string;
  submitLabel: string;
  // 다음 단계에서 뒤로 오면 입력했던 비밀번호를 그대로 채운다.
  initialPassword?: string;
  // 비밀번호 저장. 실패하면 오류를 던진다.
  onSubmit: (password: string) => Promise<void>;
};

// 비밀번호 찾기 / 회원가입 3단계: 비밀번호 입력 + 확인
export default function NewPasswordStep({
  title,
  subtitle,
  passwordLabel,
  confirmLabel,
  submitLabel,
  initialPassword = "",
  onSubmit,
}: NewPasswordStepProps) {
  const [password, setPassword] = useState(initialPassword);
  const [confirm, setConfirm] = useState(initialPassword);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const invalid = !PASSWORD_PATTERN.test(password);
    const mismatch = password !== confirm;
    setPasswordError(invalid ? PASSWORD_RULE : "");
    setConfirmError(mismatch ? "비밀번호가 일치하지 않아요." : "");
    if (invalid || mismatch) return;
    setLoading(true);
    try {
      await onSubmit(password);
    } catch {
      // 실패 안내는 FindPasswordPage가 위쪽 팝업으로 보여준다.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={stepTitleClassName}>{title}</h1>
      <p className={stepSubtitleClassName}>{subtitle}</p>

      <form onSubmit={handleSubmit} noValidate className="pt-[min(1.5rem,24px)]">
        <PasswordField
          label={passwordLabel}
          hint={PASSWORD_RULE}
          error={passwordError}
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (passwordError) setPasswordError("");
          }}
        />
        <div className="pt-[min(1rem,16px)]">
          <PasswordField
            label={confirmLabel}
            error={confirmError}
            value={confirm}
            onChange={(value) => {
              setConfirm(value);
              if (confirmError) setConfirmError("");
            }}
          />
        </div>
        <div className="pt-[min(1rem,16px)]">
          <button type="submit" disabled={loading} className={primaryButtonClassName}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  hint,
  error,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  error: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField label={label} hint={hint} error={error}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        autoComplete="new-password"
        aria-invalid={!!error}
        className={`${inputClassName(!!error)} pr-[min(2.8125rem,45px)]`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={visible}
        className="absolute right-[min(0.5rem,8px)] bottom-[min(0.3125rem,5px)] flex size-[min(2rem,32px)] items-center justify-center"
      >
        {/* 로그인 화면과 같게: 보이는 중이면 eye, 숨김이면 eye-off (eye-off는 여백 포함 30px 아이콘) */}
        {visible ? (
          <img src={eye} alt="" style={{ width: size(18), height: size(17) }} />
        ) : (
          <img src={eyeOff} alt="" style={{ width: size(30), height: size(30) }} />
        )}
      </button>
    </AuthField>
  );
}
