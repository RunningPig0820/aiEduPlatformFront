import { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Login
  const login = useCallback(async (identifier, password) => {
    const userData = await authApi.login(identifier, password)
    setUser(userData)
    return userData
  }, [])

  // Demo login
  const demoLogin = useCallback(async (role) => {
    const userData = await authApi.demoLogin(role)
    setUser(userData)
    return userData
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [])

  // Register
  const register = useCallback(async (data) => {
    return await authApi.register(data)
  }, [])

  // Send code
  const sendCode = useCallback(async (phone, scene) => {
    return await authApi.sendCode(phone, scene)
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    demoLogin,
    register,
    sendCode,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext