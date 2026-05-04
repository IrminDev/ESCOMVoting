import { secp256k1 } from '@noble/curves/secp256k1.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, hexToBytes, concatBytes } from '@noble/hashes/utils.js'

// secp256k1 group order
const n: bigint = secp256k1.Point.CURVE().n

function sha256AsBigInt(...parts: Uint8Array[]): bigint {
  const hash = sha256(concatBytes(...parts))
  return BigInt('0x' + bytesToHex(hash)) % n
}

export interface BlindingResult {
  alpha: bigint
  beta: bigint
  rPrime: string   // hex-encoded uncompressed EC point
  ePrime: bigint
  c: bigint        // blinded challenge to send to server
}

/**
 * Step 2 — blind the server's R point.
 * Returns blinding state needed for unblinding and nullifier.
 */
export function blind(
  rPointHex: string,
  publicKeyHex: string,
  electionId: string,
  candidateId: string,
  voterGroup: string,
): BlindingResult {
  const R = secp256k1.Point.fromHex(rPointHex)
  const P = secp256k1.Point.fromHex(publicKeyHex)
  const G = secp256k1.Point.BASE

  const alpha = randomScalar()
  const beta  = randomScalar()

  // R' = R + α·G + β·P (uncompressed)
  const RPrimeBytes: Uint8Array = R
    .add(G.multiply(alpha))
    .add(P.multiply(beta))
    .toBytes(false)

  const encoder = new TextEncoder()
  const m = sha256(concatBytes(
    encoder.encode(electionId),
    encoder.encode(candidateId),
    encoder.encode(voterGroup),
  ))

  // e' = SHA-256(R' ∥ m) mod n
  const ePrime: bigint = sha256AsBigInt(RPrimeBytes, m)

  // c = e' - β (mod n)
  const c: bigint = ((ePrime - beta) % n + n) % n

  return { alpha, beta, rPrime: bytesToHex(RPrimeBytes), ePrime, c }
}

/**
 * Step 4 — unblind server response s to obtain s' = s + α (mod n).
 */
export function unblind(sHex: string, alpha: bigint): bigint {
  const s: bigint = BigInt('0x' + sHex)
  return ((s + alpha) % n + n) % n
}

export function bigIntToHex64(value: bigint): string {
  return value.toString(16).padStart(64, '0')
}

/**
 * Nullifier = SHA-256(α ∥ β ∥ electionId) — unique to this blinding, server-unlinkable.
 */
export function computeNullifier(alpha: bigint, beta: bigint, electionId: string): string {
  const encoder = new TextEncoder()
  const hash = sha256(concatBytes(
    hexToBytes(bigIntToHex64(alpha)),
    hexToBytes(bigIntToHex64(beta)),
    encoder.encode(electionId),
  ))
  return bytesToHex(hash)
}

/**
 * Verify a blind Schnorr signature by checking s'·G + e'·P = R'.
 * Returns true if the equation holds, false otherwise (including on parse errors).
 */
export function verifySchnorr(
  rPrimeHex: string,
  sPrimeHex: string,
  ePrimeHex: string,
  publicKeyHex: string,
): boolean {
  try {
    const G = secp256k1.Point.BASE
    const P = secp256k1.Point.fromHex(publicKeyHex)
    const RPrime = secp256k1.Point.fromHex(rPrimeHex)
    const sPrime = BigInt('0x' + sPrimeHex)
    const ePrime = BigInt('0x' + ePrimeHex)
    // s'·G + e'·P must equal R'
    const lhs = G.multiply(sPrime).add(P.multiply(ePrime))
    return bytesToHex(lhs.toBytes(false)) === bytesToHex(RPrime.toBytes(false))
  } catch {
    return false
  }
}

function randomScalar(): bigint {
  const bytes = secp256k1.utils.randomSecretKey()
  const v: bigint = BigInt('0x' + bytesToHex(bytes)) % (n - 1n)
  return v + 1n
}
