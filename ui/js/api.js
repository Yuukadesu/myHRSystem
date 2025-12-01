// 立即定义 window.apiRequest 占位符，防止未定义错误
// 使用立即执行函数确保在脚本加载时立即执行
(function() {
    if (typeof window === 'undefined') return;
    
    // 如果 apiRequest 不存在，先设置为一个临时函数，避免 undefined 错误
    if (!window.apiRequest) {
        window.apiRequest = function() {
            console.error('❌ apiRequest 尚未初始化完成，请稍候再试');
            return Promise.reject(new Error('apiRequest 尚未初始化'));
        };
    }
})();

// API配置
// 各服务端口配置（不同功能模块运行在不同端口）
const API_PORTS = {
    auth: 8081,           // 认证授权服务 - authorization-management
    system: 8080,        // 系统管理服务 - system-management
    archive: 8082,        // 人力资源档案管理服务 - human-resource-archive-management
    salary: 8083          // 薪酬管理服务 - human-resource-salary-management
};

// 根据URL路径获取对应的Base URL
function getBaseUrl(url) {
    // 如果已经是完整URL，直接返回null（表示不需要拼接）
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return null;
    }
    
    // 移除查询参数，只检查路径部分
    const path = url.split('?')[0];
    
    // 认证授权相关接口 -> 8081
    if (path.startsWith('/auth/') || path.startsWith('/users/') || path === '/auth' || path === '/users') {
        return `http://localhost:${API_PORTS.auth}/api`;
    }
    // 系统管理相关接口 -> 8080
    else if (path.startsWith('/organizations/') || path.startsWith('/positions/') || path.startsWith('/salary-items/') 
             || path === '/organizations' || path === '/positions' || path === '/salary-items') {
        return `http://localhost:${API_PORTS.system}/api`;
    }
    // 人力资源档案管理相关接口 -> 8082
    else if (path.startsWith('/employee-archives/') || path === '/employee-archives') {
        return `http://localhost:${API_PORTS.archive}/api`;
    }
    // 薪酬管理相关接口 -> 8083
    else if (path.startsWith('/salary-standards/') || path.startsWith('/salary-issuances/')
             || path === '/salary-standards' || path === '/salary-issuances') {
        return `http://localhost:${API_PORTS.salary}/api`;
    }
    // 默认使用系统管理端口
    return `http://localhost:${API_PORTS.system}/api`;
}

// Token管理函数（直接定义，不依赖Mock文件）
// 如果 window 上已有定义则使用，否则创建新函数
if (!window.getToken) {
    window.getToken = function() {
        return localStorage.getItem('token');
    };
}

if (!window.setToken) {
    window.setToken = function(token) {
        localStorage.setItem('token', token);
    };
}

if (!window.removeToken) {
    window.removeToken = function() {
        localStorage.removeItem('token');
    };
}

// 获取Token
const getToken = function() {
    return window.getToken();
};

// 设置Token
const setToken = function(token) {
    window.setToken(token);
};

// 移除Token
const removeToken = function() {
    window.removeToken();
};

// 通用API请求方法
// 定义真实的 API 请求函数
async function realApiRequest(url, options = {}) {
    const token = getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        // 确保 Token 不为空且格式正确
        const cleanToken = token.trim();
        if (cleanToken.length > 0) {
            defaultOptions.headers['Authorization'] = `Bearer ${cleanToken}`;
            console.log('🔑 使用Token:', cleanToken.substring(0, 20) + '...'); // 只显示前20个字符
        } else {
            console.warn('⚠️ Token为空，跳过Authorization头');
        }
    } else {
        console.warn('⚠️ 未找到Token');
    }

    // 如果是FormData，不设置Content-Type，让浏览器自动设置
    if (options.body instanceof FormData) {
        delete defaultOptions.headers['Content-Type'];
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    // 如果 URL 已经是完整 URL（包含 http://），直接使用
    // 否则使用 getBaseUrl 获取基础 URL 并拼接
    let fullUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        fullUrl = url;
        console.log('✅ 使用完整URL:', fullUrl);
    } else {
        const baseUrl = getBaseUrl(url);
        if (baseUrl === null) {
            // getBaseUrl 返回 null 表示传入的已经是完整URL（虽然不应该到这里）
            fullUrl = url;
        } else {
            fullUrl = `${baseUrl}${url}`;
        }
        console.log('🔧 拼接URL - 基础URL:', baseUrl, '路径:', url, '完整URL:', fullUrl);
    }
    
    try {
        console.log('🌐 发送真实API请求:', fullUrl, options.method || 'GET');
        const response = await fetch(fullUrl, finalOptions);
        const data = await response.json();
        console.log('✅ API响应:', data);

        if (response.status === 401) {
            // Token过期，跳转到登录页
            removeToken();
            window.location.href = 'login.html';
            return;
        }

        if (data.code !== 200) {
            throw new Error(data.message || '请求失败');
        }

        return data;
    } catch (error) {
        console.error('❌ API请求错误:', error);
        console.error('请求URL:', fullUrl);
        throw error;
    }
}

