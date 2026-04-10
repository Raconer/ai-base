package com.aibase.domain.pdf;

import com.aibase.common.security.JwtTokenProvider;
import com.aibase.domain.pdf.controller.PdfController;
import com.aibase.domain.pdf.dto.PdfDocumentResponse;
import com.aibase.domain.pdf.dto.PdfUploadResponse;
import com.aibase.domain.pdf.service.PdfService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PdfController.class)
class PdfControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PdfService pdfService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private PdfUploadResponse sampleUpload() {
        return new PdfUploadResponse(1L, "test.pdf", 3, "업로드 완료");
    }

    private PdfDocumentResponse sampleChunk() {
        return new PdfDocumentResponse(1L, "test.pdf", 0, "청크 내용", 1L, null, LocalDateTime.now());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/pdf/resume/{id} — 파일 업로드 200 반환")
    void uploadForResume_returns200() throws Exception {
        given(pdfService.uploadForResume(eq(1L), any())).willReturn(sampleUpload());

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "PDF content".getBytes());

        mockMvc.perform(multipart("/api/pdf/resume/1")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.filename").value("test.pdf"))
                .andExpect(jsonPath("$.data.chunkCount").value(3));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/pdf/post/{id} — 파일 업로드 200 반환")
    void uploadForPost_returns200() throws Exception {
        given(pdfService.uploadForPost(eq(1L), any())).willReturn(sampleUpload());

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "PDF content".getBytes());

        mockMvc.perform(multipart("/api/pdf/post/1")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.chunkCount").value(3));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/pdf/resume/{id}/chunks — 청크 목록 200 반환")
    void getResumeChunks_returns200() throws Exception {
        given(pdfService.getChunksByResume(1L)).willReturn(List.of(sampleChunk()));

        mockMvc.perform(get("/api/pdf/resume/1/chunks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].filename").value("test.pdf"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/pdf/post/{id}/chunks — 청크 목록 200 반환")
    void getPostChunks_returns200() throws Exception {
        given(pdfService.getChunksByPost(1L)).willReturn(List.of(sampleChunk()));

        mockMvc.perform(get("/api/pdf/post/1/chunks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }
}
