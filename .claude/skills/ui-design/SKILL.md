---
name: ui-design
description: UI/UX 화면 구성 요청 시 반드시 참조. 폰트·색상·레이아웃·컴포넌트 패턴 정의
---

# AI Base — 디자인 시스템

> **현재 테마: 다크 네이비** — 짙은 네이비 배경 기반 다크 테마. 라이트모드 없음.

---

## 1. 색상 팔레트

### 다크 네이비 테마 (기본)

| 역할 | Tailwind 클래스 | hex 참고 | 용도 |
|------|----------------|---------|------|
| **Page BG** | `bg-[#0f1117]` | #0f1117 | 최외각 페이지 배경 |
| **Surface** | `bg-[#1a1f2e]` | #1a1f2e | 카드, 패널 배경 |
| **Surface Alt** | `bg-[#252b3b]` | #252b3b | 중첩 카드, 입력 배경 |
| **Surface Hover** | `bg-[#2d3447]` | #2d3447 | hover 상태 |
| **Border** | `border-[#2a3042]` | #2a3042 | 카드·입력 테두리 |
| **Border Light** | `border-[#353d52]` | #353d52 | 구분선 |
| **Text Primary** | `text-white` | #ffffff | 제목, 강조 |
| **Text Secondary** | `text-[#a8b2c8]` | #a8b2c8 | 본문, 설명 |
| **Text Muted** | `text-[#6b7590]` | #6b7590 | 보조, 날짜, 라벨 |
| **Primary** | `text-[#4f8ef7]` / `bg-[#4f8ef7]` | #4f8ef7 | CTA, 링크, 포인트 |
| **Primary Hover** | `bg-[#3d7ef6]` | #3d7ef6 | 버튼 hover |
| **Primary Dim** | `bg-[#4f8ef7]/10` | — | 태그 배경, 뱃지 |
| **Error** | `text-red-400` | — | 에러 |
| **Success** | `text-emerald-400` | — | 성공 |

### 강조 색상 (기능별)
| 기능 | 색상 |
|------|------|
| AI / LLM | `text-[#4f8ef7]` (blue) |
| PDF / 문서 | `text-violet-400` |
| 검색 / RAG | `text-cyan-400` |
| 통계 / 차트 | `text-orange-400` |
| 멀티에이전트 | `text-pink-400` |
| 피드백 루프 | `text-emerald-400` |

---

## 2. 타이포그래피

### 폰트
- **기본**: `system-ui, 'Segoe UI', Roboto, sans-serif`
- **코드**: `ui-monospace, Consolas, monospace`
- **커스텀 웹폰트 미사용**

### 텍스트 스케일
| 용도 | 클래스 |
|------|--------|
| 히어로 제목 | `text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight` |
| 페이지 제목 | `text-3xl font-bold text-white` |
| 섹션 제목 | `text-xl font-semibold text-white` |
| 카드 라벨 (상단 회색) | `text-xs font-medium text-[#6b7590] uppercase tracking-wider` |
| 카드 제목 | `text-lg font-semibold text-white` |
| 본문 | `text-sm text-[#a8b2c8]` |
| 보조 설명 | `text-xs text-[#6b7590]` |
| 뱃지/태그 | `text-xs font-medium` |

---

## 3. 레이아웃 규칙

### 컨테이너 너비
```
페이지 최대 너비:  max-w-6xl mx-auto px-6
콘텐츠 영역:      max-w-4xl mx-auto px-4
폼/로그인:        max-w-md mx-auto
```

### 간격 시스템
```
섹션 간 패딩:    py-16 ~ py-20
카드 내부 패딩:  p-5 ~ p-6
요소 간 간격:    gap-4 ~ gap-6
인라인 간격:     gap-2 ~ gap-3
```

---

## 4. 컴포넌트 패턴

### 카드
```tsx
// 기본 카드 — 테두리 없음, 배경으로 구분
<div className="bg-[#1a1f2e] rounded-2xl p-5">

// 인터랙티브 카드
<div className="bg-[#1a1f2e] rounded-2xl p-5
                hover:bg-[#252b3b] transition-colors duration-200 cursor-pointer">

// 카드 상단 라벨 패턴 (스크린샷 스타일)
<div className="bg-[#1a1f2e] rounded-2xl p-5">
  <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">섹션 라벨</p>
  <h3 className="text-lg font-semibold text-white">카드 제목</h3>
</div>
```

