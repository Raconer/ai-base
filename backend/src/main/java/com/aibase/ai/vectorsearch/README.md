# Vector Search + RAG — AI Base

## 개요
pgvector를 활용한 시맨틱 검색 및 RAG(Retrieval-Augmented Generation).
PDF 청크를 벡터로 변환해 의미 기반 유사도 검색을 제공한다.

**출처 프로젝트**: `stock_traders` (pgvector 벡터검색, 뉴스 기사 RAG)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| DB | PostgreSQL 16 + pgvector 0.7.x |
| 인덱스 | IVFFlat (코사인 유사도) |
| 임베딩 모델 | 시뮬레이션 (데모) / OpenAI text-embedding-3-small (프로덕션 권장) |
| 차원 | 1536 |

---

## 파일 구조

```
ai/vectorsearch/
├── README.md                   ← 이 파일
├── EmbeddingService.java       ← 텍스트 → 벡터 변환
├── VectorSearchService.java    ← 시맨틱 검색 로직
├── VectorSearchController.java ← REST 엔드포인트
└── dto/
    ├── EmbeddingRequest.java
    ├── SemanticSearchRequest.java
    └── SemanticSearchResult.java
```

---

## API 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/ai/vector/search` | 시맨틱 검색 | ✅ |
| POST | `/api/ai/vector/index/{id}` | 문서 인덱싱 | ✅ |

---

## 아키텍처

```
사용자 쿼리 텍스트
    │
    ▼
EmbeddingService.embed()
    │ float[1536]
    ▼
VectorSearchService.search()
    │
    ├── PDF 청크 로드 (PdfDocumentRepository)
    ├── 각 청크 임베딩 생성
    ├── 코사인 유사도 계산
    ├── 임계값(0.3) 필터
    └── Top-K 정렬 반환
            │
            ▼
    SemanticSearchResult[]
    (documentId, chunkText, similarity, resumeId/postId)
```

---

## pgvector 실제 SQL (프로덕션)

```sql
-- 인덱스 생성 (init.sql에 포함)
CREATE INDEX idx_pdf_embedding ON pdf_documents
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 시맨틱 검색 쿼리
SELECT
    id, filename, chunk_index, chunk_text, resume_id, post_id,
    1 - (embedding <=> '[0.1,0.2,...]'::vector) AS similarity
FROM pdf_documents
WHERE embedding IS NOT NULL
ORDER BY embedding <=> '[0.1,0.2,...]'::vector
LIMIT 5;
```

---

## 프로덕션 전환 방법

### 1. OpenAI 임베딩 API 추가
```gradle
implementation("com.theokanning.openai-gpt3-java:api:0.18.2")
```

### 2. EmbeddingService 교체
```java
// callOpenAiEmbedding() 메서드 활성화
private float[] callOpenAiEmbedding(String text) {
    // OpenAI API 호출
    EmbeddingRequest req = new EmbeddingRequest("text-embedding-3-small", List.of(text));
    return openAiClient.createEmbeddings(req).getData().get(0).getEmbedding();
}
```

### 3. PdfDocument에 embedding 컬럼 활성화
```java
// PdfDocument.java의 주석 해제
@Column(columnDefinition = "vector(1536)")
private float[] embedding;
```

### 4. VectorSearchService의 SQL 쿼리 방식으로 교체

---

## RAG 확장 (LLM + Vector Search)

```
검색 결과(청크들)
    │
    ▼
관련 청크를 컨텍스트로 Claude에 전달
    │
    ▼
Claude가 컨텍스트 기반 답변 생성
```

`feature/adaptive-feedback` 브랜치에서 RAG 기반 글 개선 제안 구현 예정.
