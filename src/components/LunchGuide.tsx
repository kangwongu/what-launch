import { useState } from 'react'

const sections = [
  {
    title: '직장인 72%가 매일 겪는 점심 고민',
    content:
      "한 설문조사에 따르면 직장인 10명 중 7명 이상이 매일 점심 메뉴를 고르는 데 스트레스를 느낀다고 합니다. 평균 고민 시간은 약 15분. 한 달이면 5시간 이상을 '뭐 먹지?'에 쓰는 셈이죠. 이른바 '결정 피로(Decision Fatigue)'는 하루 동안 내려야 할 선택이 쌓일수록 판단력이 저하되는 현상으로, 점심 메뉴 같은 사소한 결정도 오후 업무 집중력에 영향을 줄 수 있습니다.",
  },
  {
    title: '왜 점심 메뉴 고르기가 어려울까?',
    content:
      "첫째, 선택지가 너무 많습니다. 회사 주변 식당만 수십 곳인데, 매일 새로운 곳을 탐색하기엔 시간이 부족합니다. 둘째, 함께 먹는 사람들의 취향을 맞춰야 할 때 난이도가 급상승합니다. 셋째, '어제 먹은 거 빼고, 너무 멀지 않고, 가격도 적당한…' 같은 조건이 무의식적으로 쌓이면서 선택이 점점 어려워집니다.",
  },
  {
    title: '상황별 장르 추천 팁',
    content:
      '중요한 미팅 전이라면 속이 편한 한식이나 일식이 좋습니다. 팀 회식 느낌을 내고 싶다면 고기류나 중식이 분위기를 띄워줍니다. 가볍게 먹고 싶은 날엔 샐러드나 분식을, 에너지가 필요한 오후라면 든든한 양식을 추천합니다. 날씨도 중요한 힌트인데, 비 오는 날 파전이나 칼국수, 더운 날 냉면이나 초밥처럼 계절감에 맞추면 만족도가 올라갑니다.',
  },
  {
    title: '랜덤 추천, 생각보다 효과적인 이유',
    content:
      "심리학 연구에 따르면 사람은 스스로 내린 선택보다 우연히 주어진 결과에 더 쉽게 만족하는 경향이 있습니다. 랜덤 추천은 '내가 고른 게 최선이었을까?' 하는 후회를 줄여주고, 평소 시도하지 않았을 새로운 맛집을 발견하는 계기가 되기도 합니다. 고민에 쏟는 에너지를 아껴서 정작 중요한 일에 집중해 보세요.",
  },
]

export default function LunchGuide() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <article className="bg-surface-50 rounded-xl border border-surface-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <h2 className="text-sm font-semibold text-gray-700">
          점심 메뉴, 어떻게 고르면 좋을까?
        </h2>
        <span
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-xs font-semibold text-primary-600 mb-1">
                {section.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
