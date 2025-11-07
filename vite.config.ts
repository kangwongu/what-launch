import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  // GitHub Pages 배포를 위한 base 경로 설정
  // 저장소 이름이 'what-launch'인 경우: base: '/what-launch/'
  // 루트 도메인을 사용하는 경우: base: '/'
  base: process.env.NODE_ENV === 'production' ? '/what-launch/' : '/',
})

