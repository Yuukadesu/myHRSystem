// 薪酬标准相关API
// 直接使用 8083 端口的完整 URL

// 使用 var 而不是 const，允许在 salary-issuance.js 中重复声明（如果已定义则使用已存在的）
var SALARY_API_BASE = window.SALARY_API_BASE || 'http://localhost:8083/api';
window.SALARY_API_BASE = SALARY_API_BASE;

const SalaryStandardAPI = {
    // 创建薪酬标准
    create: (data) => {
        const url = `${SALARY_API_BASE}/salary-standards`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    // 获取待复核薪酬标准列表
    getPendingReview: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SALARY_API_BASE}/salary-standards/pending-review?${queryString}` 
            : `${SALARY_API_BASE}/salary-standards/pending-review`;
        return apiRequest(url);
    },
    
    // 获取薪酬标准详情
    getDetail: (standardId) => {
        const url = `${SALARY_API_BASE}/salary-standards/${standardId}`;
        return apiRequest(url);
    },
    
    // 复核通过
    approve: (standardId, reviewComments) => {
        const url = `${SALARY_API_BASE}/salary-standards/${standardId}/review/approve`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify({ reviewComments }),
        });
    },
    
    // 复核驳回
    reject: (standardId, reviewComments) => {
        const url = `${SALARY_API_BASE}/salary-standards/${standardId}/review/reject`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify({ reviewComments }),
        });
    },
    
    // 查询薪酬标准
    query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SALARY_API_BASE}/salary-standards?${queryString}` 
            : `${SALARY_API_BASE}/salary-standards`;
        return apiRequest(url);
    },
    
    // 更新薪酬标准
    update: (standardId, data) => {
        const url = `${SALARY_API_BASE}/salary-standards/${standardId}`;
        return apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    // 根据职位和职称获取薪酬标准
    getByPosition: (positionId, jobTitle) => {
        const url = `${SALARY_API_BASE}/salary-standards/by-position?positionId=${positionId}&jobTitle=${jobTitle}`;
        return apiRequest(url);
    },
};

