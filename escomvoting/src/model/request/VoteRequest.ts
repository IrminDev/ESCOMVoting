export interface VoteRequest {
  candidateId: string
  voterGroup: string      // STUDENT | PROFESSOR
  nullifier: string       // hex64 SHA-256 of blinding factors
  rPrime: string          // hex uncompressed EC point (130 chars)
  sPrime: string          // hex64 unblinded scalar
  ePrime: string          // hex64 unblinded challenge
}
