export interface UpdateUserRequest {
  institutionalId: string
  email: string
  name: string
  role: 'STUDENT' | 'PROFESSOR' | 'PAAE'
  admin: boolean
  active: boolean
}
