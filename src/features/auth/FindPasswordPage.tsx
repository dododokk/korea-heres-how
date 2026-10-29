import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { InvalidCodeError, resetPassword, sendResetCode, verifyResetCode } from "../../api/auth";
import ErrorToast from "../../components/ErrorToast";
import AuthLayout from "./components/AuthLayout";
import FindPasswordProgress from "./components/FindPasswordProgress";
import NewPasswordStep from "./components/NewPasswordStep";
import ResetDoneStep from "./components/ResetDoneStep";
import ResetEmailStep from "./components/ResetEmailStep";
import VerifyCodeStep from "./components/VerifyCodeStep";

type Step = "email" | "code" | "password" | "done";

const STEP_NUMBER = { email: 1, code: 2, password: 3 } as const;

const RETRY_MESSAGE = "잠시 후 다시 시도해 주세요.";

// 비밀번호 찾기: 같은 /find-password 주소 안에서 이메일 → 인증번호 → 새 비밀번호 → 완료 순으로 화면만 바뀐다.
export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);

  // 서버 요청이 실패하면 위쪽 팝업으로 알리고, 단계 화면이 로딩을 풀 수 있게 오류를 다시 던진다.
  const request = async (action: () => Promise<void>, failMessage: string) => {
    try {
      await action();
    } catch (e) {
      if (!(e instanceof InvalidCodeError)) setToast(`${failMessage} ${RETRY_MESSAGE}`);
      throw e;
    }
  };

  const handleBack = () => {
    if (step === "email") navigate("/login");
    else if (step === "code") setStep("email");
    else if (step === "password") setStep("code");
  };

  return (
    <AuthLayout
      top={
        step !== "done" && (
          <FindPasswordProgress step={STEP_NUMBER[step]} onBack={handleBack} />
        )
      }
    >
      {toast && <ErrorToast message={toast} onClose={closeToast} />}
      {step === "email" && (
        <ResetEmailStep
          initialEmail={email}
          onNext={(value) =>
            request(async () => {
              await sendResetCode(value);
              setEmail(value);
              setStep("code");
            }, "인증번호를 보내지 못했어요.")
          }
        />
      )}
      {step === "code" && (
        <VerifyCodeStep
          email={email}
          onVerify={(value) =>
            request(async () => {
              await verifyResetCode(email, value);
              setCode(value);
              setStep("password");
            }, "인증번호를 확인하지 못했어요.")
          }
          onResend={() => request(() => sendResetCode(email), "인증번호를 보내지 못했어요.")}
        />
      )}
      {step === "password" && (
        <NewPasswordStep
          onSubmit={(password) =>
            request(async () => {
              await resetPassword(email, code, password);
              setStep("done");
            }, "비밀번호를 바꾸지 못했어요.")
          }
        />
      )}
      {step === "done" && <ResetDoneStep onDone={() => navigate("/login", { replace: true })} />}
    </AuthLayout>
  );
}
