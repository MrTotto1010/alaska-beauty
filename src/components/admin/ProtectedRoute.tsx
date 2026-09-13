import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../../services/api'

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [validating, setValidating] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('alaska_admin_token')

      if (!token) {
        setAuthenticated(false)
        setValidating(false)
        return
      }

      try {
        const response = await fetch(`${api.baseUrl}/auth/validate`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          localStorage.removeItem('alaska_admin_token')
          setAuthenticated(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          setAuthenticated(true)
        } else {
          localStorage.removeItem('alaska_admin_token')
          setAuthenticated(false)
        }
      } catch {
        setAuthenticated(false)
      } finally {
        setValidating(false)
      }
    }

    validateSession()
  }, [])

  if (validating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8F8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E6B7BB] border-t-[#590E1A]" />
          <p className="mt-4 text-sm text-[#590E1A]/60">
            Verificando sesión...
          </p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute