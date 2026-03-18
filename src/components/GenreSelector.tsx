import { FoodGenre } from '../types'

interface GenreSelectorProps {
  selectedGenre: FoodGenre | null
  onSelectGenre: (genre: FoodGenre) => void
  error?: string
}

const GENRE_OPTIONS: { genre: FoodGenre; emoji: string }[] = [
  { genre: '한식', emoji: '🍚' },
  { genre: '일식', emoji: '🍣' },
  { genre: '중식', emoji: '🥟' },
  { genre: '양식', emoji: '🍝' },
  { genre: '기타', emoji: '🍽️' },
  { genre: '랜덤', emoji: '🎲' },
]

export default function GenreSelector({
  selectedGenre,
  onSelectGenre,
  error,
}: GenreSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        음식 장르 선택
      </label>
      <div className="grid grid-cols-3 gap-3">
        {GENRE_OPTIONS.map(({ genre, emoji }) => (
          <button
            key={genre}
            type="button"
            onClick={() => onSelectGenre(genre)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              selectedGenre === genre
                ? 'bg-primary-500 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 border-2 border-surface-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm">{genre}</span>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
