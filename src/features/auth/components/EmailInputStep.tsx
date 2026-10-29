import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import { EmailTakenError } from "../../../api/auth";
import AuthField from "./AuthField";
import {
  descriptionClassName,
  inputClassName,
  primaryButtonClassName,
  stepSubtitleClassName,
  stepTitleClassName,
} from "./authStyles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailInputStepProps = {
  title: string;
  subtitle: string;
  description: string;
  submitLabel: string;
  // 맨 아래 "…있으신가요? 로그인" 문구
  loginPrompt: string;
  // 다음 단계에서 뒤로 오면 입력했던 이메일을 그대로 보여준다.
  initialEmail: string;
  // 인증번호 보내기. 이미 가입된 이메일이면 EmailTakenError, 그 밖의 실패도 오류를 던진다.
  onNext: (email: string) => Promise<void>;
};

// 비밀번호 찾기 / 회원가입 1단계: 이메일 입력
export default function EmailInputStep({
  title,
  subtitle,
  description,
  submitLabel,
  loginPrompt,
  initialEmail,
  onNext,
}: EmailInputStepProps) {
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
    } catch (e) {
      // 그 밖의 실패 안내는 페이지가 위쪽 팝업으로 보여준다.
      if (e instanceof EmailTakenError) setError("이미 가입된 이메일이에요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={stepTitleClassName}>{title}</h1>
      <p className={stepSubtitleClassName}>{subtitle}</p>
      <p className={`pt-[min(0.75rem,12px)] ${descriptionClassName}`}>{description}</p>

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
            {submitLabel}
          </button>
        </div>
      </form>

      <p className="flex justify-center gap-[min(0.5rem,8px)] pt-[min(1.5rem,24px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)]">
        <span className="text-[rgba(43,33,24,0.85)]">{loginPrompt}</span>
        <Link to="/login" className="font-semibold text-[#2B2118] underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
