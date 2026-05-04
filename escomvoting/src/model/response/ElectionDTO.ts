import type { CandidateDTO } from './CandidateDTO'

export interface ElectionDTO {
  id: string
  title: string
  description: string
  startDate: string       // ISO-8601
  endDate: string
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'TALLIED'
  allowedRoles: string[]
  publicKeys: Record<string, string>  // role → hex public key
  candidates: CandidateDTO[]
}
