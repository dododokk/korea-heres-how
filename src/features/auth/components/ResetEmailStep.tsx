import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import AuthField from "./AuthField";
import {
  descriptionClassName,
  inputClassName,
  primaryButtonClassName,
  stepSubtitleClassName,
  stepTitleClassName,
} from "./authStyles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResetEmailStepProps = {
  // 인증번호 단계에서 뒤로 오면 입력했던 이메일을 그대로 보여준다.
  initialEmail: string;
  // 인증번호 보내기. 실패하면 오류를 던진다.
  onNext: (email: string) => Promise<void>;
};

// 비밀번호 찾기 1단계: 가입한 이메일 입력
export default function ResetEmailStep({ initialEmail, onNext }: ResetEmailStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError("이메일을 입력해주세요.");
    if (!EMAIL_PATTERN.test(value)) return setError("올바른 이메일 형식이 아니에요.");
    setLoading(true);
    try {
      await onNext(value);
    } catch {
      // 실패 안내는 FindPasswordPage가 위쪽 팝업으로 보여준다.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={stepTitleClassName}>비밀번호를 다시 설정해볼까요?</h1>
      <p className={stepSubtitleClassName}>Reset your password</p>
      <p className={`pt-[min(0.75rem,12px)] ${descriptionClassName}`}>
        가입할 때 사용한 이메일을 입력해주세요.
      </p>

      <form onSubmit={handleSubmit} noValidate className="pt-[min(1.5rem,24px)]">
        <AuthField label="이메일 · Email" error={error}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!error}
            className={inputClassName(!!error)}
          />
        </AuthField>
        <div className="pt-[min(1rem,16px)]">
          <button type="submit" disabled={loading} className={primaryButtonClassName}>
            인증번호 보내기
          </button>
        </div>
      </form>

      <p className="flex justify-center gap-[min(0.5rem,8px)] pt-[min(1.5rem,24px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)]">
        <span className="text-[rgba(43,33,24,0.85)]">비밀번호가 기억나셨나요?</span>
        <Link to="/login" className="font-semibold text-[#2B2118] underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
