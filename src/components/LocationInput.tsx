import { InputHTMLAttributes } from 'react'

interface LocationInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function LocationInput({
  label = '위치 입력',
  error,
  className = '',
  ...props
}: LocationInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          📍
        </span>
        <input
          id="location"
          type="text"
          placeholder="주소 또는 장소명을 입력하세요"
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-surface-200 hover:border-surface-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
