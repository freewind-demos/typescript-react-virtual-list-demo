// 引入 React 插件，让 Vite 能编译 TSX。
import react from '@vitejs/plugin-react'
// 引入 Vite 配置构造器。
import { defineConfig } from 'vite'

// 导出本 demo 的最小 Vite 配置。
export default defineConfig({
  // 启用 React 快速刷新。
  plugins: [react()],
  // 开发服务器默认对外可访问并自动打开浏览器。
  server: {
    host: true,
    open: true,
  },
  // Vitest 与 Vite 共用同一份配置。
  test: {
    environment: 'jsdom',
  },
})
