import { type FormEvent, useState } from "react";
import AuthField from "./AuthField";
import {
  descriptionClassName,
  inputClassName,
  primaryButtonClassName,
  stepSubtitleClassName,
  stepTitleClassName,
} from "./authStyles";

const NAME_MAX_LENGTH = 20;

type NameStepProps = {
  // 다음 단계에서 뒤로 오면 입력했던 이름을 그대로 보여준다.
  initialName: string;
  onNext: (name: string) => void;
};

// 회원가입 4단계: 서비스에서 쓸 이름 입력
export default function NameStep({ initialName, onNext }: NameStepProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return setError("이름을 입력해주세요.");
    onNext(value);
  };

  return (
    <div>
      <h1 className={stepTitleClassName}>어떻게 불러드리면 될까요?</h1>
      <p className={stepSubtitleClassName}>What should we call you?</p>
      <p className={`pt-[min(0.75rem,12px)] ${descriptionClassName}`}>
        서비스에서 사용할 이름이에요.
      </p>

      <form onSubmit={handleSubmit} noValidate className="pt-[min(1.5rem,24px)]">
        <AuthField label="이름 · Name" error={error}>
          <input
            type="text"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="예: 지우"
            autoComplete="nickname"
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
    </div>
  );
}
