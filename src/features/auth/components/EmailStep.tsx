import { type FormEvent, useState } from "react";
import apple from "../../../assets/auth/apple.svg";
import google from "../../../assets/auth/google.svg";
import AuthField from "./AuthField";
import {
  inputClassName,
  primaryButtonClassName,
  subtitleClassName,
  titleClassName,
} from "./authStyles";
import SignupLink from "./SignupLink";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailStepProps = {
  // 비밀번호 단계에서 "이메일 다시 입력"으로 돌아오면 입력했던 이메일을 그대로 보여준다.
  initialEmail: string;
  onNext: (email: string) => void;
};

// 로그인 1단계: 이메일 입력
export default function EmailStep({ initialEmail, onNext }: EmailStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError("이메일을 입력해주세요.");
    if (!EMAIL_PATTERN.test(value)) return setError("올바른 이메일 형식이 아니에요.");
    onNext(value);
  };

  return (
    <div>
      <h1 className={titleClassName}>다시 만나서 반가워요</h1>
      <p className={subtitleClassName}>Welcome back</p>
      <p className="pt-[min(0.75rem,12px)] font-['Roboto',sans-serif] text-[min(0.875rem,14px)] leading-[min(1.421875rem,22.75px)] text-[rgba(43,33,24,0.9)]">
        이메일을 입력하면 다음 단계에서
        <br />
        비밀번호를 입력할 수 있어요.
      </p>

      <form onSubmit={handleSubmit} noValidate className="pt-[min(1.75rem,28px)]">
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
          <button type="submit" className={primaryButtonClassName}>
            다음
          </button>
        </div>
      </form>

      <div className="flex items-center gap-[min(0.75rem,12px)] py-[min(1.25rem,20px)]">
        <span className="h-px flex-1 bg-[rgba(43,33,24,0.1)]" />
        <span className="font-['Roboto',sans-serif] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.7)]">
          또는
        </span>
        <span className="h-px flex-1 bg-[rgba(43,33,24,0.1)]" />
      </div>

      {/* 소셜 로그인은 아직 모양만 있다. */}
      <div className="flex flex-col gap-[min(0.625rem,10px)]">
        <SocialButton
          icon={google}
          label="Google로 계속하기"
          sub="Continue with Google"
          className="h-[min(3rem,48px)] border border-[rgba(43,33,24,0.1)] bg-white"
          labelClassName="text-[#2B2118]"
          subClassName="text-[rgba(43,33,24,0.7)]"
        />
        <SocialButton
          icon={apple}
          label="Apple로 계속하기"
          sub="Continue with Apple"
          className="h-[min(2.875rem,46px)] bg-[#2B2118]"
          labelClassName="text-[#F1E6D2]"
          subClassName="text-[rgba(241,230,210,0.6)]"
        />
      </div>

      <SignupLink />
    </div>
  );
}

function SocialButton({
  icon,
  label,
  sub,
  className,
  labelClassName,
  subClassName,
}: {
  icon: string;
  label: string;
  sub: string;
  className: string;
  labelClassName: string;
  subClassName: string;
}) {
  return (
    <button
      type="button"
      className={`relative flex w-full flex-col items-center justify-center rounded-[min(0.75rem,12px)] font-['Roboto',sans-serif] font-medium ${className}`}
    >
      <span className="absolute top-1/2 left-[min(1rem,16px)] flex size-[min(1.25rem,20px)] -translate-y-1/2 items-center justify-center">
        <img src={icon} alt="" style={{ width: size(19), height: size(18) }} />
      </span>
      <span className={`text-[min(0.875rem,14px)] leading-[min(1.09375rem,17.5px)] ${labelClassName}`}>
        {label}
      </span>
      <span className={`text-[min(0.625rem,10px)] leading-[min(0.78125rem,12.5px)] ${subClassName}`}>
        {sub}
      </span>
    </button>
  );
}
