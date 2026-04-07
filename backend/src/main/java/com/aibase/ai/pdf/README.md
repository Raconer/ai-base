# PDF Pipeline — AI Base

## 개요
PDF 업로드 → 텍스트 추출 → 청킹 → DB 저장 → (벡터 임베딩) 전체 파이프라인.
이력서 PDF 업로드 및 게시글 PDF 첨부를 지원한다.

**출처 프로젝트**: `novel_studio` (멀티스텝 파이프라인) + `stock_traders` (문서 처리)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| PDF 파싱 | Apache PDFBox 3.0.3 |
| 청킹 | 500자 단위 Word-level splitting |
| 저장 | PostgreSQL pdf_documents 테이블 |
| 임베딩 연동 | feature/vector-search의 EmbeddingService |

---

## 파이프라인 흐름

```
PDF 파일 업로드 (MultipartFile)
    │
    ▼
PdfService.uploadForResume() / uploadForPost()
    │
    ├── PDFBox: PDF → 전체 텍스트 추출
    │
    ├── splitIntoChunks(): 500자 단위 청킹
    │
    ├── 기존 청크 삭제 (deleteByResumeId/PostId)
    │
    ├── PdfDocument 엔티티 생성 (chunk별)
    │
    └── DB 저장 (pdf_documents)
              │
              ▼ (옵션 — feature/vector-search 연동)
        EmbeddingService.embed(chunkText)
              │
              ▼
        pdf_documents.embedding 업데이트
```

---

## API 엔드포인트 (domain/pdf에 구현됨)

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/pdf/resume/{resumeId}` | 이력서 PDF 업로드 |
| POST | `/api/pdf/post/{postId}` | 게시글 PDF 업로드 |
| GET | `/api/pdf/resume/{id}/chunks` | 청크 목록 |
| GET | `/api/pdf/post/{id}/chunks` | 청크 목록 |

---

## 청킹 전략

```
전체 텍스트
    │
    ▼ split by 공백/구두점
단어 배열
    │
    ▼ 500자 단위로 그룹핑
청크 0: "첫 번째 500자..."
청크 1: "두 번째 500자..."
...
청크 N: "나머지..."
```

**최적화 팁**: 청크 크기는 임베딩 모델 컨텍스트 윈도우에 맞게 조정.
OpenAI `text-embedding-3-small`은 8191 토큰 지원 → 청크 크기 늘릴 수 있음.

---

## 프론트엔드 컴포넌트 (feature/pdf-pipeline)

- `PdfUploader.tsx`: 드래그&드롭 PDF 업로드 UI
- Resume 페이지에 통합

---

## 확장: PDF 생성 (예정)

이력서 → PDF 변환 다운로드:
```
GET /api/pdf/export/resume/{id}
```
구현 예정: Thymeleaf 템플릿 → PDFBox 렌더링 또는 WeasyPrint.
