-- username 컬럼 추가 (멀티 유저 포트폴리오 플랫폼)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- 기존 유저는 email 앞부분을 username으로 세팅
UPDATE users SET username = SPLIT_PART(email, '@', 1) || '_' || id WHERE username IS NULL;

-- NOT NULL 제약 추가
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
