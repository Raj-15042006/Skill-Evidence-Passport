import assert from 'assert';
import { decryptData, encryptData, generateHMACSignature, verifyHMACSignature } from '../server/crypto.js';
import { evaluateEvidenceWithAI } from '../src/services/aiEngine';
import { AuditLedger, computeLogHash } from '../src/services/auditEngine';
import { verifySubmittedDocument } from '../src/services/documentVerifier';
import { ISSUER_REGISTRY, verifyCertificateAuthenticity } from '../src/services/issuerRegistry';
import { Skill } from '../src/types/passport';

console.log('==================================================');
console.log('   RUNNING SKILLS EVIDENCE PASSPORT TEST SUITE    ');
console.log('==================================================\n');

let passedCount = 0;
let totalCount = 0;

function runTest(testName: string, testFn: () => void) {
  totalCount++;
  try {
    testFn();
    passedCount++;
    console.log(`  ✓ PASSED: ${testName}`);
  } catch (err: any) {
    console.error(`  ✗ FAILED: ${testName}`);
    console.error(`    Error: ${err.message}`);
  }
}

// 1. Audit Engine Tests
runTest('Audit Engine - SHA-256 Hash Chaining', () => {
  const hash1 = computeLogHash('1', 'usr-1', 'LOG_IN', 'GENESIS', '0');
  assert.strictEqual(typeof hash1, 'string');
  assert.strictEqual(hash1.length, 64);
});

runTest('Audit Engine - Cryptographic Tamper Detection', () => {
  const ledger = new AuditLedger();
  ledger.appendLog('usr-1', 'Alex Rivera', 'student', 'EVIDENCE_SUBMITTED', 'EVIDENCE', 'ev-1', 'Initial payload');
  ledger.appendLog('usr-2', 'Dr. Jenkins', 'verifier', 'VERIFICATION_DECIDED', 'EVIDENCE', 'ev-1', 'Approved payload');

  const initialCheck = ledger.verifyIntegrity();
  assert.strictEqual(initialCheck.isValid, true);

  // Tamper record 0
  ledger.tamperRecord(0);
  const tamperedCheck = ledger.verifyIntegrity();
  assert.strictEqual(tamperedCheck.isValid, false);
  assert.strictEqual(tamperedCheck.brokenIndex, 0);
});

// 2. Cryptographic Security Tests (CIA Triad)
runTest('Crypto Security - AES-256-GCM Encryption & Decryption', () => {
  const plainText = 'Sensitive Evidence Confidential Payload';
  const encrypted = encryptData(plainText);
  assert.ok(encrypted.iv);
  assert.ok(encrypted.encryptedData);
  assert.ok(encrypted.tag);

  const decrypted = decryptData(encrypted.encryptedData, encrypted.iv, encrypted.tag);
  assert.strictEqual(decrypted, plainText);
});

runTest('Crypto Security - HMAC-SHA256 Payload Signature Verification', () => {
  const payload = JSON.stringify({ student: 'Alex Rivera', score: 98 });
  const signature = generateHMACSignature(payload);
  assert.strictEqual(typeof signature, 'string');
  assert.strictEqual(signature.length, 64);

  const isValid = verifyHMACSignature(payload, signature);
  assert.strictEqual(isValid, true);
});

// 3. Document Verifier Tests
runTest('Document Verifier - Valid File Format', () => {
  const res = verifySubmittedDocument(
    'project_report.pdf',
    'https://github.com/alex/project',
    'DOCUMENT',
    'High Performance React Virtualization Engine',
    'Detailed implementation of virtualized rendering engine handling 100k data points sub-50ms.',
    []
  );
  assert.strictEqual(res.isVerified, true);
  assert.strictEqual(res.errors.length, 0);
});

runTest('Document Verifier - Invalid File Format Blocked', () => {
  const res = verifySubmittedDocument(
    'malicious_script.exe',
    '',
    'DOCUMENT',
    'Test Title',
    'Detailed description string for testing validation logic.',
    []
  );
  assert.strictEqual(res.isVerified, false);
  assert.ok(res.errors.some((e) => e.includes('Invalid file format')));
});

runTest('Document Verifier - Duplicate SHA-256 Hash Detection', () => {
  const mockExisting = [
    {
      id: 'ev-1',
      userId: 'usr-1',
      studentName: 'Alex',
      studentAvatar: '',
      studentEmail: '',
      department: '',
      skillId: 'sk-1',
      skillName: 'React',
      skillCategory: 'Frontend',
      type: 'REPOSITORY' as const,
      title: 'Duplicate Title',
      description: 'Duplicate description text payload',
      fileRef: 'repo.zip',
      status: 'APPROVED' as const,
      submittedAt: '',
      updatedAt: '',
      contentHash: Array.from('Duplicate TitleDuplicate description text payloadrepo.zip')
        .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
        .toString(16)
        .padStart(64, '0'),
    },
  ];

  const res = verifySubmittedDocument('repo.zip', '', 'REPOSITORY', 'Duplicate Title', 'Duplicate description text payload', mockExisting);
  assert.strictEqual(res.isVerified, false);
  assert.ok(res.errors.some((e) => e.includes('Duplicate submission detected')));
});

// 4. MNC & University Certificate Authenticity Verification Tests
runTest('Certificate Authenticity - MNC & University Issuer Registry', () => {
  assert.ok(ISSUER_REGISTRY.length >= 8);

  const googleVerification = verifyCertificateAuthenticity('google', 'GOOG-GCP-8849', 'Google Cloud Certified Cloud Architect');
  assert.strictEqual(googleVerification.isAuthenticated, true);
  assert.strictEqual(googleVerification.issuer.id, 'google');
  assert.strictEqual(googleVerification.issuer.category, 'MNC');
  assert.ok(googleVerification.issuer.logoUrl.includes('google'));

  const iitbVerification = verifyCertificateAuthenticity('iit_bombay', 'IITB-NPTEL-9921', 'IIT Bombay PyTorch Machine Learning Specialization');
  assert.strictEqual(iitbVerification.isAuthenticated, true);
  assert.strictEqual(iitbVerification.issuer.id, 'iit_bombay');
  assert.strictEqual(iitbVerification.issuer.category, 'INDIAN_UNIVERSITY');
});

// 5. AI Engine Advisory Pre-Screening Tests
runTest('AI Engine - Advisory Pre-Screening & Rubric Scoring', () => {
  const mockSkill: Skill = {
    id: 'sk-react',
    name: 'React 18 Architecture',
    category: 'Frontend Development',
    taxonomyVersion: 1,
    description: 'React state hooks fiber architecture virtual DOM',
    rubricCriteria: [
      { id: 'c1', name: 'State Management', maxPoints: 50, description: '' },
      { id: 'c2', name: 'Component Design', maxPoints: 50, description: '' },
    ],
  };

  const res = evaluateEvidenceWithAI(
    'React 18 Dashboard Engine',
    'Implements custom React 18 state management hooks and virtual DOM optimization.',
    'REPOSITORY',
    mockSkill,
    []
  );

  assert.ok(res.confidenceScore > 0.5);
  assert.ok(res.rubricSuggestions['c1'] !== undefined);
});

console.log('\n==================================================');
console.log(`   TEST SUMMARY: ${passedCount} / ${totalCount} PASSED`);
console.log('==================================================\n');

if (passedCount !== totalCount) {
  process.exit(1);
}
