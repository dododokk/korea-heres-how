import type { Place, PlaceDetail } from "../places";
import { getMockNearbyPlaces } from "./places";

// [임시] 서버가 준비되기 전까지는 어느 장소든 위쪽 정보(이름·분류·상태·거리)만 그 장소 것이고,
// 아래 상세 내용은 피그마의 북촌한옥마을 내용을 같이 쓴다.
const BUKCHON_DETAIL: Omit<PlaceDetail, keyof Place | "favorite"> = {
  highlight: "주민이 실제로 사는 곳",
  description: "두 궁궐 사이의 언덕에 자리한 전통 한옥 마을. 실제 주거지이니 조용히 걸어주세요.",
  remember: [
    { text: "실제 주민이 사는 주거지역이에요", textEn: "People actually live here." },
    { text: "골목에서는 조용히 해주세요", textEn: "Keep quiet in the alleys." },
    { text: "주민이나 집 내부 촬영은 피해주세요", textEn: "Avoid photographing residents or inside homes." },
  ],
  confusions: [
    {
      question: "이건 관광지인가 동네인가?",
      answer: "둘 다예요. 유명한 골목이지만 여기는 실제 주민이 사는 주거지예요. 세트장이 아닙니다.",
    },
    {
      question: "닫힌 대문, 들어가도 되나?",
      answer: "닫힌 나무 대문은 대부분 사유 주택이에요. 열린 표시가 있는 곳만 들어가주세요.",
    },
    {
      question: "사진을 왜 못 찍어요?",
      answer: "밤에는 사생활·소음 민원 때문에 야간 촬영이 제한돼요. 사람을 직접 찍는 것도 실례예요.",
    },
  ],
  steps: [
    "북촌문화센터에서 시작하세요",
    "표시된 길을 따라 천천히 내려가세요",
    "사진은 지정된 명소에서 찍으세요",
    "이른 아침이나 늦은 오후를 노리세요",
    "골목에서는 목소리를 낮추세요",
  ],
  cautions: [
    "여기는 실제 주거지예요. 통화·대화 소리를 낮춰주세요.",
    "야간 촬영과 주민 촬영은 삼가주세요.",
    "닫힌 대문은 사유 공간일 수 있어요. 함부로 열지 마세요.",
  ],
  // 들을 수 있는 말은 디자인에 없어서 임시로 채운 문장
  phrasesHear: [
    {
      id: "bukchon-hear-quiet",
      korean: "조용히 해 주세요.",
      romanization: "jo-yong-hi hae ju-se-yo.",
      english: "Please be quiet.",
    },
    {
      id: "bukchon-hear-private",
      korean: "여기는 개인 집이에요.",
      romanization: "yeo-gi-neun gae-in ji-bi-e-yo.",
      english: "This is a private home.",
    },
    {
      id: "bukchon-hear-no-photo",
      korean: "사진 찍지 마세요.",
      romanization: "sa-jin jjik-ji ma-se-yo.",
      english: "Please don't take photos.",
    },
  ],
  phrasesSay: [
    {
      id: "bukchon-say-quiet",
      korean: "조용히 하겠습니다.",
      romanization: "jo-yong-hi ha-get-seum-ni-da.",
      english: "I will keep quiet.",
    },
    {
      id: "bukchon-say-photo",
      korean: "사진 찍어도 되나요?",
      romanization: "sa-jin jjik-eo-do doe-na-yo?",
      english: "Is it okay to take a photo?",
    },
    {
      id: "bukchon-say-excuse",
      korean: "실례합니다.",
      romanization: "sil-lye-ham-ni-da.",
      english: "Excuse me.",
    },
    {
      id: "bukchon-say-route",
      korean: "어디로 가면 좋아요?",
      romanization: "eo-di-ro ga-myeon jo-a-yo?",
      english: "Which way is the good route?",
    },
  ],
  info: {
    about:
      "북촌은 경복궁과 창덕궁 사이에 있는, 사람들이 실제로 사는 한옥 주거지입니다. 좁은 골목에서 유명한 풍경을 볼 수 있지만, 지나치는 모든 집에 주민이 살고 있습니다.",
    location: "서울 종로구 가회동",
    hours: "거리 24시간 개방 · 오후 5시 이후 정숙",
    closed: "휴무 없음",
    admission: "무료 (거리는 공공 공간)",
    parking: "주차 불가 — 도보나 버스 이용",
  },
};

export async function getMockPlaceDetail(id: string): Promise<PlaceDetail> {
  const place = (await getMockNearbyPlaces()).find((item) => item.contentid === id);
  if (!place) throw new Error("장소를 찾을 수 없어요");
  return { ...place, ...BUKCHON_DETAIL, favorite: false };
}
