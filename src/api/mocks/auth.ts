import { InvalidCodeError, LoginFailedError, type LoginResult } from "../auth";

// [임시] 서버가 준비되기 전까지 이 테스트 계정으로만 로그인할 수 있다.
const TEST_ACCOUNT = { email: "admin@example.com", password: "password!" };

// [임시] 비밀번호 찾기에서 통과되는 인증번호. 이메일은 가입 여부와 상관없이 모두 통과한다.
const TEST_RESET_CODE = "123456";

const MOCK_DELAY_MS = 500;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

export function mockLogin(email: string, password: string): Promise<LoginResult> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
        resolve({ token: "mock-token", email });
      } else {
        reject(new LoginFailedError());
      }
    }, MOCK_DELAY_MS),
  );
}

export async function mockSendResetCode(): Promise<void> {
  await wait();
}

export async function mockVerifyResetCode(code: string): Promise<void> {
  await wait();
  if (code !== TEST_RESET_CODE) throw new InvalidCodeError();
}

export async function mockResetPassword(): Promise<void> {
  await wait();
}
