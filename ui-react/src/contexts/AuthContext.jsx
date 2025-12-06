import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初始化时检查本地存储的用户信息
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      if (response.code === 200 && response.data) {
        const userData = response.data.user || {
          username: response.data.username,
          realName: response.data.realName,
          role: response.data.role,
          userId: response.data.userId
        }
        setUser(userData)
        return { success: true }
      }
      return { success: false, message: response.message || '登录失败' }
    } catch (error) {
      console.error('登录错误:', error)
      return { success: false, message: error.response?.data?.message || error.message || '登录失败' }
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const hasRole = (roles) => {
    if (!user || !user.role) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

