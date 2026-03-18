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
  const restaurantMarkerRef = useRef<any>(null)
  const restaurantInfoWindowRef = useRef<any>(null)
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

    const defaultPosition = new kakao.maps.LatLng(37.5665, 126.978)

    const mapOption = {
      center: defaultPosition,
      level: 5,
    }

    const map = new kakao.maps.Map(mapContainer.current, mapOption)
    mapRef.current = map
  }, [isSDKLoaded])

  // ResizeObserver → map.relayout()
  useEffect(() => {
    if (!mapContainer.current || !mapRef.current) return

    const observer = new ResizeObserver(() => {
      mapRef.current?.relayout()
    })

    observer.observe(mapContainer.current)
    return () => observer.disconnect()
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

    const userPosition = new kakao.maps.LatLng(userLocation.lat, userLocation.lng)

    const userMarker = new kakao.maps.Marker({
      position: userPosition,
      map: map,
    })

    const userInfoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;max-width:200px;word-break:break-word;overflow:hidden;">📍 ${userLocation.address}</div>`,
    })

    userInfoWindow.open(map, userMarker)

    if (!map.markers) map.markers = []
    map.markers.push(userMarker)

    // 부드러운 이동
    map.panTo(userPosition)
  }, [isSDKLoaded, userLocation])

  // 식당 위치 마커 표시
  useEffect(() => {
    if (!isSDKLoaded || !mapRef.current || !restaurant) return

    const { kakao } = window
    const map = mapRef.current

    const restaurantPosition = new kakao.maps.LatLng(
      restaurant.lat,
      restaurant.lng
    )

    const markerOptions: any = {
      position: restaurantPosition,
      map: map,
    }

    // 마커 바운스 애니메이션 (SDK에 있을 때만)
    if (kakao.maps.Animation?.BOUNCE) {
      markerOptions.animation = kakao.maps.Animation.BOUNCE
    }

    // 이전 식당 마커/인포윈도우 제거
    if (restaurantMarkerRef.current) {
      restaurantMarkerRef.current.setMap(null)
      restaurantMarkerRef.current = null
    }
    if (restaurantInfoWindowRef.current) {
      restaurantInfoWindowRef.current.close()
      restaurantInfoWindowRef.current = null
    }

    const restaurantMarker = new kakao.maps.Marker(markerOptions)

    const distanceText = restaurant.distance
      ? `${(restaurant.distance / 1000).toFixed(1)}km`
      : ''
    const ratingText = restaurant.rating ? `⭐ ${restaurant.rating}` : ''
    const content = `
      <div style="padding:8px;font-size:13px;min-width:150px;max-width:250px;word-break:break-word;overflow:hidden;">
        <div style="font-weight:bold;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${restaurant.name}</div>
        <div style="color:#666;font-size:11px;margin-bottom:2px;">${restaurant.address}</div>
        ${distanceText ? `<div style="color:#666;font-size:11px;">거리: ${distanceText}</div>` : ''}
        ${ratingText ? `<div style="color:#666;font-size:11px;">${ratingText}</div>` : ''}
      </div>
    `

    const restaurantInfoWindow = new kakao.maps.InfoWindow({
      content: content,
    })

    restaurantInfoWindow.open(map, restaurantMarker)

    // ref에 저장
    restaurantMarkerRef.current = restaurantMarker
    restaurantInfoWindowRef.current = restaurantInfoWindow

    if (userLocation) {
      const bounds = new kakao.maps.LatLngBounds()
      bounds.extend(
        new kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      )
      bounds.extend(restaurantPosition)
      map.setBounds(bounds)
    } else {
      map.panTo(restaurantPosition)
    }
  }, [isSDKLoaded, restaurant, userLocation])

  if (error) {
    return (
      <div className="w-full h-full bg-surface-50 flex items-center justify-center border-2 border-dashed border-surface-200">
        <div className="text-center text-gray-600">
          <p className="text-sm font-medium mb-2">지도를 불러올 수 없습니다</p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!isSDKLoaded) {
    return (
      <div className="w-full h-full bg-surface-50 flex items-center justify-center border-2 border-dashed border-surface-200">
        <div className="text-center text-gray-600">
          <p className="text-sm">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-surface-50/60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 text-center">
            <p className="text-sm text-gray-600 font-medium">맛집 검색 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}
