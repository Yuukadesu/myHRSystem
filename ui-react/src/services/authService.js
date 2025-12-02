import apiClient from './api'

/**
 * 认证服务
 */
export const authService = {
  /**
   * 用户登录
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    })
    if (response.code === 200 && response.data) {
      // 保存Token和用户信息
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user || {
        username: response.data.username,
        realName: response.data.realName,
        role: response.data.role,
        userId: response.data.userId
      }))
    }
    return response
  },

  /**
   * 用户登出
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  /**
   * 刷新Token
   */
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh')
    if (response.code === 200 && response.data?.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response
  },

  /**
   * 验证Token
   */
  validateToken: async () => {
    return await apiClient.get('/auth/validate')
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    return await apiClient.get('/users/me')
  }
}

