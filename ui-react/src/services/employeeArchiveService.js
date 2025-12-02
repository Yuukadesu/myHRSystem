import apiClient from './api'

/**
 * 员工档案管理服务
 */
export const employeeArchiveService = {
  /**
   * 创建员工档案（登记）
   */
  create: async (data) => {
    return await apiClient.post('/employee-archives', data)
  },

  /**
   * 获取员工档案详情
   */
  getDetail: async (archiveId) => {
    return await apiClient.get(`/employee-archives/${archiveId}`)
  },

  /**
   * 更新员工档案（变更）
   */
  update: async (archiveId, data) => {
    return await apiClient.put(`/employee-archives/${archiveId}`, data)
  },

  /**
   * 删除员工档案
   */
  delete: async (archiveId, deleteReason) => {
    return await apiClient.delete(`/employee-archives/${archiveId}`, {
      data: { deleteReason }
    })
  },

  /**
   * 查询员工档案列表
   */
  query: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/employee-archives?${queryString}` : '/employee-archives'
    return await apiClient.get(url)
  },

  /**
   * 获取待复核档案列表
   */
  getPendingReviewList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/employee-archives/pending-review?${queryString}`
    return await apiClient.get(url)
  },

  /**
   * 复核通过（不修改）
   */
  approveReview: async (archiveId, reviewComments = null) => {
    return await apiClient.post(`/employee-archives/${archiveId}/review/approve`, {
      reviewComments: reviewComments || null
    })
  },

  /**
   * 复核通过（修改）
   */
  reviewAndApprove: async (archiveId, data) => {
    // 确保reviewComments可以为空
    const submitData = {
      ...data,
      reviewComments: data.reviewComments || null
    }
    return await apiClient.put(`/employee-archives/${archiveId}/review`, submitData)
  },

  /**
   * 获取删除管理列表
   */
  getDeletedList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/employee-archives/deleted?${queryString}`
    return await apiClient.get(url)
  },

  /**
   * 恢复员工档案
   */
  restore: async (archiveId) => {
    return await apiClient.post(`/employee-archives/${archiveId}/restore`)
  },

  /**
   * 上传员工照片
   */
  uploadPhoto: async (archiveId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await apiClient.post(`/employee-archives/${archiveId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

