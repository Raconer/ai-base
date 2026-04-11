package com.aibase.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenResponse {

    private final String accessToken;
    private final String refreshToken;
    private final Long id;
    private final String email;
    private final String username;
    private final String name;
    private final String role;
}
