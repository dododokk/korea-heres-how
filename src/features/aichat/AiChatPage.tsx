import { useEffect, useRef, useState } from "react";
import { type AiAnswer, askAi } from "../../api/aichat";
import AnswerCard from "./components/AnswerCard";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import SuggestionChips from "./components/SuggestionChips";
import TypingIndicator from "./components/TypingIndicator";

const GREETING =
  "안녕하세요, 한국 여행 도우미예요. 여기서 어떻게 행동하면 되는지 무엇이든 물어보세요 — 짧고 친절하게 알려드릴게요.";

type Message =
  | { id: number; from: "user"; text: string }
  | { id: number; from: "ai"; answer: AiAnswer }
  | { id: number; from: "error"; text: string };

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  // 답변을 기다리는 중 (점점점 표시, 보내기 막기)
  const [waiting, setWaiting] = useState(false);
  const nextId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지나 점점점이 생기면 맨 아래로 스크롤한다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, waiting]);

  const send = async (question: string) => {
    if (waiting) return;
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text: question }]);
    setWaiting(true);
    try {
      const answer = await askAi(question);
      setMessages((prev) => [...prev, { id: nextId.current++, from: "ai", answer }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, from: "error", text: "답변을 받지 못했어요. 잠시 후 다시 물어봐 주세요." },
      ]);
    } finally {
      setWaiting(false);
    }
  };

  return (
    // 화면 높이에서 하단 Nav(App의 main 아래 여백)만큼 뺀 높이를 헤더 + 대화 + 입력창이 나눠 쓴다.
    <div className="flex h-[calc(100svh-min(3.8125rem,61px)-env(safe-area-inset-bottom))] flex-col">
      <ChatHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[min(1rem,16px)] px-[min(1rem,16px)] py-[min(1.25rem,20px)]">
          <MessageBubble from="ai">{GREETING}</MessageBubble>

          {/* 추천 질문은 대화를 시작하기 전에만 보여준다. */}
          {messages.length === 0 && <SuggestionChips onSelect={send} />}

          {messages.map((message) => {
            if (message.from === "ai") return <AnswerCard key={message.id} answer={message.answer} />;
            if (message.from === "error")
              return (
                <MessageBubble key={message.id} from="ai">
                  {message.text}
                </MessageBubble>
              );
            return (
              <MessageBubble key={message.id} from="user">
                {message.text}
              </MessageBubble>
            );
          })}

          {waiting && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={send} sendDisabled={waiting} />
    </div>
  );
}
