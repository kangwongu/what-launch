import { FoodGenre } from '../types'

interface GenreSelectorProps {
  selectedGenre: FoodGenre | null
  onSelectGenre: (genre: FoodGenre) => void
  error?: string
}

const GENRES: FoodGenre[] = ['한식', '일식', '중식', '양식', '기타']
const RANDOM_OPTION: FoodGenre = '랜덤'

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
      <div className="space-y-3">
        {/* 일반 장르 선택 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => onSelectGenre(genre)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedGenre === genre
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* 랜덤 옵션 */}
        <button
          type="button"
          onClick={() => onSelectGenre(RANDOM_OPTION)}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            selectedGenre === RANDOM_OPTION
              ? 'bg-purple-600 text-white shadow-md transform scale-105'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          🎲 {RANDOM_OPTION}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

