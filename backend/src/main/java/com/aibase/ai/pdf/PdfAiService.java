package com.aibase.ai.pdf;

import com.aibase.ai.pdf.dto.PdfAnalyzeResponse;
import com.aibase.common.exception.BusinessException;
import com.aibase.domain.pdf.entity.PdfDocument;
import com.aibase.domain.pdf.repository.PdfDocumentRepository;
import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PDF AI 분석 서비스.
 * domain/pdf의 PdfService(파싱/저장)와 분리된 AI 분석 레이어.
 * PDF 청크 텍스트를 Claude API로 요약/키워드 추출한다.
 */
@Service
@Transactional(readOnly = true)
public class PdfAiService {

    private static final Logger log = LoggerFactory.getLogger(PdfAiService.class);

    private final PdfDocumentRepository pdfDocumentRepository;
    private final AnthropicClient anthropicClient;

    @Value("${anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    public PdfAiService(PdfDocumentRepository pdfDocumentRepository, AnthropicClient anthropicClient) {
        this.pdfDocumentRepository = pdfDocumentRepository;
        this.anthropicClient = anthropicClient;
    }

    /**
     * 이력서 PDF 전체 내용 AI 요약 + 키워드 추출
     */
    public PdfAnalyzeResponse analyzeResume(Long resumeId) {
        List<PdfDocument> chunks = pdfDocumentRepository.findByResumeIdOrderByChunkIndex(resumeId);
        if (chunks.isEmpty()) {
            throw new BusinessException("분석할 PDF 청크가 없습니다. 먼저 PDF를 업로드하세요.", HttpStatus.NOT_FOUND);
        }
        String fullText = mergeChunks(chunks);
        return analyze(fullText, "resume");
    }

    /**
     * 게시글 PDF 전체 내용 AI 요약 + 키워드 추출
     */
    public PdfAnalyzeResponse analyzePost(Long postId) {
        List<PdfDocument> chunks = pdfDocumentRepository.findByPostIdOrderByChunkIndex(postId);
        if (chunks.isEmpty()) {
            throw new BusinessException("분석할 PDF 청크가 없습니다. 먼저 PDF를 업로드하세요.", HttpStatus.NOT_FOUND);
        }
        String fullText = mergeChunks(chunks);
        return analyze(fullText, "post");
    }

    private PdfAnalyzeResponse analyze(String text, String type) {
        // 너무 길면 앞 3000자만 사용 (토큰 절약)
        String input = text.length() > 3000 ? text.substring(0, 3000) + "..." : text;

        String prompt = String.format("""
                다음 %s 문서를 분석하고 JSON 형식으로 반환해주세요:
                {
                  "summary": "핵심 내용 요약 (3~5문장)",
                  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
                  "mainTopics": ["주제1", "주제2", "주제3"]
                }
                JSON만 반환하세요 (다른 텍스트 없이).

                문서 내용:
                %s
                """, type.equals("resume") ? "이력서" : "게시글 첨부", input);

        try {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.of(model))
                    .maxTokens(512)
                    .addUserMessage(prompt)
                    .build();

            Message message = anthropicClient.messages().create(params);
            String raw = message.content().stream()
                    .filter(b -> b instanceof TextBlock)
                    .map(b -> ((TextBlock) b).text())
                    .findFirst()
                    .orElse("{}");

            String cleanJson = raw.trim()
                    .replaceAll("```json", "").replaceAll("```", "").trim();

            log.info("PDF AI 분석 완료 — type: {}, 입력 길이: {}", type, input.length());
            return new PdfAnalyzeResponse(cleanJson, type, input.length());

        } catch (Exception e) {
            log.error("PDF AI 분석 실패: {}", e.getMessage());
            throw new BusinessException("PDF 분석에 실패했습니다: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private String mergeChunks(List<PdfDocument> chunks) {
        return chunks.stream()
                .map(PdfDocument::getChunkText)
                .collect(Collectors.joining(" "));
    }
}
