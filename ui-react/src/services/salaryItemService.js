import apiClient from './api'

/**
 * 薪酬项目管理服务
 */
export const salaryItemService = {
  /**
   * 获取薪酬项目列表
   */
  getList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/salary-items?${queryString}` : '/salary-items'
    return await apiClient.get(url)
  },

  /**
   * 获取薪酬项目详情
   */
  getDetail: async (itemId) => {
    return await apiClient.get(`/salary-items/${itemId}`)
  },

  /**
   * 创建薪酬项目
   */
  create: async (data) => {
    return await apiClient.post('/salary-items', data)
  },

  /**
   * 更新薪酬项目
   */
  update: async (itemId, data) => {
    return await apiClient.put(`/salary-items/${itemId}`, data)
  },

  /**
   * 删除薪酬项目
   */
  delete: async (itemId) => {
    return await apiClient.delete(`/salary-items/${itemId}`)
  }
}

