import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { InvalidCodeError, resetPassword, sendResetCode, verifyResetCode } from "../../api/auth";
import open from "../../assets/auth/open.svg";
import ErrorToast from "../../components/ErrorToast";
import AuthLayout from "./components/AuthLayout";
import DoneStep from "./components/DoneStep";
import EmailInputStep from "./components/EmailInputStep";
import NewPasswordStep from "./components/NewPasswordStep";
import StepProgress from "./components/StepProgress";
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
          <StepProgress step={STEP_NUMBER[step]} total={3} onBack={handleBack} />
        )
      }
    >
      {toast && <ErrorToast message={toast} onClose={closeToast} />}
      {step === "email" && (
        <EmailInputStep
          title="비밀번호를 다시 설정해볼까요?"
          subtitle="Reset your password"
          description="가입할 때 사용한 이메일을 입력해주세요."
          submitLabel="인증번호 보내기"
          loginPrompt="비밀번호가 기억나셨나요?"
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
          description={
            <>
              입력하신 이메일로 인증번호를 보냈어요.
              <br />
              본인 확인 후 비밀번호를 다시 설정할 수 있어요.
            </>
          }
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
          title="새 비밀번호를 설정해주세요"
          subtitle="Create a new password"
          passwordLabel="새 비밀번호 · New password"
          confirmLabel="새 비밀번호 확인 · Confirm password"
          submitLabel="비밀번호 변경"
          onSubmit={(password) =>
            request(async () => {
              await resetPassword(email, code, password);
              setStep("done");
            }, "비밀번호를 바꾸지 못했어요.")
          }
        />
      )}
      {step === "done" && (
        <DoneStep
          icon={open}
          title="비밀번호가 변경되었어요"
          subtitle="Password updated"
          description="새 비밀번호로 다시 로그인해주세요."
          buttonLabel="로그인으로 돌아가기"
          onDone={() => navigate("/login", { replace: true })}
        />
      )}
    </AuthLayout>
  );
}
