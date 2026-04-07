# AI Base — Frontend CLAUDE.md

## 프로젝트 개요
React 19 + Vite + TypeScript 기반 포트폴리오 SPA.

## 기술 스택
- React 19 / TypeScript 5
- Vite 6 (번들러)
- TailwindCSS 4 (스타일링)
- React Router DOM 7 (라우팅)
- Zustand 5 (전역 상태)
- TanStack React Query 5 (서버 상태)
- Axios 1 (HTTP 클라이언트)
- Recharts 2 (차트 - AI feature 브랜치에서 활용)

---

## 디렉토리 구조
```
src/
├── lib/api.ts          Axios 인스턴스 (인터셉터 포함)
├── stores/
│   ├── authStore.ts    JWT 인증 상태 (persist)
│   └── themeStore.ts   다크모드 상태 (persist)
├── components/
│   ├── layout/         Header, Footer, Layout
│   └── ui/             Button, Input, Card, Modal
└── pages/
    ├── Home.tsx
    ├── Blog.tsx
    ├── PostDetail.tsx
    ├── PostEditor.tsx
    ├── Resume.tsx
    ├── Search.tsx
    ├── About.tsx
    ├── Login.tsx
    └── Dashboard.tsx
```

---

## 컨벤션

### API 호출
- 항상 `src/lib/api.ts`의 axios 인스턴스 사용
- React Query로 서버 상태 관리
- 응답 구조: `res.data.data` (ApiResponse<T>)

### 상태 관리
- 서버 상태: React Query
- 클라이언트 전역 상태: Zustand (authStore, themeStore)
- 로컬 상태: useState

### 컴포넌트 패턴
- UI 컴포넌트는 `src/components/ui/`에 배치
- 페이지 컴포넌트는 `src/pages/`에 배치
- 공통 타입은 파일 내부에 `interface` 또는 `type`으로 선언

### 스타일링
- TailwindCSS 4 유틸리티 클래스 사용
- 다크모드: `dark:` prefix
- 공통 컴포넌트(Card, Button 등) 우선 사용

---

## 로컬 실행
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

백엔드 프록시: `/api` → `http://localhost:8080`
