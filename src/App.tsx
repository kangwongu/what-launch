import { useState } from 'react'
import { FoodGenre, Location, Restaurant } from './types'
import LocationInput from './components/LocationInput'
import GenreSelector from './components/GenreSelector'
import Button from './components/Button'
import MapView from './components/MapView'
import RestaurantCard from './components/RestaurantCard'
import { addressToCoordinates } from './lib/kakao-map'
import {
  searchRestaurantsByKeyword,
  selectRandomRestaurant,
} from './lib/restaurant'

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
    if (locationError) setLocationError('')
  }

  const handleGenreSelect = (genre: FoodGenre) => {
    setSelectedGenre(genre)
    if (genreError) setGenreError('')
    // 장르 변경 시 식당 정보 초기화
    setSelectedRestaurant(null)
  }

  const handleReselect = async () => {
    if (!userLocation || !selectedGenre) return

    setIsLoading(true)
    setSearchError('')

    try {
      // 식당 검색 (기본 반경 1km)
      const restaurants = await searchRestaurantsByKeyword(
        userLocation,
        selectedGenre,
        1000 // 1km
      )

      // 이전에 선택한 식당 제외하고 랜덤 선택
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
    // 유효성 검사
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
      // 주소를 좌표로 변환
      const coordinates = await addressToCoordinates(location)
      setUserLocation(coordinates)
      setSearchError('')

      // 식당 검색 (기본 반경 1km)
      const restaurants = await searchRestaurantsByKeyword(
        coordinates,
        selectedGenre!,
        1000 // 1km
      )

      // 랜덤으로 하나 선택
      const randomRestaurant = selectRandomRestaurant(restaurants)
      setSelectedRestaurant(randomRestaurant)
    } catch (error) {
      if (error instanceof Error) {
        // 위치 검색 오류인지 식당 검색 오류인지 구분
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

  const isFormValid = location.trim() !== '' && selectedGenre !== null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* 헤더 */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            What Launch 🍽️
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            오늘 점심 뭐먹지? 고민을 가볍게 해소하는 뽑기 게임
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8">
          {/* 위치 입력 섹션 */}
          <section>
            <LocationInput
              label="위치 입력"
              value={location}
              onChange={handleLocationChange}
              error={locationError}
            />
          </section>

          {/* 음식 장르 선택 섹션 */}
          <section>
            <GenreSelector
              selectedGenre={selectedGenre}
              onSelectGenre={handleGenreSelect}
              error={genreError}
            />
          </section>

          {/* 추천받기 버튼 */}
          <section>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleRecommend}
              disabled={!isFormValid}
              className="shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              추천받기
            </Button>
          </section>

          {/* 지도 영역 */}
          <section>
            <MapView
              userLocation={userLocation}
              restaurant={selectedRestaurant}
              isLoading={isLoading}
            />
          </section>

          {/* 식당 정보 영역 */}
          {searchError && (
            <section>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{searchError}</p>
              </div>
            </section>
          )}

          {selectedRestaurant && (
            <section>
              <RestaurantCard
                restaurant={selectedRestaurant}
                onReselect={handleReselect}
              />
            </section>
          )}
        </main>

        {/* 푸터 */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Made with ❤️ for lunch decisions</p>
        </footer>
      </div>
    </div>
  )
}

export default App

