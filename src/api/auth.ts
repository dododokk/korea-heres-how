import {
  mockLogin,
  mockResetPassword,
  mockSendResetCode,
  mockSendSignupCode,
  mockSignup,
  mockVerifyCode,
} from "./mocks/auth";

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

// 비밀번호 찾기에서 인증번호가 틀렸을 때 던지는 오류
export class InvalidCodeError extends Error {
  constructor() {
    super("인증번호가 올바르지 않아요");
    this.name = "InvalidCodeError";
  }
}

// 회원가입 때 이미 가입된 이메일이면 던지는 오류
export class EmailTakenError extends Error {
  constructor() {
    super("이미 가입된 이메일이에요");
    this.name = "EmailTakenError";
  }
}

// 회원가입 때 보내는 값 (백엔드와 필드 확정 전)
export type SignupRequest = {
  email: string;
  password: string;
  name: string;
  photo?: File;
};

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

// 비밀번호 찾기 인증번호 보내기. 서버(안): POST /auth/password-reset/code { email } — 경로·형식은 백엔드와 협의 필요
export async function sendResetCode(email: string): Promise<void> {
  if (USE_MOCK) return mockSendResetCode();

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/password-reset/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`인증번호를 보내지 못했어요 (${res.status})`);
}

// 인증번호 확인. 서버(안): POST /auth/password-reset/verify { email, code }
export async function verifyResetCode(email: string, code: string): Promise<void> {
  if (USE_MOCK) return mockVerifyCode(code);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/password-reset/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (res.status === 400) throw new InvalidCodeError();
  if (!res.ok) throw new Error(`인증번호를 확인하지 못했어요 (${res.status})`);
}

// 새 비밀번호로 변경. 서버(안): POST /auth/password-reset { email, code, password }
export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  if (USE_MOCK) return mockResetPassword();

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
  });
  if (!res.ok) throw new Error(`비밀번호를 바꾸지 못했어요 (${res.status})`);
}

// 회원가입 인증번호 보내기. 이미 가입된 이메일이면 EmailTakenError.
// 서버(안): POST /auth/signup/code { email } — 경로·형식은 백엔드와 협의 필요
export async function sendSignupCode(email: string): Promise<void> {
  if (USE_MOCK) return mockSendSignupCode(email);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (res.status === 409) throw new EmailTakenError();
  if (!res.ok) throw new Error(`인증번호를 보내지 못했어요 (${res.status})`);
}

// 회원가입 인증번호 확인. 서버(안): POST /auth/signup/verify { email, code }
export async function verifySignupCode(email: string, code: string): Promise<void> {
  if (USE_MOCK) return mockVerifyCode(code);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (res.status === 400) throw new InvalidCodeError();
  if (!res.ok) throw new Error(`인증번호를 확인하지 못했어요 (${res.status})`);
}

// 회원가입. 사진이 있어서 multipart로 보낸다. 서버(안): POST /auth/signup
export async function signup(request: SignupRequest): Promise<void> {
  if (USE_MOCK) return mockSignup();

  const body = new FormData();
  body.append("email", request.email);
  body.append("password", request.password);
  body.append("name", request.name);
  if (request.photo) body.append("photo", request.photo);
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, { method: "POST", body });
  if (res.status === 409) throw new EmailTakenError();
  if (!res.ok) throw new Error(`가입하지 못했어요 (${res.status})`);
}
