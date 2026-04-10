-- ============================================================
-- V1 — 초기 스키마 생성
-- AI Base 전체 테이블 + pgvector 확장
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- users
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',
    bio             TEXT,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- posts
CREATE TABLE IF NOT EXISTS posts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    content         TEXT         NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    category        VARCHAR(100),
    sentiment_score DOUBLE PRECISION,
    ai_corrected    BOOLEAN      NOT NULL DEFAULT FALSE,
    view_count      INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_user_id    ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status     ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- tags
CREATE TABLE IF NOT EXISTS tags (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    category     VARCHAR(100),
    ai_generated BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- post_tags
CREATE TABLE IF NOT EXISTS post_tags (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id     BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_post_tag UNIQUE (post_id, tag_id)
);

-- resumes
CREATE TABLE IF NOT EXISTS resumes (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    summary    TEXT,
    skills     JSONB,
    experience JSONB,
    education  JSONB,
    pdf_url    VARCHAR(500),
    is_primary BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id    ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_primary ON resumes(user_id, is_primary);

-- pdf_documents
CREATE TABLE IF NOT EXISTS pdf_documents (
    id            BIGSERIAL PRIMARY KEY,
    resume_id     BIGINT REFERENCES resumes(id) ON DELETE CASCADE,
    post_id       BIGINT REFERENCES posts(id)   ON DELETE CASCADE,
    filename      VARCHAR(500) NOT NULL,
    original_text TEXT,
    chunk_index   INTEGER,
    chunk_text    TEXT,
    embedding     vector(1536),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pdf_resume_id   ON pdf_documents(resume_id);
CREATE INDEX IF NOT EXISTS idx_pdf_post_id     ON pdf_documents(post_id);
CREATE INDEX IF NOT EXISTS idx_pdf_chunk_index ON pdf_documents(resume_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_pdf_embedding   ON pdf_documents
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ai_task_logs
CREATE TABLE IF NOT EXISTS ai_task_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    task_type   VARCHAR(100) NOT NULL,
    input_text  TEXT,
    output_text TEXT,
    model_used  VARCHAR(100),
    tokens_used INTEGER,
    duration_ms INTEGER,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id   ON ai_task_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_task_type ON ai_task_logs(task_type);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created   ON ai_task_logs(created_at DESC);

-- visitor_stats
CREATE TABLE IF NOT EXISTS visitor_stats (
    id               BIGSERIAL PRIMARY KEY,
    date             DATE NOT NULL UNIQUE,
    page_views       INTEGER NOT NULL DEFAULT 0,
    unique_visitors  INTEGER NOT NULL DEFAULT 0,
    avg_duration_sec INTEGER NOT NULL DEFAULT 0,
    top_pages        JSONB,
    referrers        JSONB,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(date DESC);
