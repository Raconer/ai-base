---
name: ui-design
description: UI/UX 화면 구성 요청 시 반드시 참조. 폰트·색상·레이아웃·컴포넌트 패턴 정의
---

# AI Base — 디자인 시스템

## 1. 색상 팔레트

### 주요 색상 (Tailwind 클래스 기준)
| 역할 | Light | Dark | 용도 |
|------|-------|------|------|
| **Primary** | `blue-600` | `blue-400` | CTA 버튼, 링크, 활성 탭, 포인트 |
| **Primary Hover** | `blue-700` | `blue-500` | hover 상태 |
| **Primary Bg** | `blue-50` | `blue-900/30` | 태그, 뱃지 배경 |
| **Surface** | `white` | `gray-900` | 카드, 패널 배경 |
| **Surface Alt** | `gray-50` | `gray-800` | 섹션 배경, 교번 행 |
| **Border** | `gray-200` | `gray-700` | 카드·입력 테두리 |
| **Border Strong** | `gray-300` | `gray-600` | 구분선, 포커스 |
| **Text Primary** | `gray-900` | `white` | 제목, 강조 텍스트 |
| **Text Secondary** | `gray-600` | `gray-300` | 본문 |
| **Text Muted** | `gray-400` | `gray-500` | 보조 설명, 날짜 |
| **Error** | `red-500` | `red-400` | 에러 메시지 |
| **Success** | `green-600` | `green-400` | 성공 상태 |

### 그래디언트 패턴
```
히어로/CTA 배경:  bg-linear-to-b from-blue-50 to-white
                  dark:from-gray-900 dark:to-gray-950
CTA 버튼 카드:   bg-linear-to-br from-blue-600 to-indigo-700
아바타/뱃지:     bg-linear-to-br from-blue-400 to-purple-500
```

### 강조 색상 (기능별)
| 기능 | 색상 |
|------|------|
| AI / LLM | `blue-500` |
| PDF / 문서 | `violet-500` |
| 검색 / RAG | `cyan-500` |
| 통계 / 차트 | `orange-500` |
| 멀티에이전트 | `pink-500` |
| 피드백 루프 | `green-500` |

---

## 2. 타이포그래피

### 폰트
- **기본**: `system-ui, 'Segoe UI', Roboto, sans-serif` (CSS `--sans`)
- **코드**: `ui-monospace, Consolas, monospace` (CSS `--mono`)
- **커스텀 웹폰트 미사용** — 시스템 폰트 스택 고수

### 텍스트 스케일 (Tailwind)
| 용도 | 클래스 |
|------|--------|
| 히어로 제목 | `text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight` |
| 섹션 제목 | `text-3xl sm:text-4xl font-bold` |
| 카드 제목 | `text-lg font-semibold` |
| 본문 | `text-sm` / `text-base` |
| 보조 설명 | `text-sm text-gray-500` |
| 뱃지/태그 | `text-xs font-medium` |

---

## 3. 레이아웃 규칙

### 컨테이너 너비
```
전체 너비 섹션 (히어로, 섹션 배경):  w-full (Layout main은 full-width)
콘텐츠 최대 너비:                    max-w-5xl mx-auto px-6   (랜딩)
페이지 콘텐츠:                       max-w-3xl mx-auto px-4   (포트폴리오, 블로그)
대시보드:                            max-w-6xl mx-auto px-4
폼/로그인:                           max-w-md mx-auto
```

### 간격 시스템
```
섹션 간 패딩:     py-20 ~ py-24
카드 내부 패딩:   p-5 ~ p-6
요소 간 간격:     gap-4 ~ gap-6
인라인 간격:      gap-2 ~ gap-3
```

### 반응형 브레이크포인트
- `sm`: 640px — 모바일 → 태블릿
- `md`: 768px — 그리드 2열
- `lg`: 1024px — 그리드 3열, 데스크탑 레이아웃

---

## 4. 컴포넌트 패턴

