// 음식 장르 타입
export type FoodGenre = '한식' | '일식' | '중식' | '양식' | '기타' | '랜덤'

// 앱 상태 타입
export interface AppState {
  location: string
  genre: FoodGenre | null
  selectedRestaurant: Restaurant | null
  isLoading: boolean
  error: string | null
}

// 식당 정보 타입
export interface Restaurant {
  id: string
  name: string
  address: string
  phone?: string
  rating?: number
  distance?: number
  lat: number
  lng: number
  placeUrl?: string // 카카오맵 장소 상세 페이지 URL
  categoryName?: string // 카테고리명
}

// 위치 좌표 타입
export interface Location {
  lat: number
  lng: number
  address: string
}

