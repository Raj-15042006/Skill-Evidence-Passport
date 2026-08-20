import crypto from 'crypto';

// 256-bit key for AES-256-GCM encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  : crypto.scryptSync('passport_cia_confidentiality_secret_key_2026', 'salt', 32);

const HMAC_SECRET = process.env.HMAC_SECRET || 'passport_cia_integrity_hmac_secret_2026';

/**
 * 1. CONFIDENTIALITY: AES-256-GCM Authenticated Encryption at Rest
 */
export function encryptData(text) {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    tag,
  };
}

export function decryptData(encryptedData, ivHex, tagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * 2. INTEGRITY: HMAC-SHA256 Payload Signature
 */
export function generateHMACSignature(payload) {
  return crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
}

export function verifyHMACSignature(payload, signature) {
  const expected = generateHMACSignature(payload);
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
}

/**
 * SHA-256 Hash Chaining
 */
export function computeSHA256Hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}
