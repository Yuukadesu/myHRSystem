import apiClient from './api'

/**
 * 职位管理服务
 */
export const positionService = {
  /**
   * 获取职位列表
   */
  getList: async (thirdOrgId) => {
    const url = thirdOrgId ? `/positions?thirdOrgId=${thirdOrgId}` : '/positions'
    return await apiClient.get(url)
  },

  /**
   * 获取职位详情
   */
  getDetail: async (positionId) => {
    return await apiClient.get(`/positions/${positionId}`)
  },

  /**
   * 创建职位
   */
  create: async (data) => {
    return await apiClient.post('/positions', data)
  },

  /**
   * 更新职位
   */
  update: async (positionId, data) => {
    return await apiClient.put(`/positions/${positionId}`, data)
  },

  /**
   * 删除职位
   */
  delete: async (positionId) => {
    return await apiClient.delete(`/positions/${positionId}`)
  }
}

