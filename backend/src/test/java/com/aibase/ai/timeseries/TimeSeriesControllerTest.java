package com.aibase.ai.timeseries;

import com.aibase.ai.timeseries.dto.TrendResponse;
import com.aibase.ai.timeseries.dto.VisitorStatDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TimeSeriesController.class)
class TimeSeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimeSeriesService timeSeriesService;

    @Test
    @WithMockUser
    @DisplayName("GET /api/stats/visitors — 200 반환")
    void getVisitors_returns200() throws Exception {
        given(timeSeriesService.getVisitors(anyInt())).willReturn(List.of(
                new VisitorStatDto(LocalDate.of(2026, 4, 1), 100, 70, 120)
        ));

        mockMvc.perform(get("/api/stats/visitors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].pageViews").value(100));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/stats/trend — 200 반환 및 growthRate 포함")
    void getTrend_returns200() throws Exception {
        TrendResponse mockTrend = new TrendResponse(
                List.of(new VisitorStatDto(LocalDate.of(2026, 4, 1), 100, 70, 120)),
                List.of(new TrendResponse.PredictedPoint(LocalDate.of(2026, 4, 10), 130, 90)),
                12.5
        );
        given(timeSeriesService.getTrend(anyInt())).willReturn(mockTrend);

        mockMvc.perform(get("/api/stats/trend"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.growthRate").value(12.5))
                .andExpect(jsonPath("$.data.predicted[0].pageViews").value(130));
    }
}
