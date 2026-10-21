import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { LoginFailedError } from "../../api/auth";
import { useAuth } from "../../contexts/auth";
import AuthLayout from "./components/AuthLayout";
import EmailStep from "./components/EmailStep";
import ErrorToast from "../../components/ErrorToast";
import PasswordStep from "./components/PasswordStep";

// 로그인: 같은 /login 주소 안에서 이메일 → 비밀번호 단계로 화면만 바뀐다.
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);

  const handleLogin = async (password: string) => {
    try {
      await login(email, password);
      navigate("/map", { replace: true });
    } catch (e) {
      setToast(
        e instanceof LoginFailedError
          ? "아이디나 비밀번호가 틀렸습니다"
          : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      throw e;
    }
  };

  return (
    <AuthLayout>
      {toast && <ErrorToast message={toast} onClose={closeToast} />}
      {step === "email" ? (
        <EmailStep
          initialEmail={email}
          onNext={(value) => {
            setEmail(value);
            setStep("password");
          }}
        />
      ) : (
        <PasswordStep email={email} onBack={() => setStep("email")} onLogin={handleLogin} />
      )}
    </AuthLayout>
  );
}
