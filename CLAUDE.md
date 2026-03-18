# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 목적

"오늘 점심 뭐먹지?" 고민을 해소하는 뽑기 게임 형태의 웹 서비스. 위치와 음식 장르를 선택하면 주변 식당 중 하나를 랜덤 추천한다.

## 핵심 제약조건

- **운영비 $0 유지**: 무료 티어만 사용 (GitHub Pages 호스팅, 카카오맵 API 일 300,000건)
- **1인 유지보수**: 과도한 추상화·복잡한 아키텍처 금지. 단순하고 읽기 쉬운 코드 유지
- **라이브러리 추가 금지**: 현재 package.json 의존성 외 추가 불가. SSR 프레임워크(Next.js 등), 상태관리(Redux/Zustand), HTTP 클라이언트(Axios), 폼 라이브러리 모두 금지
- **Tailwind CSS only**: 커스텀 CSS 최소화, 모바일 퍼스트 반응형

## Commands

- `npm run dev` - 개발 서버 (port 3000)
- `npm run build` - tsc + vite build
- `npm run lint` - ESLint
- `npm run format` - Prettier

테스트 프레임워크 미설정.

## Architecture

SPA (React + Vite, CSR only, 백엔드 없음). 모든 식당 데이터는 카카오맵 API에서 런타임 조회.

### Data Flow

1. 위치 입력 → `src/lib/kakao-map.ts`의 `addressToCoordinates()` (키워드 검색 우선, 실패 시 주소 검색 fallback)
2. 장르 선택 → `src/lib/restaurant.ts`의 `searchRestaurantsByKeyword()` (반경 1km)
3. `selectRandomRestaurant()`로 랜덤 1개 선택 → 지도 + 카드에 표시

### State

`App.tsx`에서 `useState`로 모든 상태 관리. Context나 외부 상태관리 라이브러리 사용하지 않음.

### Kakao Map SDK

- `loadKakaoMapSDK()`로 동적 스크립트 로딩 (`autoload=false`, `services` 라이브러리 포함)
- `window.kakao`에 전역 선언 (untyped `any`)
- 환경변수: `VITE_KAKAO_MAP_API_KEY` 필수

## Deployment

GitHub Pages. 프로덕션 base path: `/what-launch/`

## 참고 문서

- `docs/specification.md` - 상세 기능 요구사항 (FR/NFR 코드 포함)
- `docs/constitution.md` - 프로젝트 헌장·제약사항
- `docs/plan.md` - 기술 스택 결정 사유·개발 단계별 계획
- `.cursor/rules/rule.md` - 코드 작성 규칙·금지 사항
