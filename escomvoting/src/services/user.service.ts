import { request } from './client'
import type { UserDTO } from '../model/response/UserDTO'
import type { ImportResponse } from '../model/response/ImportResponse'
import type { PageResponse } from '../model/response/PageResponse'
import type { CreateUserRequest } from '../model/request/CreateUserRequest'
import type { UpdateUserRequest } from '../model/request/UpdateUserRequest'

export const userService = {
  listAll(page = 0, size = 25): Promise<PageResponse<UserDTO>> {
    return request<PageResponse<UserDTO>>('GET', `/api/admin/users?page=${page}&size=${size}`)
  },

  get(id: string): Promise<UserDTO> {
    return request<UserDTO>('GET', `/api/admin/users/${id}`)
  },

  create(body: CreateUserRequest): Promise<UserDTO> {
    return request<UserDTO>('POST', '/api/admin/users', body)
  },

  update(id: string, body: UpdateUserRequest): Promise<UserDTO> {
    return request<UserDTO>('PUT', `/api/admin/users/${id}`, body)
  },

  remove(id: string): Promise<void> {
    return request<void>('DELETE', `/api/admin/users/${id}`)
  },

  resetCredentials(id: string): Promise<UserDTO> {
    return request<UserDTO>('POST', `/api/admin/users/${id}/reset-credentials`)
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
