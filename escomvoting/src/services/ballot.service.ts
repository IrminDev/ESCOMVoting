import { request, requestAnon } from './client'
import type { TokenSignRequest } from '../model/request/TokenSignRequest'
import type { VoteRequest } from '../model/request/VoteRequest'
import type { TokenRequestResponse } from '../model/response/TokenRequestResponse'
import type { TokenSignResponse } from '../model/response/TokenSignResponse'

export const ballotService = {
  /** Step 1 — request a commitment point R from the server (auth required). */
  requestToken(electionId: string): Promise<TokenRequestResponse> {
    return request<TokenRequestResponse>('POST', `/api/elections/${electionId}/token/request`)
  },

  /** Step 3 — send blinded challenge c, receive s (auth required). */
  signToken(electionId: string, body: TokenSignRequest): Promise<TokenSignResponse> {
    return request<TokenSignResponse>('POST', `/api/elections/${electionId}/token/sign`, body)
  },

  /** Step 5 — submit anonymous ballot (no auth). */
  submitVote(electionId: string, body: VoteRequest): Promise<void> {
    return requestAnon<void>('POST', `/api/elections/${electionId}/vote`, body)
  },
}
