import axios from 'axios'

// 不同服务的API地址
const API_BASE_URLS = {
  // 认证服务（authorization-management）
  auth: 'http://localhost:8080/api',
  // 系统管理服务（system-management）
  system: 'http://localhost:8081/api',
  // 档案管理服务（human-resource-archive-management）
  archive: 'http://localhost:8082/api',
  // 薪酬管理服务（human-resource-salary-management）
  salary: 'http://localhost:8083/api'
}

// 根据路径判断使用哪个服务
const getBaseURL = (url) => {
  // 认证相关
  if (url.startsWith('/auth') || url.startsWith('/login') || url.startsWith('/users')) {
    return API_BASE_URLS.auth
  }
  // 机构、职位、薪酬项目相关
  if (url.startsWith('/organizations') || url.startsWith('/positions') || url.startsWith('/salary-items')) {
    return API_BASE_URLS.system
  }
  // 员工档案相关
  if (url.startsWith('/employee-archives')) {
    return API_BASE_URLS.archive
  }
  // 薪酬标准和发放相关
  if (url.startsWith('/salary-standards') || url.startsWith('/salary-issuances')) {
    return API_BASE_URLS.salary
  }
  // 默认使用认证服务
  return API_BASE_URLS.auth
}

// 创建axios实例
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加Token和动态设置baseURL
apiClient.interceptors.request.use(
  (config) => {
    // 动态设置baseURL
    if (!config.baseURL) {
      config.baseURL = getBaseURL(config.url || '')
    }
    
    // 添加Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

