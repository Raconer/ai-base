package com.aibase.common.security;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

@Getter
public class JwtUserDetails extends User {

    private final Long userId;

    public JwtUserDetails(Long userId, String email,
                          List<SimpleGrantedAuthority> authorities) {
        super(email, "", authorities);
        this.userId = userId;
    }
}
