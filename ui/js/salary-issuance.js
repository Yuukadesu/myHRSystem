// 薪酬发放相关API
// 直接使用 8083 端口的完整 URL
// 注意：SALARY_API_BASE 已在 salary-standard.js 中定义，这里使用相同的值

// 使用 window 上的值，如果不存在则定义
var SALARY_API_BASE = window.SALARY_API_BASE || 'http://localhost:8083/api';
window.SALARY_API_BASE = SALARY_API_BASE;

const SalaryIssuanceAPI = {
    // 获取待登记薪酬发放单列表
    getPendingRegistration: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SALARY_API_BASE}/salary-issuances/pending-registration?${queryString}` 
            : `${SALARY_API_BASE}/salary-issuances/pending-registration`;
        return apiRequest(url);
    },
    
    // 登记薪酬发放单
    create: (data) => {
        const url = `${SALARY_API_BASE}/salary-issuances`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    // 获取薪酬发放单详情
    getDetail: (issuanceId) => {
        const url = `${SALARY_API_BASE}/salary-issuances/${issuanceId}`;
        return apiRequest(url);
    },
    
    // 获取待复核薪酬发放单列表
    getPendingReview: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SALARY_API_BASE}/salary-issuances/pending-review?${queryString}` 
            : `${SALARY_API_BASE}/salary-issuances/pending-review`;
        return apiRequest(url);
    },
    
    // 复核通过
    approve: (issuanceId, data) => {
        const url = `${SALARY_API_BASE}/salary-issuances/${issuanceId}/review/approve`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    // 复核驳回
    reject: (issuanceId, rejectReason) => {
        const url = `${SALARY_API_BASE}/salary-issuances/${issuanceId}/review/reject`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify({ rejectReason }),
        });
    },
    
    // 查询薪酬发放单
    query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SALARY_API_BASE}/salary-issuances?${queryString}` 
            : `${SALARY_API_BASE}/salary-issuances`;
        return apiRequest(url);
    },
};

