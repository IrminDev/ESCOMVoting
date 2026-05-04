import { request } from './client'
import type { LoginRequest } from '../model/request/LoginRequest'
import type { LoginResponse } from '../model/response/LoginResponse'

export const authService = {
  login(body: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>('POST', '/api/auth/login', body)
  },
}
