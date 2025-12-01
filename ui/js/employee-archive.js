// 员工档案相关API
// 直接使用 8082 端口的完整 URL

const ARCHIVE_API_BASE = 'http://localhost:8082/api';

const EmployeeArchiveAPI = {
    // 创建员工档案
    create: (data) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    // 获取档案详情
    getDetail: (archiveId) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}`;
        return apiRequest(url);
    },
    
    // 更新员工档案
    update: (archiveId, data) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}`;
        return apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    // 删除员工档案
    delete: (archiveId, deleteReason) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}`;
        return apiRequest(url, {
            method: 'DELETE',
            body: JSON.stringify({ deleteReason }),
        });
    },
    
    // 获取待复核档案列表
    getPendingReviewList: (params = {}) => {
        const page = params.page || 1;
        const size = params.size || 10;
        const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() });
        
        if (params.archiveNumber) queryParams.append('archiveNumber', params.archiveNumber);
        if (params.name) queryParams.append('name', params.name);
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.status) queryParams.append('status', params.status);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        
        const url = `${ARCHIVE_API_BASE}/employee-archives/pending-review?${queryParams.toString()}`;
        return apiRequest(url);
    },
    
    // 复核通过
    approveReview: (archiveId, reviewComments) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}/review/approve`;
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify({ reviewComments }),
        });
    },
    
    // 复核时修改并通过
    reviewWithModify: (archiveId, data) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}/review`;
        return apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    // 查询员工档案
    query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${ARCHIVE_API_BASE}/employee-archives?${queryString}` 
            : `${ARCHIVE_API_BASE}/employee-archives`;
        console.log('📋 EmployeeArchiveAPI.query - 完整URL:', url);
        return apiRequest(url);
    },
    
    // 获取已删除档案列表
    getDeletedList: (page = 1, size = 10, params = {}) => {
        const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() });
        if (params.keyword) {
            queryParams.append('keyword', params.keyword);
        }
        const url = `${ARCHIVE_API_BASE}/employee-archives/deleted?${queryParams.toString()}`;
        return apiRequest(url);
    },
    
    // 恢复员工档案
    restore: (archiveId) => {
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}/restore`;
        return apiRequest(url, {
            method: 'POST',
        });
    },
    
    // 上传照片
    uploadPhoto: (archiveId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const url = `${ARCHIVE_API_BASE}/employee-archives/${archiveId}/photo`;
        return apiRequest(url, {
            method: 'POST',
            body: formData,
            headers: {}, // 不设置Content-Type，让浏览器自动设置
        });
    },
};

