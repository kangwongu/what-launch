import { FoodGenre, Location, Restaurant } from '../types'
import { calculateDistance } from './kakao-map'

// 음식 장르별 카테고리 코드 매핑
// 카카오맵 카테고리 코드: https://apis.map.kakao.com/web/documentation/#services_Places_categorySearch
const GENRE_CATEGORY_MAP: Record<FoodGenre, string[]> = {
  한식: ['FD6'], // 한식
  일식: ['FD4'], // 일식
  중식: ['FD5'], // 중식
  양식: ['FD3'], // 양식
  기타: ['FD6', 'FD4', 'FD5', 'FD3', 'FD7'], // 모든 음식점
  랜덤: ['FD6', 'FD4', 'FD5', 'FD3', 'FD7'], // 모든 음식점
}

// 장르를 랜덤하게 선택하는 함수
export const getRandomGenre = (): FoodGenre => {
  const genres: FoodGenre[] = ['한식', '일식', '중식', '양식', '기타']
  return genres[Math.floor(Math.random() * genres.length)]
}

// 카카오맵 Places API를 사용한 식당 검색
export const searchRestaurants = async (
  location: Location,
  genre: FoodGenre,
  radius: number = 1000 // 기본 1km
): Promise<Restaurant[]> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'))
      return
    }

    // 랜덤 장르인 경우 랜덤하게 선택
    const actualGenre = genre === '랜덤' ? getRandomGenre() : genre
    const categoryCodes = GENRE_CATEGORY_MAP[actualGenre]

    const places = new window.kakao.maps.services.Places()
    const restaurants: Restaurant[] = []

    // 여러 카테고리 코드로 검색 (한식의 경우 여러 하위 카테고리 포함)
    let searchCount = 0
    const totalSearches = categoryCodes.length

    categoryCodes.forEach((categoryCode) => {
      places.categorySearch(
        categoryCode,
        (data: any[], status: string) => {
          searchCount++

          if (status === window.kakao.maps.services.Status.OK) {
            // 반경 내 식당만 필터링
            const filtered = data
              .filter((place) => {
                const placeLat = parseFloat(place.y)
                const placeLng = parseFloat(place.x)
                const distance = calculateDistance(
                  location.lat,
                  location.lng,
                  placeLat,
                  placeLng
                )
                return distance <= radius
              })
              .map((place) => {
                const placeLat = parseFloat(place.y)
                const placeLng = parseFloat(place.x)
                const distance = calculateDistance(
                  location.lat,
                  location.lng,
                  placeLat,
                  placeLng
                )

                return {
                  id: place.id,
                  name: place.place_name,
                  address: place.road_address_name || place.address_name,
                  phone: place.phone,
                  rating: place.rating ? parseFloat(place.rating) : undefined,
                  distance,
                  lat: placeLat,
                  lng: placeLng,
                } as Restaurant
              })

            restaurants.push(...filtered)
          }

          // 모든 검색이 완료되면 결과 반환
          if (searchCount === totalSearches) {
            if (restaurants.length === 0) {
              reject(
                new Error(
                  `반경 ${radius / 1000}km 내에 ${actualGenre} 식당을 찾을 수 없습니다.`
                )
              )
            } else {
              // 중복 제거 (같은 ID의 식당)
              const uniqueRestaurants = restaurants.filter(
                (restaurant, index, self) =>
                  index === self.findIndex((r) => r.id === restaurant.id)
              )
              resolve(uniqueRestaurants)
            }
          }
        },
        {
          location: new window.kakao.maps.LatLng(location.lat, location.lng),
          radius: radius,
        }
      )
    })
  })
}

// 식당 목록에서 랜덤으로 하나 선택
export const selectRandomRestaurant = (
  restaurants: Restaurant[]
): Restaurant => {
  if (restaurants.length === 0) {
    throw new Error('선택할 식당이 없습니다.')
  }
  const randomIndex = Math.floor(Math.random() * restaurants.length)
  return restaurants[randomIndex]
}

// 키워드로 식당 검색 (대안 방법)
export const searchRestaurantsByKeyword = async (
  location: Location,
  genre: FoodGenre,
  radius: number = 1000
): Promise<Restaurant[]> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'))
      return
    }

    // 랜덤 장르인 경우 랜덤하게 선택
    const actualGenre = genre === '랜덤' ? getRandomGenre() : genre

    // 장르별 키워드
    const genreKeywords: Record<FoodGenre, string> = {
      한식: '한식',
      일식: '일식',
      중식: '중식',
      양식: '양식',
      기타: '음식점',
      랜덤: '음식점',
    }

    const keyword = genreKeywords[actualGenre]
    const places = new window.kakao.maps.services.Places()

    places.keywordSearch(
      keyword,
      (data: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 반경 내 식당만 필터링
          const restaurants = data
            .filter((place) => {
              // 음식점 카테고리만 필터링
              const categoryGroup = place.category_group_code
              if (categoryGroup !== 'FD6' && categoryGroup !== 'FD4' && 
                  categoryGroup !== 'FD5' && categoryGroup !== 'FD3' && 
                  categoryGroup !== 'FD7') {
                return false
              }

              const placeLat = parseFloat(place.y)
              const placeLng = parseFloat(place.x)
              const distance = calculateDistance(
                location.lat,
                location.lng,
                placeLat,
                placeLng
              )
              return distance <= radius
            })
            .map((place) => {
              const placeLat = parseFloat(place.y)
              const placeLng = parseFloat(place.x)
              const distance = calculateDistance(
                location.lat,
                location.lng,
                placeLat,
                placeLng
              )

              return {
                id: place.id,
                name: place.place_name,
                address: place.road_address_name || place.address_name,
                phone: place.phone,
                rating: place.rating ? parseFloat(place.rating) : undefined,
                distance,
                lat: placeLat,
                lng: placeLng,
                placeUrl: place.place_url,
                categoryName: place.category_name,
              } as Restaurant
            })

          if (restaurants.length === 0) {
            reject(
              new Error(
                `반경 ${radius / 1000}km 내에 ${actualGenre} 식당을 찾을 수 없습니다.`
              )
            )
          } else {
            resolve(restaurants)
          }
        } else {
          reject(new Error('식당 검색에 실패했습니다.'))
        }
      },
      {
        location: new window.kakao.maps.LatLng(location.lat, location.lng),
        radius: radius,
      }
    )
  })
}

