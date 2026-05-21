export interface CreateUserRequest {
  institutionalId: string
  email: string
  name: string
  role: 'STUDENT' | 'PROFESSOR' | 'PAAE'
  password: string
  admin: boolean
}
