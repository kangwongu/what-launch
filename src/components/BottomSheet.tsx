import { ReactNode, useEffect } from 'react'
import { motion, useDragControls, useMotionValue, useAnimate } from 'framer-motion'

interface BottomSheetProps {
  children: ReactNode
  expanded?: boolean
}

const COLLAPSED_PX = 80
const HALF_VH = 50
const FULL_VH = 90

function vhToPx(vh: number) {
  return (vh / 100) * window.innerHeight
}

export default function BottomSheet({ children, expanded }: BottomSheetProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const [scope, animate] = useAnimate()

  // 결과 도착 시 half로 확장
  useEffect(() => {
    if (expanded) {
      animate(scope.current, { y: -vhToPx(HALF_VH) }, { type: 'spring', damping: 30, stiffness: 300 })
    }
  }, [expanded, animate, scope])

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const currentY = y.get()
    const velocity = info.velocity.y

    const halfPx = vhToPx(HALF_VH)
    const fullPx = vhToPx(FULL_VH)

    let snapTo: number

    if (velocity > 500) {
      snapTo = -COLLAPSED_PX
    } else if (velocity < -500) {
      snapTo = -fullPx
    } else {
      const absY = Math.abs(currentY)
      if (absY < (COLLAPSED_PX + halfPx) / 2) {
        snapTo = -COLLAPSED_PX
      } else if (absY < (halfPx + fullPx) / 2) {
        snapTo = -halfPx
      } else {
        snapTo = -fullPx
      }
    }

    animate(scope.current, { y: snapTo }, { type: 'spring', damping: 30, stiffness: 300 })
  }

  return (
    <motion.div
      ref={scope}
      style={{ y, height: '100vh', bottom: -(window.innerHeight - COLLAPSED_PX) }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: -vhToPx(FULL_VH), bottom: -COLLAPSED_PX }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      initial={{ y: -COLLAPSED_PX }}
      className="fixed left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-30"
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* 콘텐츠 */}
      <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
