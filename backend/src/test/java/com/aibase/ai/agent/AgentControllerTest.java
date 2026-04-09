package com.aibase.ai.agent;

import com.aibase.ai.agent.dto.AgentRequest;
import com.aibase.ai.agent.dto.AgentResponse;
import com.aibase.common.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AgentController.class)
class AgentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AgentOrchestratorService orchestratorService;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/agent/classify — 정상 요청 시 200 반환")
    void classify_returns200() throws Exception {
        AgentResponse mockResponse = new AgentResponse(
                "tech",
                List.of("spring", "java", "api"),
                "Spring Boot 관련 글입니다.",
                List.of()
        );
        given(orchestratorService.classify(any())).willReturn(mockResponse);

        AgentRequest request = new AgentRequest("Spring Boot로 REST API를 만드는 방법", null);

        mockMvc.perform(post("/api/ai/agent/classify")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.category").value("tech"))
                .andExpect(jsonPath("$.data.tags[0]").value("spring"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/agent/classify — text 비어있으면 400 반환")
    void classify_returns400_whenTextBlank() throws Exception {
        AgentRequest request = new AgentRequest("", null);

        mockMvc.perform(post("/api/ai/agent/classify")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
