export interface UserDTO {
  id: string
  institutionalId: string
  email: string
  name: string
  role: 'STUDENT' | 'PROFESSOR' | 'PAAE'
  active: boolean
}
