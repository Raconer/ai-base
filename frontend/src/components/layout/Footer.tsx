export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--divider)',
      padding: '32px var(--padding-desktop)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span className="label">Portfolio — AI Reference Repository</span>
      <span className="label">{year}</span>
    </footer>
  )
}
