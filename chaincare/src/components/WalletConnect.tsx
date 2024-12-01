"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
import { Contract } from 'web3-eth-contract'
import { useRouter } from 'next/navigation'
import Web3 from 'web3'
import { CONTRACT_ADDRESSES, ABI } from "@/components/contracts"

// Define the shape of our authentication context
interface AuthContextType {
  user: {
    address: string | null,
    role: 'admin' | 'patient',
    isAuthenticated: boolean
  },
  login: () => Promise<void>,
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: {
    address: null,
    role: 'patient',
    isAuthenticated: false
  },
  login: async () => {},
  logout: () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    address: null as string | null,
    role: 'patient' as 'admin' | 'patient',
    isAuthenticated: false
  })
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const decoded = parseJwt(token)

          // Validate token expiration
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              address: decoded.address,
              role: decoded.role,
              isAuthenticated: true
            })
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (error) {
          localStorage.removeItem('auth_token')
        }
      }
    }

    checkAuth()
  }, [])

  const login = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })

      if (accounts.length > 0) {
        const address = accounts[0]
        const provider = new Web3(window.ethereum)
        const contract = new provider.eth.Contract(ABI, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL)

        // Check if the connected account is an admin
        const isAdmin = await contract.methods.isAdmin(address).call()

        const role = isAdmin ? 'admin' : 'patient'
        const token = generateJWT(address, role)

        // Store token and update state
        localStorage.setItem('auth_token', token)
        setUser({
          address,
          role,
          isAuthenticated: true
        })

        // Route based on role
        if (role === 'admin') {
          router.push('/admin')
        } else if (role === 'patient') {
          router.push('/patient')
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser({
      address: null,
      role: 'patient',
      isAuthenticated: false
    })
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// JWT Utilities
function generateJWT(address: string, role: string): string {
  // Simple JWT generation (replace with more secure method in production)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    address,
    role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }))
  const signature = btoa(`${header}.${payload}`) // Simplified

  return `${header}.${payload}.${signature}`
}

function parseJwt(token: string): any {
  try {
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Middleware Hook
export const useProtectedRoute = (allowedRoles?: string[]) => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!user.isAuthenticated) {
      router.push('/')
      return
    }

    // If roles are specified, check against user role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/')
    }
  }, [user, router])

  return user
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

// Wrapper for client components
export const withAuth = (Component: React.ComponentType, allowedRoles?: string[]) => {
  return function WrappedComponent(props: any) {
    const user = useProtectedRoute(allowedRoles)

    // Optional: add a loading state
    if (!user.isAuthenticated) {
      return <div>Loading...</div>
    }

    return <Component {...props} />
  }
}
