import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FoodGenre, Location, Restaurant } from './types'
import LocationInput from './components/LocationInput'
import GenreSelector from './components/GenreSelector'
import Button from './components/Button'
import MapView from './components/MapView'
import RestaurantCard from './components/RestaurantCard'
import BottomSheet from './components/BottomSheet'
import { useIsMobile } from './hooks/useIsMobile'
import { addressToCoordinates } from './lib/kakao-map'
import {
  searchRestaurantsByKeyword,
  selectRandomRestaurant,
} from './lib/restaurant'

function PanelContent({
  location,
  locationError,
  genreError,
  selectedGenre,
  selectedRestaurant,
  searchError,
  searchRadius,
  isFormValid,
  isLoading,
  onLocationChange,
  onGenreSelect,
  onRecommend,
  onReselect,
  onExpandRadius,
  onKeyDown,
}: {
  location: string
  locationError: string
  genreError: string
  selectedGenre: FoodGenre | null
  selectedRestaurant: Restaurant | null
  searchError: string
  searchRadius: number
  isFormValid: boolean
  isLoading: boolean
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenreSelect: (genre: FoodGenre) => void
  onRecommend: () => void
  onReselect: () => void
  onExpandRadius: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-6 min-w-0">
      {/* 헤더 */}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          What Launch 🍽️
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          오늘 점심 뭐먹지? 고민을 가볍게 해소하는 뽑기 게임
        </p>
      </header>

      {/* 위치 입력 */}
      <section>
        <LocationInput
          label="위치 입력"
          value={location}
          onChange={onLocationChange}
          onKeyDown={onKeyDown}
          error={locationError}
        />
      </section>

      {/* 장르 선택 */}
      <section>
        <GenreSelector
          selectedGenre={selectedGenre}
          onSelectGenre={onGenreSelect}
          error={genreError}
        />
      </section>

      {/* 추천받기 버튼 */}
      <section>
        <Button
          variant="gradient"
          size="lg"
          fullWidth
          onClick={onRecommend}
          disabled={!isFormValid || isLoading}
          className={`shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}
        >
          {isLoading ? '검색 중...' : '추천받기 🎲'}
        </Button>
      </section>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {searchError && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{searchError}</p>
              {searchRadius <= 1000 && (
                <button
                  onClick={onExpandRadius}
                  className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  검색 범위 넓히기 (2km)
                </button>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 식당 카드 */}
      {selectedRestaurant && (
        <section>
          <RestaurantCard
            restaurant={selectedRestaurant}
            onReselect={onReselect}
          />
        </section>
      )}

    </div>
  )
}

function App() {
  const [location, setLocation] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<FoodGenre | null>(null)
  const [locationError, setLocationError] = useState('')
  const [genreError, setGenreError] = useState('')
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searchRadius, setSearchRadius] = useState(1000)

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
    if (locationError) setLocationError('')
  }

  const handleGenreSelect = (genre: FoodGenre) => {
    setSelectedGenre(genre)
    if (genreError) setGenreError('')
    setSelectedRestaurant(null)
  }

  const handleReselect = async () => {
    if (!userLocation || !selectedGenre) return

    setIsLoading(true)
    setSearchError('')

    try {
      const restaurants = await searchRestaurantsByKeyword(
        userLocation,
        selectedGenre,
        searchRadius
      )

      const filteredRestaurants = selectedRestaurant
        ? restaurants.filter((r) => r.id !== selectedRestaurant.id)
        : restaurants

      if (filteredRestaurants.length === 0) {
        setSearchError('더 이상 추천할 식당이 없습니다.')
        return
      }

      const randomRestaurant = selectRandomRestaurant(filteredRestaurants)
      setSelectedRestaurant(randomRestaurant)
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : '식당 검색 중 오류가 발생했습니다.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecommend = async () => {
    let hasError = false

    if (!location.trim()) {
      setLocationError('위치를 입력해주세요')
      hasError = true
    }

    if (!selectedGenre) {
      setGenreError('음식 장르를 선택해주세요')
      hasError = true
    }

    if (hasError) return

    setIsLoading(true)
    setLocationError('')
    setGenreError('')

    try {
      const coordinates = await addressToCoordinates(location)
      setUserLocation(coordinates)
      setSearchError('')

      const restaurants = await searchRestaurantsByKeyword(
        coordinates,
        selectedGenre!,
        searchRadius
      )

      const randomRestaurant = selectRandomRestaurant(restaurants)
      setSelectedRestaurant(randomRestaurant)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('주소') || error.message.includes('장소')) {
          setLocationError(error.message)
          setUserLocation(null)
        } else {
          setSearchError(error.message)
        }
      } else {
        setSearchError('식당 검색 중 오류가 발생했습니다.')
      }
      setSelectedRestaurant(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpandRadius = async () => {
    setSearchRadius(2000)
    setSearchError('')
    if (userLocation && selectedGenre) {
      setIsLoading(true)
      try {
        const restaurants = await searchRestaurantsByKeyword(
          userLocation,
          selectedGenre,
          2000
        )
        const randomRestaurant = selectRandomRestaurant(restaurants)
        setSelectedRestaurant(randomRestaurant)
      } catch (error) {
        setSearchError(
          error instanceof Error
            ? error.message
            : '식당 검색 중 오류가 발생했습니다.'
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRecommend()
    }
  }

  const isFormValid = location.trim() !== '' && selectedGenre !== null
  const isMobile = useIsMobile()

  const panelProps = {
    location,
    locationError,
    genreError,
    selectedGenre,
    selectedRestaurant,
    searchError,
    searchRadius,
    isFormValid,
    isLoading,
    onLocationChange: handleLocationChange,
    onGenreSelect: handleGenreSelect,
    onRecommend: handleRecommend,
    onReselect: handleReselect,
    onExpandRadius: handleExpandRadius,
    onKeyDown: handleKeyDown,
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-surface-50">
      {/* 데스크톱: 사이드 패널 */}
      {!isMobile && (
        <aside className="w-1/3 max-w-md h-full overflow-y-auto p-6 bg-white shadow-lg z-10">
          <PanelContent {...panelProps} />
        </aside>
      )}

      {/* 지도 영역 */}
      <div className="flex-1 relative min-h-0">
        <MapView
          userLocation={userLocation}
          restaurant={selectedRestaurant}
          isLoading={isLoading}
        />
      </div>

      {/* 모바일: 하단 시트 */}
      {isMobile && (
        <BottomSheet expanded={selectedRestaurant !== null}>
          <PanelContent {...panelProps} />
        </BottomSheet>
      )}
    </div>
  )
}

export default App
