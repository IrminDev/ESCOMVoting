import { request } from './client'
import type { UserDTO } from '../model/response/UserDTO'
import type { ImportResponse } from '../model/response/ImportResponse'
import type { PageResponse } from '../model/response/PageResponse'
import type { CreateUserRequest } from '../model/request/CreateUserRequest'

export const userService = {
  listAll(page = 0, size = 25): Promise<PageResponse<UserDTO>> {
    return request<PageResponse<UserDTO>>('GET', `/api/admin/users?page=${page}&size=${size}`)
  },

  create(body: CreateUserRequest): Promise<UserDTO> {
    return request<UserDTO>('POST', '/api/admin/users', body)
  },

  importCsv(file: File): Promise<ImportResponse> {
    const form = new FormData()
    form.append('file', file)
    return request<ImportResponse>('POST', '/api/admin/users/import', form)
  },

  getProfile(): Promise<UserDTO> {
    return request<UserDTO>('GET', '/api/me')
  },

  updateProfile(body: any): Promise<UserDTO> {
    return request<UserDTO>('PUT', '/api/me', body)
  },
}
