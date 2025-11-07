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
      <input
        id="location"
        type="text"
        placeholder="주소 또는 장소명을 입력하세요"
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

