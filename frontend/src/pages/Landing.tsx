import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FEATURES = [
  { label: 'Claude AI', title: 'AI 글 교정 & 분류', desc: '작성한 글을 AI가 자동으로 교정하고 카테고리·태그를 붙여줍니다.' },
  { label: 'pgvector', title: 'PDF 이력서 관리', desc: 'PDF를 업로드하면 AI가 내용을 파악하고 검색 가능한 형태로 저장합니다.' },
  { label: 'RAG', title: '시맨틱 검색', desc: '단순 키워드가 아닌 의미 기반으로 글과 이력서를 찾아줍니다.' },
  { label: 'TimeSeries', title: '방문자 트렌드', desc: '포트폴리오 방문자 패턴을 시계열로 분석하고 예측합니다.' },
  { label: 'Multi-Agent', title: '멀티 에이전트', desc: '여러 AI 에이전트가 협력해 글을 분석·분류·요약합니다.' },
  { label: 'Feedback', title: '적응형 피드백', desc: 'AI가 글을 평가하고 개선 제안을 반복해 품질을 높입니다.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [username, setUsername] = useState('')
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal<HTMLDivElement>()

  const handleClaim = () => {
    const q = username.trim() ? `?mode=register&u=${username.trim()}` : '?mode=register'
    navigate(`/login${q}`)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: 'calc(var(--section-spacing) + 48px) var(--padding-desktop) var(--section-spacing)',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
      }}>
        <p className="label" style={{ marginBottom: 32 }}>AI Portfolio Platform</p>

        <h1 className="hero-title" style={{ marginBottom: 48 }}>
          BUILD<br />
          YOUR<br />
          PORTFOLIO
        </h1>

        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 16, color: 'var(--fg-muted)', marginBottom: 32, lineHeight: 1.6 }}>
            블로그·이력서·프로젝트를 한 곳에 모으고,
            AI가 자동으로 분류·교정·요약해 드립니다.
          </p>

          {isAuthenticated() && user ? (
            <div style={{ display: 'flex', gap: 16 }}>
              <button className="btn" onClick={() => navigate(`/${user.username}`)}>
                내 포트폴리오
              </button>
              <button className="btn btn--ghost" onClick={() => navigate('/dashboard')}>
                대시보드
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 0, border: '1px solid var(--divider)' }}>
                <span style={{
                  padding: '12px 16px',
                  fontSize: 13,
                  color: 'var(--fg-muted)',
                  borderRight: '1px solid var(--divider)',
                  whiteSpace: 'nowrap',
                }}>
                  portfolio.dev /
                </span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleClaim()}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '12px 16px',
                    fontSize: 13,
                    color: 'var(--fg)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
              <button className="btn" onClick={handleClaim} style={{ alignSelf: 'flex-start' }}>
                무료로 시작하기
              </button>
              <p className="label">신용카드 불필요 — 영구 무료</p>
            </div>
          )}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="divider" style={{ margin: '0 var(--padding-desktop)' }} />

      {/* ── FEATURES ── */}
      <section
        ref={featuresRef}
        className={`reveal ${featuresVisible ? 'is-visible' : ''}`}
        style={{
          padding: 'var(--section-spacing) var(--padding-desktop)',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
        }}
      >
        <p className="label" style={{ marginBottom: 48 }}>Features</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              style={{
                padding: 32,
                borderTop: '1px solid var(--divider)',
                borderLeft: i % 3 !== 0 ? '1px solid var(--divider)' : undefined,
              }}
            >
              <p className="label" style={{ marginBottom: 16 }}>{f.label}</p>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="divider" style={{ margin: '0 var(--padding-desktop)' }} />

      {/* ── CTA ── */}
      <section style={{
        padding: 'var(--section-spacing) var(--padding-desktop)',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
      }}>
        <div className="cta-stack">
          {!isAuthenticated() ? (
            <button
              className="cta-link"
              onClick={() => navigate('/login?mode=register')}
              style={{ background: 'none', border: 'none', borderTop: '1px solid var(--divider)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              START NOW
            </button>
          ) : (
            <button
              className="cta-link"
              onClick={() => navigate(`/${user!.username}`)}
              style={{ background: 'none', border: 'none', borderTop: '1px solid var(--divider)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              MY PORTFOLIO
            </button>
          )}
        </div>
      </section>

    </div>
  )
}
