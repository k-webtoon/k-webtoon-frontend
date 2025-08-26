---

# k-webtoon-frontend

웹툰 **탐색 · 상세 · 검색** UI를 제공하는 프론트엔드.
백엔드([k-webtoon-backend](https://github.com/k-webtoon/k-webtoon-backend)) API와 연동합니다.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=fff" />
  <img alt="Router" src="https://img.shields.io/badge/React%20Router-6-CA4245?logo=reactrouter&logoColor=fff" />
  <img alt="State" src="https://img.shields.io/badge/Zustand-🐻-000000" />
  <img alt="Axios" src="https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=fff" />
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=fff" />
</p>

---

## ✨ 주요 기능

* 작품 **카드 리스트**(+ 무한 스크롤)
* 작품 **상세 페이지**(메타/장르/에피소드)
* **검색**(키워드·정렬·필터 확장 예정)
* 공통 레이아웃/에러 처리/환경변수 기반 API 연동

---

## 🚀 빠른 시작

```bash
# 패키지 설치
pnpm i          # or npm i / yarn

# 개발 서버
pnpm dev        # http://localhost:5173

# 빌드 / 프리뷰
pnpm build
pnpm preview
```

**환경변수**

```bash
# .env (예시)
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🧱 폴더 구조(권장)

```
src/
  app/               # 라우터 등 앱 레벨
  components/        # 공용 UI 컴포넌트
  features/
    works/           # 작품 도메인
      api.ts         # API 함수
      types.ts       # 타입 정의
      store.ts       # Zustand 스토어
      pages/
        WorksListPage.tsx
        WorkDetailPage.tsx
    search/
      pages/
        SearchPage.tsx
  libs/
    axios.ts         # axios 인스턴스
  styles/
    globals.css
  main.tsx
```

---

## 🔌 API 연동 규약(예시)

* `GET /works` → `WorkSummary[]`
* `GET /works/{id}` → `WorkDetail`

```ts
// src/features/works/types.ts
export interface WorkSummary {
  id: string; title: string; thumbnailUrl: string;
  genres: string[]; rating: number;
}
export interface WorkDetail extends WorkSummary {
  description: string; authors: string[];
  episodes: { id: string; title: string; number: number }[];
}
```

---

## 🧪 품질 도구(선택)

```bash
pnpm lint     # ESLint
pnpm format   # Prettier
```

---

## 🗺 로드맵

* [ ] 리스트 무한 스크롤 최적화(IntersectionObserver)
* [ ] 상세 페이지 스켈레톤/에러 경계
* [ ] 검색 정렬·필터(장르/평점)
* [ ] 접근성 점검(ARIA) 및 다크 테마

---

## 🤝 연락/참고

* 백엔드: [k-webtoon-backend](https://github.com/k-webtoon/k-webtoon-backend)
* 조직: [k-webtoon](https://github.com/k-webtoon)

---

필요하면 **배지/섹션 최소화 버전**도 바로 줄게. 지금 이 버전에서 링크만 네 계정/조직에 맞게 바꾸면 딱 깔끔하다, 행님.
