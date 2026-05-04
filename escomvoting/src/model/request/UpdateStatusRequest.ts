export type ElectionStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'TALLIED'

export interface UpdateStatusRequest {
  status: ElectionStatus
}
