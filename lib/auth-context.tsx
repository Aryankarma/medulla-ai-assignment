"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", { credentials: "include" })
        if (response.ok) {
          const data = await response.json()
          setEmail(data.email)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userEmail: string, token: string) => {
    setEmail(userEmail)
    localStorage.setItem("auth_token", token)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch (error) {
      console.error("Logout failed:", error)
    }
    setEmail(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider value={{ email, isAuthenticated: !!email, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