// 立即将 apiRequest 暴露到全局，确保在任何脚本使用前就已经定义
// 如果 window.apiRequest 不存在或者是 Mock 版本，则使用真实 API
(function() {
    if (typeof window === 'undefined') return;
    
    // 检查是否存在 Mock API
    if (window.apiRequest && typeof window.apiRequest === 'function' && window.apiRequest.toString().includes('MockData')) {
        console.warn('🧹 检测到 Mock API，已禁用');
        delete window.apiRequest;
    }
    
    // 强制使用真实 API（覆盖任何可能存在的 Mock API和占位符）
    window.apiRequest = realApiRequest;
    
    // 触发自定义事件，通知其他脚本 apiRequest 已就绪
    if (typeof window.dispatchEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('apiRequestReady'));
    }
    
    console.log('✅ apiRequest 已注册到 window 对象，类型:', typeof window.apiRequest);
    console.log('✅ apiRequest 函数:', window.apiRequest);
    
    // 双重检查确保已正确设置
    if (typeof window.apiRequest !== 'function') {
        console.error('❌ apiRequest 设置失败！当前类型:', typeof window.apiRequest);
        console.error('❌ realApiRequest 类型:', typeof realApiRequest);
    }
})();

// 定义局部变量供其他 API 使用
const apiRequest = window.apiRequest || realApiRequest;

// 机构相关API
// 直接使用 8080 端口的完整 URL
const SYSTEM_API_BASE = 'http://localhost:8080/api';

const OrgAPI = {
    // 获取一级机构列表
    getLevel1List: () => apiRequest(`${SYSTEM_API_BASE}/organizations/level1`),
    
    // 获取二级机构列表
    getLevel2List: (parentId) => apiRequest(`${SYSTEM_API_BASE}/organizations/level2?parentId=${parentId}`),
    
    // 获取三级机构列表
    getLevel3List: (parentId) => apiRequest(`${SYSTEM_API_BASE}/organizations/level3?parentId=${parentId}`),
    
    // 创建一级机构
    createLevel1: (data) => apiRequest(`${SYSTEM_API_BASE}/organizations/level1`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // 创建二级机构
    createLevel2: (data) => apiRequest(`${SYSTEM_API_BASE}/organizations/level2`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // 创建三级机构
    createLevel3: (data) => apiRequest(`${SYSTEM_API_BASE}/organizations/level3`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // 更新机构
    update: (orgId, data) => apiRequest(`${SYSTEM_API_BASE}/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    // 删除机构
    delete: (orgId) => apiRequest(`${SYSTEM_API_BASE}/organizations/${orgId}`, {
        method: 'DELETE',
    }),
};

// 职位相关API
// 使用 8080 端口的完整 URL
const PositionAPI = {
    // 获取职位列表
    getList: (thirdOrgId) => {
        const url = thirdOrgId 
            ? `${SYSTEM_API_BASE}/positions?thirdOrgId=${thirdOrgId}` 
            : `${SYSTEM_API_BASE}/positions`;
        return apiRequest(url);
    },
    
    // 获取职位详情
    getDetail: (positionId) => apiRequest(`${SYSTEM_API_BASE}/positions/${positionId}`),
    
    // 创建职位
    create: (data) => apiRequest(`${SYSTEM_API_BASE}/positions`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // 更新职位
    update: (positionId, data) => apiRequest(`${SYSTEM_API_BASE}/positions/${positionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    // 删除职位
    delete: (positionId) => apiRequest(`${SYSTEM_API_BASE}/positions/${positionId}`, {
        method: 'DELETE',
    }),
};

// 薪酬项目相关API
// 使用 8080 端口的完整 URL
const SalaryItemAPI = {
    // 获取薪酬项目列表
    getList: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${SYSTEM_API_BASE}/salary-items?${queryString}` 
            : `${SYSTEM_API_BASE}/salary-items`;
        return apiRequest(url);
    },
    
    // 获取薪酬项目详情
    getDetail: (itemId) => apiRequest(`${SYSTEM_API_BASE}/salary-items/${itemId}`),
    
    // 创建薪酬项目
    create: (data) => apiRequest(`${SYSTEM_API_BASE}/salary-items`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // 更新薪酬项目
    update: (itemId, data) => apiRequest(`${SYSTEM_API_BASE}/salary-items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    // 删除薪酬项目
    delete: (itemId) => apiRequest(`${SYSTEM_API_BASE}/salary-items/${itemId}`, {
        method: 'DELETE',
    }),
};

// 用户相关API
// 使用 8081 端口的完整 URL
const AUTH_API_BASE = 'http://localhost:8081/api';

const UserAPI = {
    // 获取当前用户信息
    getCurrentUser: () => apiRequest(`${AUTH_API_BASE}/users/me`),
};

// apiRequest 已经在上面暴露到 window 对象了

