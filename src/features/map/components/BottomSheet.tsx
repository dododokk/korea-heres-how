import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const MID_HEIGHT_PX = 290;
// 이 속도(px/ms)보다 빠르게 튕기면 가장 가까운 단계 대신 튕긴 방향의 다음 단계로 간다.
const FLICK_VELOCITY = 0.5;

type Snap = 0 | 1 | 2; // 0: 최소(손잡이 + 제목만), 1: 중간(피그마), 2: 최대(헤더 바로 아래까지)

type BottomSheetProps = {
  count?: number;
  // 시트 위쪽 오른편에 띄워서 시트와 같이 움직일 요소 (AI 버튼 등)
  floating?: ReactNode;
  children?: ReactNode;
};

export default function BottomSheet({
  count,
  floating,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const grabRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    startY: number;
    startHeight: number;
    lastY: number;
    lastTime: number;
    velocity: number;
  }>(null);

  const [size, setSize] = useState({ max: 0, min: 0, mid: 0 });
  const [snap, setSnap] = useState<Snap>(1);
  const [dragHeight, setDragHeight] = useState<number | null>(null);

  // 부모(지도 영역) 높이와 손잡이 + 제목 높이를 재서 각 단계 높이를 정한다. 화면 크기가 바뀌면 다시 잰다.
  useEffect(() => {
    const container = sheetRef.current?.parentElement;
    const grab = grabRef.current;
    if (!container || !grab) return;

    const measure = () => {
      const remScale = Math.min(
        parseFloat(getComputedStyle(document.documentElement).fontSize) / 16,
        1,
      );
      const max = container.clientHeight;
      const min = Math.min(grab.offsetHeight + 1, max);
      setSize({
        max,
        min,
        mid: Math.min(Math.max(MID_HEIGHT_PX * remScale, min), max),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(grab);
    return () => observer.disconnect();
  }, []);

  const heights = [size.min, size.mid, size.max];
  const height = dragHeight ?? heights[snap];

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startY: e.clientY,
      startHeight: height,
      lastY: e.clientY,
      lastTime: e.timeStamp,
      velocity: 0,
    };
    setDragHeight(height);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dt = e.timeStamp - d.lastTime;
    if (dt > 0) d.velocity = (d.lastY - e.clientY) / dt;
    d.lastY = e.clientY;
    d.lastTime = e.timeStamp;
    setDragHeight(
      Math.min(
        Math.max(d.startHeight + d.startY - e.clientY, size.min),
        size.max,
      ),
    );
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d || dragHeight === null) return;
    drag.current = null;

    let next: Snap;
    if (Math.abs(d.velocity) > FLICK_VELOCITY) {
      const above = heights.findIndex((h) => h > dragHeight);
      const below = heights.findLastIndex((h) => h < dragHeight);
      next = (
        d.velocity > 0 ? (above === -1 ? 2 : above) : below === -1 ? 0 : below
      ) as Snap;
    } else {
      next = heights.reduce(
        (best, h, i) =>
          Math.abs(h - dragHeight) < Math.abs(heights[best] - dragHeight)
            ? i
            : best,
        0,
      ) as Snap;
    }
    setSnap(next);
    setDragHeight(null);
  };

  return (
    <div
      ref={sheetRef}
      className={`absolute inset-x-0 bottom-0 z-20 flex h-full flex-col rounded-t-[min(0.875rem,14px)] border-t border-[rgba(43,33,24,0.06)] bg-[#FBF5EE] drop-shadow-[0_-8px_12px_rgba(43,33,24,0.06)] ${
        dragHeight === null ? "transition-transform duration-300 ease-out" : ""
      }`}
      // 시트 자체는 지도 영역 높이만큼 크게 두고, 보여줄 높이만큼만 위로 올린다.
      style={{ transform: `translateY(calc(100% - ${height}px))` }}
    >
      {floating && (
        <div className="absolute right-[min(1rem,16px)] bottom-[calc(100%+min(1rem,16px))]">
          {floating}
        </div>
      )}
      <div
        ref={grabRef}
        className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="flex justify-center pt-[min(0.625rem,10px)] pb-[min(0.375rem,6px)]">
          <span className="h-[min(0.25rem,4px)] w-[min(2.5rem,40px)] rounded-full bg-[rgba(43,33,24,0.15)]" />
        </div>
        <div className="px-[min(1rem,16px)] pb-[min(0.5rem,8px)]">
          <h2 className="font-['Fraunces','Noto_Serif_KR',serif] text-[min(1rem,16px)] font-semibold leading-[min(1.25rem,20px)] tracking-[-0.025em] text-[#2B2118]">
            내 주변 장소
          </h2>
          <p className="mt-[min(0.125rem,2px)] font-['Roboto',sans-serif] text-[min(0.65625rem,10.5px)] leading-[min(0.8203rem,13.125px)] text-[rgba(43,33,24,0.45)]">
            Nearby places
            {count !== undefined && (
              <>
                {" · "}
                <span className="font-medium text-[#E07A5F]">{count}</span>곳
              </>
            )}
          </p>
        </div>
      </div>

      {/* 카드 목록 등 내용은 나중에 children으로 넣는다. */}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
