package com.aibase.domain.pdf.service;

import com.aibase.common.exception.BusinessException;
import com.aibase.domain.pdf.dto.PdfDocumentResponse;
import com.aibase.domain.pdf.dto.PdfUploadResponse;
import com.aibase.domain.pdf.entity.PdfDocument;
import com.aibase.domain.pdf.repository.PdfDocumentRepository;
import com.aibase.domain.post.entity.Post;
import com.aibase.domain.post.repository.PostRepository;
import com.aibase.domain.resume.entity.Resume;
import com.aibase.domain.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PdfService {

    private static final int CHUNK_SIZE = 500;

    private final PdfDocumentRepository pdfDocumentRepository;
    private final ResumeRepository resumeRepository;
    private final PostRepository postRepository;

    @Transactional
    public PdfUploadResponse uploadForResume(Long resumeId, MultipartFile file) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new BusinessException("이력서를 찾을 수 없습니다", HttpStatus.NOT_FOUND));

        String fullText = extractText(file);
        List<String> chunks = splitIntoChunks(fullText);

        pdfDocumentRepository.deleteByResumeId(resumeId);

        List<PdfDocument> documents = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            documents.add(PdfDocument.builder()
                    .resume(resume)
                    .filename(file.getOriginalFilename())
                    .originalText(i == 0 ? fullText : null)
                    .chunkIndex(i)
                    .chunkText(chunks.get(i))
                    .build());
        }

        pdfDocumentRepository.saveAll(documents);

        return new PdfUploadResponse(
                documents.get(0).getId(),
                file.getOriginalFilename(),
                chunks.size(),
                "PDF 업로드 및 텍스트 추출이 완료되었습니다"
        );
    }

    @Transactional
    public PdfUploadResponse uploadForPost(Long postId, MultipartFile file) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException("게시글을 찾을 수 없습니다", HttpStatus.NOT_FOUND));

        String fullText = extractText(file);
        List<String> chunks = splitIntoChunks(fullText);

        pdfDocumentRepository.deleteByPostId(postId);

        List<PdfDocument> documents = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            documents.add(PdfDocument.builder()
                    .post(post)
                    .filename(file.getOriginalFilename())
                    .originalText(i == 0 ? fullText : null)
                    .chunkIndex(i)
                    .chunkText(chunks.get(i))
                    .build());
        }

        pdfDocumentRepository.saveAll(documents);

        return new PdfUploadResponse(
                documents.get(0).getId(),
                file.getOriginalFilename(),
                chunks.size(),
                "PDF 업로드 및 텍스트 추출이 완료되었습니다"
        );
    }

    public List<PdfDocumentResponse> getChunksByResume(Long resumeId) {
        return pdfDocumentRepository.findByResumeIdOrderByChunkIndex(resumeId).stream()
                .map(PdfDocumentResponse::from)
                .toList();
    }

    public List<PdfDocumentResponse> getChunksByPost(Long postId) {
        return pdfDocumentRepository.findByPostIdOrderByChunkIndex(postId).stream()
                .map(PdfDocumentResponse::from)
                .toList();
    }

    private String extractText(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new BusinessException("PDF 텍스트 추출에 실패했습니다: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private List<String> splitIntoChunks(String text) {
        List<String> chunks = new ArrayList<>();
        String[] words = text.split("\\s+");
        StringBuilder chunk = new StringBuilder();

        for (String word : words) {
            if (chunk.length() + word.length() > CHUNK_SIZE && chunk.length() > 0) {
                chunks.add(chunk.toString().trim());
                chunk = new StringBuilder();
            }
            chunk.append(word).append(" ");
        }

        if (!chunk.isEmpty()) {
            chunks.add(chunk.toString().trim());
        }

        return chunks.isEmpty() ? List.of(text) : chunks;
    }
}
