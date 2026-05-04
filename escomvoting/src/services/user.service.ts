import { request } from './client'
import type { UserDTO } from '../model/response/UserDTO'
import type { ImportResponse } from '../model/response/ImportResponse'
import type { PageResponse } from '../model/response/PageResponse'

export const userService = {
  listAll(page = 0, size = 25): Promise<PageResponse<UserDTO>> {
    return request<PageResponse<UserDTO>>('GET', `/api/admin/users?page=${page}&size=${size}`)
  },

  importCsv(file: File): Promise<ImportResponse> {
    const form = new FormData()
    form.append('file', file)
    return request<ImportResponse>('POST', '/api/admin/users/import', form)
  },
}
