import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import {
  EmailTakenError,
  InvalidCodeError,
  sendSignupCode,
  signup,
  verifySignupCode,
} from "../../api/auth";
import done from "../../assets/auth/done.svg";
import ErrorToast from "../../components/ErrorToast";
import AuthLayout from "./components/AuthLayout";
import DoneStep from "./components/DoneStep";
import EmailInputStep from "./components/EmailInputStep";
import LanguageStep from "./components/LanguageStep";
import NameStep from "./components/NameStep";
import NewPasswordStep from "./components/NewPasswordStep";
import ProfileStep, { type ProfilePhoto } from "./components/ProfileStep";
import StepProgress from "./components/StepProgress";
import VerifyCodeStep from "./components/VerifyCodeStep";

type Step = "email" | "code" | "password" | "name" | "profile" | "done" | "language";

// 단계 표시줄에 나오는 단계 (완료·언어 선택 화면에는 표시줄이 없다)
const PROGRESS_STEPS = ["email", "code", "password", "name", "profile"] as const;

const RETRY_MESSAGE = "잠시 후 다시 시도해 주세요.";

// 회원가입: 같은 /signup 주소 안에서 이메일 → 인증번호 → 비밀번호 → 이름 → 프로필 → 완료 → 언어 선택 순으로 화면만 바뀐다.
// 앞 단계로 돌아가도 입력한 값은 남아 있고, 가입을 마치면 로그인 화면으로 보낸다.
export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<ProfilePhoto | null>(null);
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);

  // 서버 요청이 실패하면 위쪽 팝업으로 알리고, 단계 화면이 로딩을 풀 수 있게 오류를 다시 던진다.
  // 화면 안에 오류 문구로 보여주는 경우(인증번호 틀림, 이미 가입된 이메일)는 팝업을 띄우지 않는다.
  const request = async (action: () => Promise<void>, failMessage: string) => {
    try {
      await action();
    } catch (e) {
      if (!(e instanceof InvalidCodeError || e instanceof EmailTakenError)) {
        setToast(`${failMessage} ${RETRY_MESSAGE}`);
      }
      throw e;
    }
  };

  const progressIndex = PROGRESS_STEPS.findIndex((item) => item === step);

  const handleBack = () => {
    if (progressIndex === 0) navigate("/login");
    else setStep(PROGRESS_STEPS[progressIndex - 1]);
  };

  return (
    <AuthLayout
      top={
        progressIndex >= 0 && (
          <StepProgress step={progressIndex + 1} total={PROGRESS_STEPS.length} onBack={handleBack} />
        )
      }
    >
      {toast && <ErrorToast message={toast} onClose={closeToast} />}
      {step === "email" && (
        <EmailInputStep
          title="계정을 만들어볼까요?"
          subtitle="Create your account"
          description="이메일을 입력하고 회원가입을 시작하세요."
          submitLabel="다음"
          loginPrompt="이미 계정이 있으신가요?"
          initialEmail={email}
          onNext={(value) =>
            request(async () => {
              await sendSignupCode(value);
              setEmail(value);
              setStep("code");
            }, "인증번호를 보내지 못했어요.")
          }
        />
      )}
      {step === "code" && (
        <VerifyCodeStep
          email={email}
          description="입력하신 이메일로 인증번호를 보냈어요."
          onVerify={(value) =>
            request(async () => {
              await verifySignupCode(email, value);
              setStep("password");
            }, "인증번호를 확인하지 못했어요.")
          }
          onResend={() => request(() => sendSignupCode(email), "인증번호를 보내지 못했어요.")}
        />
      )}
      {step === "password" && (
        <NewPasswordStep
          title="비밀번호를 설정해주세요"
          subtitle="Create a password"
          passwordLabel="비밀번호 · Password"
          confirmLabel="비밀번호 확인 · Confirm password"
          submitLabel="다음"
          initialPassword={password}
          onSubmit={async (value) => {
            setPassword(value);
            setStep("name");
          }}
        />
      )}
      {step === "name" && (
        <NameStep
          initialName={name}
          onNext={(value) => {
            setName(value);
            setStep("profile");
          }}
        />
      )}
      {step === "profile" && (
        <ProfileStep
          name={name}
          photo={photo}
          onPhotoChange={setPhoto}
          onSubmit={() =>
            request(async () => {
              await signup({ email, password, name, photo: photo?.file });
              setStep("done");
            }, "가입하지 못했어요.")
          }
        />
      )}
      {step === "done" && (
        <DoneStep
          icon={done}
          title="가입이 완료되었어요"
          subtitle="You're all set!"
          description="이제 한국에서 필요한 가이드를 바로 확인할 수 있어요."
          buttonLabel="계속하기"
          onDone={() => setStep("language")}
        />
      )}
      {step === "language" && <LanguageStep onNext={() => navigate("/login", { replace: true })} />}
    </AuthLayout>
  );
}
