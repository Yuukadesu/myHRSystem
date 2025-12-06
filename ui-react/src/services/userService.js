import apiClient from './api'

/**
 * 用户服务
 */
export const userService = {
  /**
   * 获取用户列表
   */
  getList: async () => {
    return await apiClient.get('/users/list')
  },

  /**
   * 根据角色获取用户列表
   */
  getByRole: async (role) => {
    return await apiClient.get('/users/by-role', { params: { role } })
  },

  /**
   * 根据状态获取用户列表
   */
  getByStatus: async (status) => {
    return await apiClient.get('/users/by-status', { params: { status } })
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    return await apiClient.get('/users/me')
  }
}

