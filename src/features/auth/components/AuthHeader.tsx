import logo from "../../../assets/map/logo.svg";
import LanguageSelect from "../../../components/LanguageSelect";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 로그인 / 회원가입 / 비밀번호 찾기 화면 맨 위 헤더 (로고 + 언어 선택)
export default function AuthHeader() {
  return (
    <header className="flex h-[min(2.5rem,40px)] items-center justify-between">
      <div className="flex items-center gap-[min(0.625rem,10px)]">
        <div className="relative flex size-[min(2.5rem,40px)] items-center justify-center rounded-[min(0.8125rem,13px)] bg-[#E07A5F]">
          <img src={logo} alt="" style={{ width: size(20), height: size(19) }} />
          <span className="absolute -top-[min(0.125rem,2px)] left-[min(2rem,32px)] size-[min(0.625rem,10px)] rounded-full border-2 border-[#FBF5EE] bg-[#A9BBA0]" />
        </div>
        <div>
          <p className="text-[min(1.0625rem,17px)] leading-[min(1.328rem,21.25px)] font-semibold tracking-[-0.025em] text-[#2B2118]">
            여기서는?
          </p>
          <p className="font-['Roboto',sans-serif] text-[min(0.65625rem,10.5px)] leading-[min(0.8203rem,13.125px)] tracking-[0.14em] text-[rgba(43,33,24,0.55)]">
            Korea, Here's How
          </p>
        </div>
      </div>

      <LanguageSelect
        showGlobe
        buttonClassName="h-[min(2.047rem,32.75px)] bg-white text-[min(0.78125rem,12.5px)] leading-[min(1.171875rem,18.75px)]"
      />
    </header>
  );
}
