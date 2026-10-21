import type { PlaceDetail } from "../../../api/places";
import admissionIcon from "../../../assets/guide/admission.svg";
import closedIcon from "../../../assets/guide/closed.svg";
import locationIcon from "../../../assets/guide/location.svg";
import openIcon from "../../../assets/guide/open.svg";
import parkingIcon from "../../../assets/guide/parking.svg";
import PlaceMiniMap from "./PlaceMiniMap";

const size = (px: number) => `min(${px / 16}rem, ${px}px)`;

// 관광지 상세 "기본 정보" 탭: 소개 + 위치/운영시간/휴무일/입장료/주차 + 작은 지도
export default function InfoTab({ detail }: { detail: PlaceDetail }) {
  const { info } = detail;
  const rows = [
    { icon: locationIcon, w: 12, h: 14, label: "위치", sub: "Location", value: info.location },
    { icon: openIcon, w: 16, h: 15, label: "운영시간", sub: "Opening hours", value: info.hours },
    { icon: closedIcon, w: 16, h: 15, label: "휴무일", sub: "Closed", value: info.closed },
    { icon: admissionIcon, w: 16, h: 15, label: "입장료", sub: "Admission", value: info.admission },
    { icon: parkingIcon, w: 16, h: 15, label: "주차", sub: "Parking", value: info.parking },
  ];

  return (
    <div>
      <h3 className="text-[min(1rem,16px)] leading-[min(1.5rem,24px)] font-semibold text-[#2B2118]">Basic Information</h3>
      <p className="pt-[min(0.25rem,4px)] text-[min(0.6875rem,11px)] leading-[min(1.03125rem,16.5px)] text-[rgba(43,33,24,0.45)]">
        {info.about}
      </p>

      <div className="mt-[min(0.625rem,10px)] rounded-[min(0.75rem,12px)] border border-[rgba(43,33,24,0.1)] bg-white px-[min(1.0625rem,17px)] py-[min(0.3125rem,5px)]">
        {rows.map(({ icon, w, h, label, sub, value }, i) => (
          <div
            key={label}
            className={`flex items-start gap-[min(0.75rem,12px)] py-[min(0.6875rem,11px)] ${
              i > 0 ? "border-t border-[rgba(43,33,24,0.05)]" : ""
            }`}
          >
            <span className="flex h-[min(1.40625rem,22.5px)] w-[min(1rem,16px)] shrink-0 items-center justify-center pt-[min(0.125rem,2px)]">
              <img src={icon} alt="" className="opacity-55" style={{ width: size(w), height: size(h) }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-[min(0.375rem,6px)]">
                <span className="text-[min(0.71875rem,11.5px)] leading-[min(1.078rem,17.25px)] font-medium text-[rgba(43,33,24,0.55)]">
                  {label}
                </span>
                <span className="text-[min(0.625rem,10px)] leading-[min(0.9375rem,15px)] text-[rgba(43,33,24,0.35)]">
                  {sub}
                </span>
              </p>
              <p className="pt-[min(0.125rem,2px)] text-[min(0.8125rem,13px)] leading-[min(1.117rem,17.875px)] text-[rgba(43,33,24,0.8)]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-[min(1.25rem,20px)]">
        <PlaceMiniMap place={detail} />
      </div>
    </div>
  );
}
