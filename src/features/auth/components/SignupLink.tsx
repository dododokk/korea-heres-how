import { Link } from "react-router";

// "아직 계정이 없으신가요? 회원가입"
export default function SignupLink() {
  return (
    <p className="flex justify-center gap-[min(0.5rem,8px)] pt-[min(1.5rem,24px)] font-['Roboto',sans-serif] text-[min(0.8125rem,13px)] leading-[min(1.21875rem,19.5px)]">
      <span className="text-[rgba(43,33,24,0.85)]">아직 계정이 없으신가요?</span>
      <Link to="/signup" className="font-semibold text-[#2B2118] underline">
        회원가입
      </Link>
    </p>
  );
}
