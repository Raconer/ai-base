export default function Footer() {
  return (
    <footer className="border-t border-[#2a3042] bg-[#1a1f2e] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-[#6b7590]">
        <p>김동호 · Portfolio — AI Reference Repository</p>
        <a
          href="https://github.com/Raconer/ai-base"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#a8b2c8] transition-colors"
        >
          GitHub →
        </a>
      </div>
    </footer>
  )
}
