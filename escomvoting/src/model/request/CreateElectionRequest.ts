export interface CandidateInput {
  name: string
  description: string
}

export interface CreateElectionRequest {
  title: string
  description: string
  startDate: string   // ISO-8601 instant, e.g. "2025-06-01T09:00:00Z"
  endDate: string
  allowedRoles: string[]  // "STUDENT" | "PROFESSOR" | "PAAE"
  candidates: CandidateInput[]
}
