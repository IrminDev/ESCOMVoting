import type { BallotDTO } from './BallotDTO'
import type { CandidateDTO } from './CandidateDTO'
import type { PageResponse } from './PageResponse'

export interface UrnResponse {
  electionId: string
  electionTitle: string
  candidates: CandidateDTO[]
  ballots: PageResponse<BallotDTO>
}
