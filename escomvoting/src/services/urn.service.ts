import { requestAnon } from './client'
import type { UrnResponse } from '../model/response/UrnResponse'

interface UrnParams {
  page?: number
  size?: number
  sort?: 'asc' | 'desc'
  candidateId?: string
  voterGroup?: string
}

export const urnService = {
  getUrn(electionId: string, params: UrnParams = {}): Promise<UrnResponse> {
    const { page = 0, size = 20, sort = 'asc', candidateId, voterGroup } = params
    const qs = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort,
    })
    if (candidateId) qs.set('candidateId', candidateId)
    if (voterGroup)  qs.set('voterGroup', voterGroup)
    return requestAnon<UrnResponse>('GET', `/api/elections/${electionId}/urn?${qs}`)
  },
}
