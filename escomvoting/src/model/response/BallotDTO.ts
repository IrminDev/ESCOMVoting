export interface BallotDTO {
  id: string
  candidateId: string
  candidateName: string
  voterGroup: string        // STUDENT | PROFESSOR | ADMIN
  nullifier: string         // hex64
  rPrime: string            // uncompressed EC point hex (130 chars)
  sPrime: string            // hex64
  ePrime: string            // hex64
  publicKeyForRole: string  // uncompressed EC point hex for this ballot's group
  submittedAt: string       // ISO-8601
}
