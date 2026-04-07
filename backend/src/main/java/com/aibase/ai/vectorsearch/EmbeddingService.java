package com.aibase.ai.vectorsearch;

import com.aibase.common.exception.BusinessException;
import com.anthropic.client.AnthropicClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 텍스트 → 벡터 임베딩 변환 서비스.
 *
 * Anthropic은 현재 공식 Embedding API를 제공하지 않으므로,
 * Claude를 활용한 의미 기반 임베딩을 시뮬레이션하거나
 * OpenAI text-embedding-3-small 등 외부 임베딩 API와 연동한다.
 *
 * 이 구현은 간단한 TF-IDF 기반 벡터 시뮬레이션을 제공하며,
 * 실제 프로덕션에서는 OpenAI/Cohere 임베딩 API로 교체를 권장한다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingService {

    @Value("${anthropic.embedding.dimensions:1536}")
    private int dimensions;

    /**
     * 텍스트를 float[] 벡터로 변환.
     *
     * 현재: 해시 기반 결정론적 시뮬레이션 (데모/테스트용)
     * 프로덕션: OpenAI text-embedding-3-small API 연동 권장
     */
    public float[] embed(String text) {
        if (text == null || text.isBlank()) {
            throw new BusinessException("임베딩할 텍스트가 비어있습니다", HttpStatus.BAD_REQUEST);
        }

        // 프로덕션 전환 시 아래 주석 해제 + openai SDK 추가
        // return callOpenAiEmbedding(text);

        return simulateEmbedding(text);
    }

    /**
     * 코사인 유사도 계산 (0~1, 1에 가까울수록 유사)
     */
    public double cosineSimilarity(float[] a, float[] b) {
        if (a.length != b.length) return 0.0;

        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA == 0 || normB == 0) return 0.0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * float[] → DB 저장용 문자열 (pgvector 형식: "[0.1,0.2,...]")
     */
    public String toVectorString(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            sb.append(vector[i]);
            if (i < vector.length - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * DB 저장 문자열 → float[]
     */
    public float[] fromVectorString(String vectorStr) {
        if (vectorStr == null || vectorStr.isBlank()) return new float[0];
        String cleaned = vectorStr.replaceAll("[\\[\\]]", "");
        String[] parts = cleaned.split(",");
        float[] result = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Float.parseFloat(parts[i].trim());
        }
        return result;
    }

    /**
     * 시뮬레이션 임베딩 — 해시 기반 결정론적 벡터 생성.
     * 실제 의미론적 유사도를 반영하지 않음 (데모용).
     */
    private float[] simulateEmbedding(String text) {
        String normalized = text.toLowerCase().trim();
        List<String> tokens = tokenize(normalized);

        float[] vector = new float[dimensions];
        for (String token : tokens) {
            int hash = token.hashCode();
            for (int i = 0; i < dimensions; i++) {
                vector[i] += (float) Math.sin(hash * (i + 1) * 0.001);
            }
        }

        // L2 정규화
        float norm = 0;
        for (float v : vector) norm += v * v;
        norm = (float) Math.sqrt(norm);
        if (norm > 0) {
            for (int i = 0; i < dimensions; i++) vector[i] /= norm;
        }

        log.debug("임베딩 생성 완료 — 텍스트 길이: {}, 토큰 수: {}", text.length(), tokens.size());
        return vector;
    }

    private List<String> tokenize(String text) {
        List<String> tokens = new ArrayList<>();
        for (String word : text.split("[\\s\\p{Punct}]+")) {
            if (!word.isBlank() && word.length() > 1) {
                tokens.add(word);
            }
        }
        return tokens;
    }
}
