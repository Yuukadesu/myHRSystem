import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite默认端口
    // 注意：前端API客户端已配置多服务路由，不需要代理
    // 如果需要代理，可以配置多个代理规则
  }
})

