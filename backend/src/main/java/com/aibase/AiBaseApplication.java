package com.aibase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AiBaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiBaseApplication.class, args);
    }
}
