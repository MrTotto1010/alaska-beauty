import { api } from './api'
import type { LoginResponse } from '../types/auth'

interface LoginCredentials {
  username: string
  password: string
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch(`${api.baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data: LoginResponse = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'No se pudo iniciar sesión.')
  }

  return data
}