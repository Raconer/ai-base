package com.aibase.ai.agent;

import com.aibase.ai.agent.dto.AgentRequest;
import com.aibase.ai.agent.dto.AgentResponse;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/agent")
@Tag(name = "AI - Multi-Agent", description = "멀티 에이전트 파이프라인 (분류→태그→요약)")
public class AgentController {

    private final AgentOrchestratorService orchestratorService;

    public AgentController(AgentOrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
    }

    @PostMapping("/classify")
    @Operation(summary = "자동 분류 + 태그 생성", description = "분류 에이전트→태그 에이전트→요약 에이전트 순차 실행")
    public ResponseEntity<ApiResponse<AgentResponse>> classify(
            @Valid @RequestBody AgentRequest request) {

        AgentResponse response = orchestratorService.classify(request);
        return ResponseEntity.ok(ApiResponse.ok("멀티 에이전트 분류가 완료되었습니다", response));
    }
}
