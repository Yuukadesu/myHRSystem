import apiClient from './api'

/**
 * 机构管理服务
 */
export const organizationService = {
  /**
   * 获取一级机构列表
   */
  getLevel1List: async () => {
    return await apiClient.get('/organizations/level1')
  },

  /**
   * 获取二级机构列表
   */
  getLevel2List: async (parentId) => {
    return await apiClient.get(`/organizations/level2?parentId=${parentId}`)
  },

  /**
   * 获取三级机构列表
   */
  getLevel3List: async (parentId) => {
    return await apiClient.get(`/organizations/level3?parentId=${parentId}`)
  },

  /**
   * 创建一级机构
   */
  createLevel1: async (data) => {
    return await apiClient.post('/organizations/level1', data)
  },

  /**
   * 创建二级机构
   */
  createLevel2: async (data) => {
    return await apiClient.post('/organizations/level2', data)
  },

  /**
   * 创建三级机构
   */
  createLevel3: async (data) => {
    return await apiClient.post('/organizations/level3', data)
  },

  /**
   * 更新机构
   */
  update: async (orgId, data) => {
    return await apiClient.put(`/organizations/${orgId}`, data)
  },

  /**
   * 删除机构
   */
  delete: async (orgId) => {
    return await apiClient.delete(`/organizations/${orgId}`)
  }
}