### 버튼
```tsx
// Primary
<button className="px-5 py-2.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white
                   rounded-xl font-semibold text-sm transition-colors">

// Ghost
<button className="px-5 py-2.5 bg-[#252b3b] hover:bg-[#2d3447] text-[#a8b2c8]
                   rounded-xl font-semibold text-sm transition-colors">

// Danger
<button className="px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
```

### 뱃지 / 태그
```tsx
// 기본 태그
<span className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
  #태그명
</span>

// 상태 뱃지
<span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-400 text-xs rounded font-medium">
  공개
</span>
<span className="px-2 py-0.5 bg-[#6b7590]/20 text-[#6b7590] text-xs rounded font-medium">
  초안
</span>
```

### 입력 필드
```tsx
<input className="w-full px-4 py-3 bg-[#252b3b] border border-[#2a3042]
                  rounded-xl text-sm text-white placeholder-[#6b7590]
                  outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30
                  transition-colors">
```

### 구분선
```tsx
<div className="border-t border-[#2a3042]" />
```

### 빈 상태 (Empty State)
```tsx
<div className="rounded-2xl border-2 border-dashed border-[#2a3042] p-12 text-center">
  <div className="text-5xl mb-4">✍️</div>
  <h2 className="text-lg font-semibold text-white mb-2">제목</h2>
  <p className="text-sm text-[#6b7590] mb-6">설명</p>
</div>
```

### 로딩 스피너
```tsx
<div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent
                rounded-full animate-spin" />
```

### 탭 네비게이션
```tsx
<div className="flex gap-1 bg-[#252b3b] rounded-xl p-1">
  <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium
                     bg-[#1a1f2e] text-white shadow-sm">활성 탭</button>
  <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium
                     text-[#6b7590] hover:text-[#a8b2c8] transition-colors">비활성 탭</button>
</div>
```

---

## 5. 헤더 패턴

```tsx
<header className="bg-[#1a1f2e] border-b border-[#2a3042]">
  <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
    <Link to="/" className="text-lg font-bold text-white">AI Base</Link>
    <nav className="flex items-center gap-5 text-sm">
      <Link className="text-[#a8b2c8] hover:text-white transition-colors">링크</Link>
      <button className="px-4 py-1.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white
                         rounded-lg font-medium text-sm transition-colors">Login</button>
    </nav>
  </div>
</header>
```

---

## 6. 화면 구성 템플릿

### 랜딩 페이지 섹션 순서
```
1. Hero         — 네이비 배경 + 블러 블롭 + 대형 타이틀 + CTA
2. Social Proof — 추천 유저 카드 (border-t 구분)
3. Features     — 기능 그리드 (surface alt 배경)
4. How it works — 스텝 (기본 배경)
5. CTA          — 그래디언트 카드
```

### 대시보드 / 포트폴리오 페이지
```
1. 프로필 헤더  — 아바타 + 이름 + bio
2. 탭 네비게이션
3. 카드 그리드  — 상단 라벨 + 내용
```

### 목록 페이지
```
1. 페이지 헤더  — 제목 + 액션 버튼
2. 카드 리스트  — space-y-3
3. 빈 상태      — dashed border
```

---

## 7. Tailwind v4 주의사항

| ❌ 사용 금지 | ✅ 대체 |
|-------------|--------|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `w-[600px]` 등 임의값 | `w-150` 등 Tailwind 스케일 |
| `dark:` prefix | 불필요 — 전체가 다크 테마 |

> **주의**: 이 프로젝트는 **항상 다크 네이비 테마**. `dark:` prefix, `bg-white`, `bg-gray-*`, `text-gray-900` 등 라이트모드 클래스 사용 금지.

---

## 8. 파일 위치 가이드

| 작업 | 파일 |
|------|------|
| 전역 CSS / 폰트 | `frontend/src/index.css` |
| 랜딩 페이지 | `frontend/src/pages/Landing.tsx` |
| 공통 버튼 | `frontend/src/components/ui/Button.tsx` |
| 공통 카드 | `frontend/src/components/ui/Card.tsx` |
| 공통 인풋 | `frontend/src/components/ui/Input.tsx` |
| 헤더/푸터 | `frontend/src/components/layout/` |
| 라우팅 | `frontend/src/App.tsx` |
