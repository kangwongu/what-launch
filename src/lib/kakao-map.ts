import { Location } from '../types'

// 카카오맵 SDK 타입 선언
declare global {
  interface Window {
    kakao: any
  }
}

// 카카오맵 SDK 로드 함수
export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 resolve
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    // SDK 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
    if (existingScript) {
      // 스크립트가 있으면 로드 완료를 기다림
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('카카오맵 SDK 로드 타임아웃'))
      }, 10000)
      return
    }

    // SDK 스크립트 추가
    const script = document.createElement('script')
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY

    if (!apiKey) {
      reject(new Error('카카오맵 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.'))
      return
    }

    // services 라이브러리 포함 (주소-좌표 변환, 장소 검색용)
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
    script.async = true

    script.onload = () => {
      // SDK 로드 후 초기화
      window.kakao.maps.load(() => {
        resolve()
      })
    }

    script.onerror = () => {
      reject(new Error('카카오맵 SDK 로드 실패'))
    }

    document.head.appendChild(script)
  })
}

// 주소 또는 장소명을 좌표로 변환하는 함수
// 먼저 키워드(장소명) 검색을 시도하고, 실패하면 주소 검색을 시도합니다
export const addressToCoordinates = async (
  query: string
): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'))
      return
    }

    // 1. 먼저 키워드(장소명) 검색 시도
    const places = new window.kakao.maps.services.Places()
    places.keywordSearch(query, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        // 키워드 검색 성공
        const result = data[0]
        const location: Location = {
          lat: parseFloat(result.y),
          lng: parseFloat(result.x),
          address: result.address_name || result.road_address_name || query,
        }
        resolve(location)
      } else {
        // 키워드 검색 실패 시 주소 검색 시도
        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(query, (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            // 주소 검색 성공
            const location: Location = {
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x),
              address: result[0].address_name || query,
            }
            resolve(location)
          } else {
            // 둘 다 실패
            reject(
              new Error('주소 또는 장소를 찾을 수 없습니다. 다시 입력해주세요.')
            )
          }
        })
      }
    })
  })
}

// 두 좌표 간의 거리 계산 (미터 단위)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000 // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

