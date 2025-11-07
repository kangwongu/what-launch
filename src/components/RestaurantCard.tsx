import { useState } from 'react'
import { Restaurant } from '../types'
import Button from './Button'
import RestaurantDetailModal from './RestaurantDetailModal'

interface RestaurantCardProps {
  restaurant: Restaurant
  onReselect?: () => void
}

export default function RestaurantCard({
  restaurant,
  onReselect,
}: RestaurantCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const distanceText = restaurant.distance
    ? `${(restaurant.distance / 1000).toFixed(1)}km`
    : ''

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={() => setIsModalOpen(true)}
      >
      {/* 식당명 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {restaurant.name}
        </h2>
        {restaurant.rating && (
          <div className="flex items-center gap-1 text-yellow-500">
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
          <span className="text-gray-500 text-sm">📍</span>
          <p className="text-gray-700 text-sm flex-1">{restaurant.address}</p>
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
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {restaurant.phone}
            </a>
          </div>
        )}
      </div>

      {/* 다시 선택하기 버튼 */}
      {onReselect && (
        <div className="pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onReselect}
            className="hover:bg-gray-50"
          >
            다시 선택하기
          </Button>
        </div>
      )}
    </div>

    {/* 상세 정보 모달 */}
    <RestaurantDetailModal
      restaurant={restaurant}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  )
}

