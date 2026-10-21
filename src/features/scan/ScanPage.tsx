import { useCallback, useState } from "react";
import { explainSign, type SignExplanation } from "../../api/scan";
import aiIcon from "../../assets/all/ai.svg";
import AiButton from "../../components/AiButton";
import ErrorToast from "../../components/ErrorToast";
import PhotoPicker from "./components/PhotoPicker";
import PhotoPreview from "./components/PhotoPreview";
import ResultModal from "./components/ResultModal";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

const MAX_LENGTH = 500;
const EXAMPLES = [
  "외부 음식 반입 금지",
  "미끄럼 주의",
  "금연 구역",
  "오늘 휴무",
];
const ONLY_ONE_MESSAGE = "이미지 또는 텍스트 중 하나만 입력할 수 있어요";

// 안내문 해석 화면. 사진 또는 텍스트 중 하나만 입력할 수 있고, 하나라도 있으면 "안내문 해석하기"가 켜진다.
// 이미 하나를 입력한 상태에서 다른 쪽을 누르면 토스트로 알려준다.
// "안내문 해석하기"를 누르면 해석 결과를 받아 팝업(ResultModal)으로 띄운다.
export default function ScanPage() {
  // 나중에 서버에 그대로 올려서(마이페이지 "스캔한 안내문" 사진으로 쓰도록) 원본 File로 들고 있는다.
  const [photo, setPhoto] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);
  const showOnlyOneToast = () => setToast(ONLY_ONE_MESSAGE);

  const hasPhoto = photo !== null;
  const hasText = text !== "";
  const [result, setResult] = useState<SignExplanation | null>(null);
  const [explaining, setExplaining] = useState(false);

  const canSubmit = (hasPhoto || text.trim() !== "") && !explaining;

  const submit = async () => {
    if (!canSubmit) return;
    setExplaining(true);
    try {
      setResult(await explainSign(photo ? { photo } : { text: text.trim() }));
    } catch (e) {
      console.error(e);
      setToast("해석하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setExplaining(false);
    }
  };

  const fillExample = (example: string) => {
    if (hasPhoto) showOnlyOneToast();
    else setText(example);
  };

  return (
    <div className="px-[min(1rem,16px)] pt-[min(1.5rem,24px)] pb-[min(5rem,80px)] font-['Roboto',sans-serif]">
      {toast && (
        <ErrorToast
          message={toast}
          onClose={closeToast}
          topClassName="top-[min(2rem,24px)]"
        />
      )}
      <header className="pb-[min(1.25rem,20px)]">
        <h1 className="text-[min(1.625rem,26px)] leading-[min(2.03rem,32.5px)] font-bold tracking-[-0.025em] text-[#2B2118]">
          안내문 해석
        </h1>
        <p className="pt-[min(0.125rem,2px)] text-[min(0.6875rem,11px)] leading-[min(0.86rem,13.75px)] text-[rgba(43,33,24,0.45)]">
          Sign Scanner
        </p>
        <p className="pt-[min(0.375rem,6px)] text-[min(0.84375rem,13.5px)] leading-[min(1.265625rem,20.25px)] text-[rgba(43,33,24,0.6)]">
          뜻을 모르는 안내문을 발견했나요? 사진을 찍거나 내용을 입력하면, 무슨
          뜻인지 그리고 더 중요한{" "}
          <strong className="font-medium text-[rgba(43,33,24,0.8)]">
            지금 무엇을 해야 하는지
          </strong>
          알려드려요.
        </p>
      </header>

      {/* 사진 */}
      <section className="rounded-[min(0.875rem,14px)] border border-[rgba(43,33,24,0.07)] bg-white p-[min(1.25rem,20px)]">
        {photo ? (
          <PhotoPreview file={photo} onRemove={() => setPhoto(null)} />
        ) : (
          <PhotoPicker
            onSelect={setPhoto}
            locked={hasText}
            onLocked={showOnlyOneToast}
          />
        )}
      </section>

      {/* 구분선 */}
      <div className="flex items-center gap-[min(0.75rem,12px)] py-[min(1.25rem,20px)]">
        <span className="h-px flex-1 bg-[rgba(43,33,24,0.1)]" />
        <span className="text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(43,33,24,0.35)]">
          또는 텍스트로 입력
        </span>
        <span className="h-px flex-1 bg-[rgba(43,33,24,0.1)]" />
      </div>

      {/* 텍스트 */}
      <label className="block">
        <span className="text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.55)]">
          안내문 내용 · Text on the sign
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          // 사진이 있으면 입력을 막고(키보드도 안 뜸), 누를 때마다 토스트를 띄운다.
          readOnly={hasPhoto}
          onClick={hasPhoto ? showOnlyOneToast : undefined}
          maxLength={MAX_LENGTH}
          placeholder="예: 외부 음식 반입 금지"
          className="mt-[min(0.375rem,6px)] block h-[min(5.375rem,86px)] w-full resize-none rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white px-[min(1rem,16px)] py-[min(0.75rem,12px)] text-[min(0.875rem,14px)] leading-[min(1.25rem,20px)] text-[#2B2118] outline-none placeholder:text-[rgba(43,33,24,0.35)]"
        />
      </label>

      <div className="flex items-center justify-between pt-[min(0.5rem,8px)]">
        <span className="text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.4)]">
          {text.length}/{MAX_LENGTH}
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="flex h-[min(3.0859375rem,49.375px)] items-center gap-[min(0.5rem,8px)] rounded-full bg-[#2B2118] px-[min(1.25rem,20px)] disabled:cursor-default disabled:opacity-40"
        >
          <img
            src={aiIcon}
            alt=""
            style={{ width: size(13), height: size(12.5) }}
          />
          <span className="flex flex-col items-start">
            <span className="text-[min(0.84375rem,13.5px)] leading-[min(1.0546875rem,16.875px)] font-medium text-[#F1E6D2]">
              안내문 해석하기
            </span>
            <span className="text-[min(0.625rem,10px)] leading-[min(0.78125rem,12.5px)] font-medium text-[rgba(241,230,210,0.6)]">
              Explain this sign
            </span>
          </span>
        </button>
      </div>

      {/* 예시 */}
      <section className="pt-[min(1rem,16px)]">
        <p className="text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] text-[rgba(43,33,24,0.45)]">
          예시로 해보기
        </p>
        <div className="flex flex-wrap gap-[min(0.5rem,8px)] pt-[min(0.375rem,6px)]">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => fillExample(example)}
              className="flex h-[min(2rem,32px)] items-center rounded-full border border-[rgba(43,33,24,0.1)] bg-[rgba(241,230,210,0.6)] px-[min(0.75rem,12px)] font-['Fraunces',serif] text-[min(0.75rem,12px)] leading-[min(1.125rem,18px)] text-[rgba(43,33,24,0.7)]"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {/* 하단 Nav 위 오른쪽에 떠 있는 AI 버튼 */}
      <div className="fixed right-[min(1rem,16px)] bottom-[calc(min(3.8125rem,61px)+min(1.1875rem,19px)+env(safe-area-inset-bottom))] z-40">
        <AiButton />
      </div>

      {result && <ResultModal result={result} onClose={() => setResult(null)} />}
    </div>
  );
}
