import { mockLogin } from "./mocks/auth";

// 로그인에 성공하면 서버가 내려줄 값 (백엔드와 필드 확정 전)
export type LoginResult = {
  token: string;
  email: string;
};

// 이메일 또는 비밀번호가 틀렸을 때 던지는 오류
export class LoginFailedError extends Error {
  constructor() {
    super("아이디나 비밀번호가 틀렸습니다");
    this.name = "LoginFailedError";
  }
}

// [임시] 서버 연결 전까지는 true. 서버가 준비되면 false로 바꾸고 mocks/auth.ts를 지운다.
const USE_MOCK = true;

// 로그인. 서버(안): POST /auth/login { email, password } — 경로·형식은 백엔드와 협의 필요
export async function login(email: string, password: string): Promise<LoginResult> {
  if (USE_MOCK) return mockLogin(email, password);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new LoginFailedError();
  if (!res.ok) throw new Error(`로그인하지 못했어요 (${res.status})`);
  return res.json();
}
