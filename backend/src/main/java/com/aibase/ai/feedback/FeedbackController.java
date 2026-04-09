package com.aibase.ai.feedback;

import com.aibase.ai.feedback.dto.FeedbackRequest;
import com.aibase.ai.feedback.dto.FeedbackResponse;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/feedback")
@Tag(name = "AI - Adaptive Feedback", description = "적응형 피드백 루프 (평가→개선→재평가)")
public class FeedbackController {

    private final FeedbackLoopService feedbackService;

    public FeedbackController(FeedbackLoopService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/run")
    @Operation(summary = "피드백 루프 실행", description = "작성→AI평가→수정→재평가 반복 (최대 5회)")
    public ResponseEntity<ApiResponse<FeedbackResponse>> run(
            @Valid @RequestBody FeedbackRequest request) {

        FeedbackResponse response = feedbackService.run(request);
        return ResponseEntity.ok(ApiResponse.ok("피드백 루프가 완료되었습니다", response));
    }
}
