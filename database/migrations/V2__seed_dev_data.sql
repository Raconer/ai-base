-- ============================================================
-- V2 — 개발용 시드 데이터
-- ============================================================

-- 관리자 계정 (비밀번호는 배포 전 변경 필수)
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@aibase.dev', '$2a$10$placeholder_hash_change_me', 'Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- 샘플 방문자 통계 (시계열 테스트용)
INSERT INTO visitor_stats (date, page_views, unique_visitors, avg_duration_sec)
VALUES
    (CURRENT_DATE - 6, 120, 80, 95),
    (CURRENT_DATE - 5, 145, 95, 110),
    (CURRENT_DATE - 4, 132, 88, 105),
    (CURRENT_DATE - 3, 160, 110, 120),
    (CURRENT_DATE - 2, 178, 125, 115),
    (CURRENT_DATE - 1, 195, 140, 130),
    (CURRENT_DATE,     210, 155, 125)
ON CONFLICT (date) DO NOTHING;
