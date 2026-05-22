import { request, requestAnon } from './client'
import type { CreateElectionRequest } from '../model/request/CreateElectionRequest'
import type { UpdateStatusRequest } from '../model/request/UpdateStatusRequest'
import type { ElectionDTO } from '../model/response/ElectionDTO'
import type { ElectionResultDTO } from '../model/response/ElectionResultDTO'
import type { PageResponse } from '../model/response/PageResponse'

export const electionService = {
  // ── Admin endpoints ──────────────────────────────────────────────────────

  listAll(page = 0, size = 10): Promise<PageResponse<ElectionDTO>> {
    return request<PageResponse<ElectionDTO>>('GET', `/api/admin/elections?page=${page}&size=${size}`)
  },

  create(body: CreateElectionRequest): Promise<ElectionDTO> {
    return request<ElectionDTO>('POST', '/api/admin/elections', body)
  },

  update(id: string, body: CreateElectionRequest): Promise<ElectionDTO> {
    return request<ElectionDTO>('PUT', `/api/admin/elections/${id}`, body)
  },

  updateStatus(id: string, body: UpdateStatusRequest): Promise<ElectionDTO> {
    return request<ElectionDTO>('PUT', `/api/admin/elections/${id}/status`, body)
  },

  // ── Voter endpoints ──────────────────────────────────────────────────────

  /** Elections eligible for the currently authenticated voter. */
  listForVoter(page = 0, size = 20): Promise<PageResponse<ElectionDTO>> {
    return request<PageResponse<ElectionDTO>>('GET', `/api/elections?page=${page}&size=${size}`)
  },

  getById(id: string): Promise<ElectionDTO> {
    return request<ElectionDTO>('GET', `/api/elections/${id}`)
  },

  /** UUIDs of elections where the authenticated voter has already submitted a ballot. */
  getMyVotedElectionIds(): Promise<string[]> {
    return request<string[]>('GET', '/api/elections/my-votes')
  },

  // ── Public endpoints (no auth) ───────────────────────────────────────────

  /** Past elections (CLOSED or TALLIED) — no auth required. */
  listPublicFinished(page = 0, size = 10): Promise<PageResponse<ElectionDTO>> {
    return requestAnon<PageResponse<ElectionDTO>>('GET', `/api/public/elections?page=${page}&size=${size}`)
  },

  /** Public election results (TALLIED only) — paginated. */
  listResults(id: string, page = 0, size = 20): Promise<PageResponse<ElectionResultDTO>> {
    return requestAnon<PageResponse<ElectionResultDTO>>('GET', `/api/elections/${id}/results?page=${page}&size=${size}`)
  },

  /** All candidates tied for the top weighted score. */
  listWinners(id: string): Promise<ElectionResultDTO[]> {
    return requestAnon<ElectionResultDTO[]>('GET', `/api/elections/${id}/winners`)
  },
}
