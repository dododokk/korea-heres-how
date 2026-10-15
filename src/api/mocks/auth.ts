import { LoginFailedError, type LoginResult } from "../auth";

// [임시] 서버가 준비되기 전까지 이 테스트 계정으로만 로그인할 수 있다.
const TEST_ACCOUNT = { email: "admin@example.com", password: "password!" };

const MOCK_DELAY_MS = 500;

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
