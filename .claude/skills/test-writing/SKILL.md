---
name: test-writing
description: JUnit 5 + Mockito 테스트 코드 작성 시 사용
---

# 테스트 작성 규칙

이 프로젝트: **Java 21 + Spring Boot 3.4 + JUnit 5 + Mockito**

## Controller 테스트 (@WebMvcTest)

```java
@WebMvcTest(PostController.class)
class PostControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean PostService postService;
    @MockBean JwtTokenProvider jwtTokenProvider;  // Security filter용 필수

    private JwtUserDetails mockUser() {
        return new JwtUserDetails(1L, "test@example.com",
            List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    @DisplayName("GET /api/posts/{id} — 200 반환")
    void getPost_returns200() throws Exception {
        given(postService.getPost(1L)).willReturn(samplePost());
        mockMvc.perform(get("/api/posts/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("제목"));
    }

    // 인증 필요 엔드포인트
    mockMvc.perform(post("/api/posts")
        .with(user(mockUser())).with(csrf())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated());
}
```

## Service 테스트 (@ExtendWith(MockitoExtension.class))

```java
@ExtendWith(MockitoExtension.class)
class PostServiceTest {
    @Mock PostRepository postRepository;
    @InjectMocks PostService postService;

    @Test
    @DisplayName("getPost — 존재하지 않는 ID면 404 예외")
    void getPost_throwsNotFound_whenNotExists() {
        given(postRepository.findById(1L)).willReturn(Optional.empty());
        assertThatThrownBy(() -> postService.getPost(1L))
            .isInstanceOf(BusinessException.class);
    }
}
```

## AI 서비스 테스트 (AnthropicClient 포함)

```java
// @Value 필드가 있는 서비스 → 생성자로 직접 생성
service = new AgentOrchestratorService(anthropicClient, new ObjectMapper(), "claude-haiku-4-5-20251001");

// ContentBlock mock — real TextBlock 사용 (sealed class라 mock 불가)
private Message mockMessage(String text) {
    TextBlock tb = new TextBlock.Builder().text(text).citations(List.of()).build();
    ContentBlock block = ContentBlock.Companion.ofText(tb);
    Message message = mock(Message.class);
    given(message.content()).willReturn(List.of(block));
    return message;
}

// willReturn 체인에서 mockMessage() 직접 호출 금지 → UnfinishedStubbingException
// 반드시 변수로 먼저 생성
Message msg1 = mockMessage("text1");
Message msg2 = mockMessage("text2");
given(messageService.create(any())).willReturn(msg1).willReturn(msg2);
```

## 테스트 네이밍
- 메서드명: `methodName_조건_예상결과`
- @DisplayName: 한국어로 "~하면 ~해야 한다"
- given / when / then 주석으로 구분

## 파일 위치
`src/test/java/com/aibase/도메인패키지/클래스명Test.java`
