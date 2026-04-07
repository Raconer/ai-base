package com.aibase.ai.vectorsearch;

import com.aibase.ai.vectorsearch.dto.SemanticSearchRequest;
import com.aibase.ai.vectorsearch.dto.SemanticSearchResult;
import com.aibase.domain.pdf.entity.PdfDocument;
import com.aibase.domain.pdf.repository.PdfDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * 시맨틱 검색 서비스 — pgvector 기반 코사인 유사도 검색.
 *
 * 현재: 인메모리 유사도 계산 (데모/테스트용)
 * 프로덕션: PostgreSQL pgvector의 <=> 연산자 사용 권장
 *
 * 실제 pgvector SQL:
 * SELECT *, 1 - (embedding <=> '[query_vector]'::vector) AS similarity
 * FROM pdf_documents ORDER BY embedding <=> '[query_vector]'::vector LIMIT 5;
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class VectorSearchService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final EmbeddingService embeddingService;

    /**
     * 쿼리 텍스트와 가장 유사한 PDF 청크를 반환.
     */
    public List<SemanticSearchResult> search(SemanticSearchRequest request) {
        int topK = request.topK() > 0 ? request.topK() : 5;
        float[] queryVector = embeddingService.embed(request.query());

        List<PdfDocument> candidates = fetchCandidates(request.type());

        List<SemanticSearchResult> results = new ArrayList<>();
        for (PdfDocument doc : candidates) {
            if (doc.getChunkText() == null) continue;

            // 청크 텍스트로 임시 벡터 생성 (실제로는 DB 저장 벡터 사용)
            float[] docVector = embeddingService.embed(doc.getChunkText());
            double similarity = embeddingService.cosineSimilarity(queryVector, docVector);

            if (similarity > 0.3) {  // 임계값 필터
                results.add(new SemanticSearchResult(
                        doc.getId(),
                        doc.getFilename(),
                        doc.getChunkIndex(),
                        doc.getChunkText(),
                        similarity,
                        doc.getResume() != null ? doc.getResume().getId() : null,
                        doc.getPost() != null ? doc.getPost().getId() : null,
                        doc.getResume() != null ? "resume" : "post"
                ));
            }
        }

        results.sort(Comparator.comparingDouble(SemanticSearchResult::similarity).reversed());
        List<SemanticSearchResult> topResults = results.stream().limit(topK).toList();

        log.info("시맨틱 검색 완료 — 쿼리: '{}', 후보: {}개, 결과: {}개",
                request.query(), candidates.size(), topResults.size());

        return topResults;
    }

    /**
     * PDF 임베딩 저장 (PDF 업로드 후 호출)
     */
    @Transactional
    public void indexDocument(Long documentId) {
        pdfDocumentRepository.findById(documentId).ifPresent(doc -> {
            if (doc.getChunkText() != null) {
                // 실제 pgvector 구현 시: UPDATE pdf_documents SET embedding = ? WHERE id = ?
                // 현재는 시뮬레이션이므로 별도 저장 없음
                log.info("문서 인덱싱 (시뮬레이션) — documentId: {}", documentId);
            }
        });
    }

    private List<PdfDocument> fetchCandidates(String type) {
        if ("resume".equals(type)) {
            return pdfDocumentRepository.findAll().stream()
                    .filter(d -> d.getResume() != null)
                    .toList();
        } else if ("post".equals(type)) {
            return pdfDocumentRepository.findAll().stream()
                    .filter(d -> d.getPost() != null)
                    .toList();
        }
        return pdfDocumentRepository.findAll();
    }
}
