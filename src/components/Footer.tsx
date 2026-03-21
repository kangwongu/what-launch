type PageType = 'about' | 'privacy' | 'terms'

export default function Footer({
  onNavigate,
}: {
  onNavigate: (page: PageType) => void
}) {
  const links: { label: string; page: PageType }[] = [
    { label: '서비스 소개', page: 'about' },
    { label: '개인정보처리방침', page: 'privacy' },
    { label: '이용약관', page: 'terms' },
  ]

  return (
    <footer className="border-t border-gray-200 pt-4 pb-2 mt-6">
      <p className="text-xs text-gray-400 text-center mb-2">
        What Launch — 점심 메뉴 고민을 해결하는 랜덤 맛집 추천 서비스
      </p>
      <nav className="flex justify-center gap-4">
        {links.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className="text-xs text-gray-400 hover:text-primary-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>
      <p className="text-xs text-gray-300 text-center mt-2">
        © 2025 What Launch. All rights reserved.
      </p>
    </footer>
  )
}
