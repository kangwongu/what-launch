import { useEffect, useRef, useState } from 'react'
import { Location, Restaurant } from '../types'
import { loadKakaoMapSDK } from '../lib/kakao-map'

interface MapViewProps {
  userLocation: Location | null
  restaurant: Restaurant | null
  isLoading?: boolean
}

export default function MapView({
  userLocation,
  restaurant,
  isLoading = false,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 카카오맵 SDK 로드
  useEffect(() => {
    loadKakaoMapSDK()
      .then(() => {
        setIsSDKLoaded(true)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        console.error('카카오맵 SDK 로드 실패:', err)
      })
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!isSDKLoaded || !mapContainer.current || mapRef.current) return

    const { kakao } = window

    // 기본 위치 (서울시청)
    const defaultPosition = new kakao.maps.LatLng(37.5665, 126.978)

    // 지도 생성
    const mapOption = {
      center: defaultPosition,
      level: 5, // 확대 레벨
    }

    const map = new kakao.maps.Map(mapContainer.current, mapOption)
    mapRef.current = map
  }, [isSDKLoaded])

  // 사용자 위치 마커 표시
  useEffect(() => {
    if (!isSDKLoaded || !mapRef.current || !userLocation) return

    const { kakao } = window
    const map = mapRef.current

    // 기존 마커 제거
    const existingMarkers = map.markers || []
    existingMarkers.forEach((marker: any) => marker.setMap(null))
    map.markers = []

    // 사용자 위치
    const userPosition = new kakao.maps.LatLng(userLocation.lat, userLocation.lng)

    // 사용자 위치 마커 생성 (기본 마커 사용)
    const userMarker = new kakao.maps.Marker({
      position: userPosition,
      map: map,
    })

    // 사용자 위치 인포윈도우
    const userInfoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">📍 ${userLocation.address}</div>`,
    })

    userInfoWindow.open(map, userMarker)

    // 마커 배열에 추가
    if (!map.markers) map.markers = []
    map.markers.push(userMarker)

    // 지도 중심 이동
    map.setCenter(userPosition)
  }, [isSDKLoaded, userLocation])

  // 식당 위치 마커 표시
  useEffect(() => {
    if (!isSDKLoaded || !mapRef.current || !restaurant) return

    const { kakao } = window
    const map = mapRef.current

    // 식당 위치
    const restaurantPosition = new kakao.maps.LatLng(
      restaurant.lat,
      restaurant.lng
    )

    // 식당 마커 생성 (기본 마커 사용)
    const restaurantMarker = new kakao.maps.Marker({
      position: restaurantPosition,
      map: map,
    })

    // 식당 정보 인포윈도우
    const distanceText = restaurant.distance
      ? `${(restaurant.distance / 1000).toFixed(1)}km`
      : ''
    const ratingText = restaurant.rating ? `⭐ ${restaurant.rating}` : ''
    const content = `
      <div style="padding:8px;font-size:13px;min-width:150px;">
        <div style="font-weight:bold;margin-bottom:4px;">${restaurant.name}</div>
        <div style="color:#666;font-size:11px;margin-bottom:2px;">${restaurant.address}</div>
        ${distanceText ? `<div style="color:#666;font-size:11px;">거리: ${distanceText}</div>` : ''}
        ${ratingText ? `<div style="color:#666;font-size:11px;">${ratingText}</div>` : ''}
      </div>
    `

    const restaurantInfoWindow = new kakao.maps.InfoWindow({
      content: content,
    })

    restaurantInfoWindow.open(map, restaurantMarker)

    // 마커 배열에 추가
    if (!map.markers) map.markers = []
    map.markers.push(restaurantMarker)

    // 두 위치를 모두 보이도록 지도 범위 조정
    if (userLocation) {
      const bounds = new kakao.maps.LatLngBounds()
      bounds.extend(
        new kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      )
      bounds.extend(restaurantPosition)
      map.setBounds(bounds)
    } else {
      map.setCenter(restaurantPosition)
    }
  }, [isSDKLoaded, restaurant, userLocation])

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-600">
          <p className="text-sm font-medium mb-2">지도를 불러올 수 없습니다</p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!isSDKLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-600">
          <p className="text-sm">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <p className="text-sm text-gray-600">검색 중...</p>
        </div>
      )}
    </div>
  )
}