### 카드
```tsx
// 기본 카드
<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                dark:border-gray-800 p-5 hover:shadow-md transition-all duration-200">

// 인터랙티브 카드 (클릭 가능)
<div className="... hover:border-blue-300 dark:hover:border-blue-700
                hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
```

### 버튼
```tsx
// Primary CTA
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white
                   rounded-xl font-semibold transition-colors">

// Secondary (Ghost)
<button className="px-6 py-3 border border-gray-200 dark:border-gray-700
                   rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800
                   transition-colors">

// Danger
<button className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                   rounded-lg transition-colors">
```

### 뱃지 / 태그
```tsx
// 카테고리 태그
<span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30
                 text-blue-700 dark:text-blue-300 text-xs rounded-full">
  #태그명
</span>

// 상태 뱃지 (공개)
<span className="px-2 py-0.5 bg-green-100 dark:bg-green-900
                 text-green-700 dark:text-green-300 text-xs rounded">
```

### 입력 필드
```tsx
<input className="w-full px-4 py-3 bg-white dark:bg-gray-900
                  border border-gray-200 dark:border-gray-700 rounded-xl
                  text-sm placeholder-gray-400 outline-none
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  transition-colors">
```

### 구분선 섹션
```tsx
// 교번 섹션 배경
<section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/40">
<section className="py-24 px-6">  // 흰 배경 (기본)
```

### 빈 상태 (Empty State)
```tsx
<div className="rounded-2xl border-2 border-dashed border-gray-200
                dark:border-gray-700 p-12 text-center">
  <div className="text-5xl mb-4">✍️</div>
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">제목</h2>
  <p className="text-sm text-gray-500 mb-6">설명</p>
  <button ...>액션</button>
</div>
```

### 로딩 스피너
```tsx
<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent
                rounded-full animate-spin" />
```

---

## 5. 다크모드 규칙

- **모든 컴포넌트**에 `dark:` 접두사 쌍으로 작성
- 배경: `bg-white dark:bg-gray-900` / `bg-gray-50 dark:bg-gray-800`
- 텍스트: `text-gray-900 dark:text-white` / `text-gray-500 dark:text-gray-400`
- 테두리: `border-gray-200 dark:border-gray-700`
- dark: 접두사 없이 단독 색상 클래스 사용 금지

---

## 6. 화면 구성 템플릿

### 랜딩 페이지 섹션 순서
```
1. Hero         — 그래디언트 배경 + 블러 블롭 + 타이틀 + CTA
2. Social Proof — 추천 사용자 카드 (border-t 구분)
3. Features     — 기능 그리드 (gray-50 배경)
4. How it works — 스텝 (흰 배경)
5. CTA          — 그래디언트 카드 (gray-50 배경)
```

### 포트폴리오 페이지 구성
```
1. 프로필 헤더  — 아바타 + 이름 + bio + 편집 버튼
2. 탭 네비게이션 — 홈 / 블로그 / 이력서
3. 콘텐츠 영역  — 글 목록 또는 온보딩 UI
```

### 목록 페이지 구성
```
1. 페이지 헤더  — 제목 + (소유자면) 작성 버튼
2. 카드 리스트  — space-y-3, rounded-xl 카드
3. 빈 상태      — dashed border + 이모지 + 설명 + CTA
```

---

## 7. Tailwind v4 주의사항

아래 deprecated 클래스 사용 금지:
| ❌ 사용 금지 | ✅ 대체 클래스 |
|-------------|--------------|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `w-[600px]` 등 임의값 | `w-150` 등 Tailwind 스케일 |

---

## 8. 파일 위치 가이드

| 작업 | 파일 |
|------|------|
| 전역 CSS 변수 / 폰트 | `frontend/src/index.css` |
| 랜딩 페이지 | `frontend/src/pages/Landing.tsx` |
| 공통 버튼 | `frontend/src/components/ui/Button.tsx` |
| 공통 카드 | `frontend/src/components/ui/Card.tsx` |
| 공통 인풋 | `frontend/src/components/ui/Input.tsx` |
| 헤더/푸터 | `frontend/src/components/layout/` |
| 라우팅 | `frontend/src/App.tsx` |
