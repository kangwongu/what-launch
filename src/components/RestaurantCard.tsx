import { useState } from 'react'
import { motion } from 'framer-motion'
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
    ? restaurant.distance < 1000
      ? `${Math.round(restaurant.distance)}m`
      : `${(restaurant.distance / 1000).toFixed(1)}km`
    : ''

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md border border-surface-200 p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        {/* 카테고리 + 거리 뱃지 */}
        <div className="flex items-center justify-between">
          {restaurant.categoryName && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full truncate max-w-[60%]">
              {restaurant.categoryName}
            </span>
          )}
          {distanceText && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-fresh-100 text-fresh-700 rounded-full">
              {distanceText} 📍
            </span>
          )}
        </div>

        {/* 식당명 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 break-words">
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
            <p className="text-gray-700 text-sm flex-1 break-words">{restaurant.address}</p>
          </div>

          {/* 전화번호 */}
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">📞</span>
              <a
                href={`tel:${restaurant.phone}`}
                className="text-primary-600 hover:text-primary-800 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {restaurant.phone}
              </a>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div
          className="pt-4 border-t border-surface-200 flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {restaurant.placeUrl && (
            <a
              href={restaurant.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="md" fullWidth>
                카카오맵에서 보기
              </Button>
            </a>
          )}
          {onReselect && (
            <Button
              variant="gradient"
              size="md"
              fullWidth
              onClick={onReselect}
              className="flex-1"
            >
              다시 뽑기 🎲
            </Button>
          )}
        </div>
      </motion.div>

      {/* 상세 정보 모달 */}
      <RestaurantDetailModal
        restaurant={restaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
