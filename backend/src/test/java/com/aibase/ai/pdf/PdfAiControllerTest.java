package com.aibase.ai.pdf;

import com.aibase.ai.pdf.dto.PdfAnalyzeResponse;
import com.aibase.common.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PdfAiController.class)
class PdfAiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PdfAiService pdfAiService;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/pdf/resume/{resumeId}/analyze — 200 반환")
    void analyzeResume_returns200() throws Exception {
        PdfAnalyzeResponse mockResponse = new PdfAnalyzeResponse(
                "{\"summary\":\"Java 백엔드 개발자\",\"keywords\":[\"Spring\",\"JPA\"],\"mainTopics\":[\"백엔드\"]}",
                "resume",
                1500
        );
        given(pdfAiService.analyzeResume(anyLong())).willReturn(mockResponse);

        mockMvc.perform(post("/api/ai/pdf/resume/1/analyze").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.type").value("resume"))
                .andExpect(jsonPath("$.data.analyzedLength").value(1500));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/pdf/resume/{resumeId}/analyze — PDF 없으면 404 반환")
    void analyzeResume_returns404_whenNoPdf() throws Exception {
        given(pdfAiService.analyzeResume(anyLong()))
                .willThrow(new BusinessException("분석할 PDF 청크가 없습니다.", HttpStatus.NOT_FOUND));

        mockMvc.perform(post("/api/ai/pdf/resume/999/analyze").with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/pdf/post/{postId}/analyze — 200 반환")
    void analyzePost_returns200() throws Exception {
        PdfAnalyzeResponse mockResponse = new PdfAnalyzeResponse(
                "{\"summary\":\"기술 블로그 포스트\",\"keywords\":[\"Docker\",\"K8S\"],\"mainTopics\":[\"인프라\"]}",
                "post",
                2000
        );
        given(pdfAiService.analyzePost(anyLong())).willReturn(mockResponse);

        mockMvc.perform(post("/api/ai/pdf/post/1/analyze").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.type").value("post"));
    }
}
