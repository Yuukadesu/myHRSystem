import apiClient from './api'

/**
 * 薪酬发放管理服务
 */
export const salaryIssuanceService = {
  /**
   * 获取待登记薪酬发放单列表
   */
  getPendingRegistrationList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/salary-issuances/pending-registration?${queryString}`
    return await apiClient.get(url)
  },

  /**
   * 登记薪酬发放单
   */
  create: async (data) => {
    return await apiClient.post('/salary-issuances', data)
  },

  /**
   * 获取薪酬发放单详情
   */
  getDetail: async (issuanceId) => {
    return await apiClient.get(`/salary-issuances/${issuanceId}`)
  },

  /**
   * 获取待复核薪酬发放单列表
   */
  getPendingReviewList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `/salary-issuances/pending-review?${queryString}`
    return await apiClient.get(url)
  },

  /**
   * 复核通过
   */
  approveReview: async (issuanceId, data) => {
    return await apiClient.post(`/salary-issuances/${issuanceId}/review/approve`, data)
  },

  /**
   * 复核驳回
   */
  rejectReview: async (issuanceId, rejectReason) => {
    return await apiClient.post(`/salary-issuances/${issuanceId}/review/reject`, {
      rejectReason
    })
  },

  /**
   * 查询薪酬发放单列表
   */
  query: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/salary-issuances?${queryString}` : '/salary-issuances'
    return await apiClient.get(url)
  },

  /**
   * 获取用于登记的员工明细列表
   */
  getRegistrationDetails: async (thirdOrgId, issuanceMonth) => {
    const params = new URLSearchParams({ thirdOrgId })
    if (issuanceMonth) {
      params.append('issuanceMonth', issuanceMonth)
    }
    return await apiClient.get(`/salary-issuances/registration-details?${params.toString()}`)
  }
}

