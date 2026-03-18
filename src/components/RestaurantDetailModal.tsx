import { Restaurant } from '../types'
import Button from './Button'

interface RestaurantDetailModalProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}

export default function RestaurantDetailModal({
  restaurant,
  isOpen,
  onClose,
}: RestaurantDetailModalProps) {
  if (!isOpen) return null

  const distanceText = restaurant.distance
    ? `${(restaurant.distance / 1000).toFixed(1)}km`
    : ''

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-surface-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">식당 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          {/* 식당명 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {restaurant.name}
            </h3>
            {restaurant.categoryName && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {restaurant.categoryName}
              </span>
            )}
            {restaurant.rating && (
              <div className="flex items-center gap-1 text-yellow-500 mt-2">
                <span>⭐</span>
                <span className="text-gray-700 font-medium">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-gray-500 text-sm mt-1">📍</span>
              <div className="flex-1">
                <p className="text-gray-700 text-sm">{restaurant.address}</p>
              </div>
            </div>

            {/* 거리 */}
            {distanceText && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">📏</span>
                <p className="text-gray-700 text-sm">거리: {distanceText}</p>
              </div>
            )}

            {/* 전화번호 */}
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">📞</span>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  {restaurant.phone}
                </a>
              </div>
            )}
          </div>

          {/* 카카오맵 상세 페이지 링크 */}
          {restaurant.placeUrl && (
            <div className="pt-4 border-t border-surface-200">
              <a
                href={restaurant.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="primary" size="md" fullWidth>
                  카카오맵에서 상세보기
                </Button>
              </a>
            </div>
          )}

          {/* 지도에서 보기 */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={onClose}
            >
              지도에서 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
