export interface LoginResponse {
  success: boolean
  token?: string
  message?: string
}

export interface AuthUser {
  id: number
  nombre: string
  username: string
}