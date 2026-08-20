import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { verifySubmittedDocument, DocumentVerificationResult } from '../../services/documentVerifier';
import { ISSUER_REGISTRY, verifyCertificateAuthenticity } from '../../services/issuerRegistry';
import { CertificateIssuerInfo, EvidenceType } from '../../types/passport';
import { VerificationModal } from '../common/VerificationModal';

export const EvidenceUploadWizard: React.FC = () => {
  const { skills, evidences, submitEvidence, setActiveView } = usePassport();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('REPOSITORY');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fileRef, setFileRef] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState<string>('');

  // Certificate Specific Issuer State
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>('google');
  const [credentialId, setCredentialId] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Verification Pop-Up Modal state
  const [verificationErrorModal, setVerificationErrorModal] = useState<{
    show: boolean;
    title: string;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [verificationResult, setVerificationResult] = useState<DocumentVerificationResult | null>(null);

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];
  const selectedIssuer = ISSUER_REGISTRY.find((i) => i.id === selectedIssuerId) || ISSUER_REGISTRY[0];

  const evidenceTypes: { type: EvidenceType; label: string; icon: string; desc: string }[] = [
    { type: 'REPOSITORY', label: 'GitHub / GitLab Repo', icon: 'code', desc: 'Link to a public version-controlled codebase' },
    { type: 'DOCUMENT', label: 'PDF Document / Lab Report', icon: 'description', desc: 'Upload lab reports, architecture docs, or papers' },
    { type: 'PROJECT_URL', label: 'Live Application URL', icon: 'language', desc: 'Link to a deployed web app or cloud API service' },
    { type: 'CERTIFICATE', label: 'MNC / University Certificate', icon: 'workspace_premium', desc: 'Verified MNC (Google, Microsoft, IBM, AWS) or University Certificate' },
    { type: 'VIDEO_DEMO', label: 'Video Demo Link', icon: 'movie', desc: 'Loom or YouTube demo showcasing working functionality' },
    { type: 'CODE_SNIPPET', label: 'Code Snippet', icon: 'terminal', desc: 'Direct code snippet paste with comments' },
  ];

  // Run Document Verification Check before allowing advancing steps
  const validateAndProceedToStep = (targetStep: number) => {
    if (targetStep > step) {
      const res = verifySubmittedDocument(
        fileRef,
        externalUrl,
        evidenceType,
        title || 'Draft Submission Title',
        description || 'Draft description content for testing verification criteria',
        evidences
      );

      setVerificationResult(res);

      if (!res.isVerified && targetStep >= 4) {
        setVerificationErrorModal({
          show: true,
          title: 'Document Verification Gatekeeper Failed',
          errors: res.errors,
          warnings: res.warnings,
        });
        return; // BLOCK STEP ADVANCEMENT
      }
    }
    setStep(targetStep);
  };

  const handleAutoFillDemoData = () => {
    setSelectedSkillId(skills[0]?.id || '');
    setEvidenceType('CERTIFICATE');
    setSelectedIssuerId('google');
    setCredentialId('GOOG-GCP-8849-2025');
    setTitle('Google Cloud Certified Professional Cloud Architect');
    setDescription(
      'Verified Google Cloud Platform (GCP) certification covering Kubernetes Engine (GKE), Docker multi-stage deployments, security IAM, and cloud architecture.'
    );
    setFileRef('gcp_certified_architect.pdf');
    setExternalUrl('https://www.credly.com/org/google');
    setStep(5);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileRef(file.name);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final Gatekeeper Verification
    const res = verifySubmittedDocument(fileRef, externalUrl, evidenceType, title, description, evidences);
    if (!res.isVerified) {
      setVerificationErrorModal({
        show: true,
        title: 'Final Document Verification Failed',
        errors: res.errors,
        warnings: res.warnings,
      });
      return;
    }

    let issuerInfo: CertificateIssuerInfo | undefined = undefined;
    if (evidenceType === 'CERTIFICATE') {
      const authRes = verifyCertificateAuthenticity(selectedIssuerId, credentialId, title);
      issuerInfo = {
        issuerId: authRes.issuer.id,
        issuerName: authRes.issuer.name,
        category: authRes.issuer.category,
        logoUrl: authRes.issuer.logoUrl,
        brandColor: authRes.issuer.brandColor,
        credentialId: authRes.credentialId,
        signatureStatus: authRes.signatureStatus,
        verificationEndpoint: authRes.issuer.verificationEndpoint,
      };
    }

    setIsSubmitting(true);
    try {
      await submitEvidence({
        skillId: selectedSkillId,
        type: evidenceType,
        title,
        description,
        fileRef: fileRef || externalUrl || 'evidence_artifact.zip',
        externalUrl,
      });
      setActiveView('my-evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Evidence Upload Wizard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Submit verifiable proof for faculty rubric evaluation and MNC/University certificate authentication.
          </p>
        </div>

        <button
          onClick={handleAutoFillDemoData}
          className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Fill Demo Data</span>
        </button>
      </div>

      {/* Progress Step Bar */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        {[1, 2, 3, 4, 5].map((sIndex) => {
          const labels = ['Select Skill', 'Choose Type', 'Upload & Issuer', 'Description', 'Review & Submit'];
          const isActive = step === sIndex;
          const isDone = step > sIndex;

          return (
            <div key={sIndex} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 ring-4 ring-primary/10'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isDone ? <span className="material-symbols-outlined text-[16px]">check</span> : sIndex}
              </div>
              <span
                className={`hidden md:block text-xs font-semibold ${
                  isActive ? 'text-primary font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {labels[sIndex - 1]}
              </span>
              {sIndex < 5 && <div className="hidden md:block flex-1 h-0.5 bg-slate-200 mx-2"></div>}
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
        {/* Step 1: Select Skill */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-lg text-text-primary">Step 1: Select Target Skill</h2>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Skill Ontology Taxonomy
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSkillId === skill.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                        : 'border-border bg-surface-alt hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-white rounded-lg shadow-xs text-primary">
                        <span className="material-symbols-outlined text-[20px]">{skill.icon}</span>
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-secondary uppercase block">{skill.category}</span>
                        <h4 className="font-bold text-xs text-slate-900">{skill.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => validateAndProceedToStep(2)}
                className="bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Next: Choose Type →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Evidence Type */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-lg text-text-primary">Step 2: Choose Evidence Artifact Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evidenceTypes.map((et) => (
                <div
                  key={et.type}
                  onClick={() => setEvidenceType(et.type)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    evidenceType === et.type
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                      : 'border-border bg-surface-alt hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2.5 bg-white rounded-lg shadow-xs text-primary">
                      <span className="material-symbols-outlined text-[22px]">{et.icon}</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{et.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{et.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-slate-100 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                onClick={() => validateAndProceedToStep(3)}
                className="bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Next: Upload Artifact & Issuer →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Artifact & Select Certificate Issuer */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-lg text-text-primary">
              Step 3: Upload File & Authenticate Certificate Issuer
            </h2>

            {/* MNC / University Issuer Selector (if type === CERTIFICATE) */}
            {evidenceType === 'CERTIFICATE' && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-border space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <span className="material-symbols-outlined text-[22px] text-primary">verified</span>
                  <h3 className="font-headline font-bold text-sm text-text-primary">
                    MNC / University Certificate Authenticator
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Issuing MNC or Institution *
                    </label>
                    <select
                      value={selectedIssuerId}
                      onChange={(e) => setSelectedIssuerId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-bold text-slate-900 outline-none"
                    >
                      <optgroup label="Top MNCs & Tech Giants">
                        {ISSUER_REGISTRY.filter((i) => i.category === 'MNC').map((i) => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Learning Platforms">
                        {ISSUER_REGISTRY.filter((i) => i.category === 'PLATFORM').map((i) => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Indian Universities & IITs">
                        {ISSUER_REGISTRY.filter((i) => i.category === 'INDIAN_UNIVERSITY').map((i) => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Global Universities">
                        {ISSUER_REGISTRY.filter((i) => i.category === 'GLOBAL_UNIVERSITY').map((i) => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Credential Serial ID / Certificate Code
                    </label>
                    <input
                      type="text"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      placeholder="e.g. GOOG-GCP-8849-2025"
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-mono text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* Selected Issuer Preview Badge */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${selectedIssuer.brandColor}`}>
                  <div className="flex items-center gap-3">
                    <img src={selectedIssuer.logoUrl} alt="" className="w-8 h-8 object-contain" />
                    <div>
                      <span className="font-bold text-xs block">{selectedIssuer.name}</span>
                      <span className="text-[10px] font-mono">Digital RSA-256 Issuer Signature Enforced</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white rounded-full text-[10px] font-bold shadow-xs border border-border flex items-center gap-1 text-emerald-800">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                    <span>AUTHENTICATED</span>
                  </span>
                </div>
              </div>
            )}

            {/* Drag & Drop Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="p-8 border-2 border-dashed border-slate-300 hover:border-primary rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
            >
              <div className="p-3 bg-white rounded-full shadow-sm text-primary mb-3">
                <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag and drop your file here, or <span className="text-primary underline">browse local files</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Accepts PDF, ZIP, DOCX, MP4 (Max 50MB)</p>
              <input
                type="file"
                className="hidden"
                id="file-upload-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileRef(e.target.files[0].name);
                    if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                  }
                }}
              />
              <label
                htmlFor="file-upload-input"
                className="mt-4 px-4 py-2 bg-white border border-border text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                Select File
              </label>
            </div>

            {fileRef && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">attachment</span>
                  <span>Attached File: {fileRef}</span>
                </div>
                <button onClick={() => setFileRef('')} className="text-emerald-700 hover:text-emerald-900">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* External URL Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                External Verification Link (Credly / Coursera / Certificate URL)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => {
                  setExternalUrl(e.target.value);
                  if (!fileRef) setFileRef(e.target.value);
                }}
                placeholder="https://www.credly.com/org/google"
                className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-slate-100 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                onClick={() => validateAndProceedToStep(4)}
                className="bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Next: Add Description →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Description & Details */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-lg text-text-primary">Step 4: Title & Detailed Description</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Evidence Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Google Cloud Certified Professional Cloud Architect"
                  className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Description & Implementation Highlights *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your role, key technical implementation choices, test coverage, and benchmark results..."
                  className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="bg-slate-100 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                onClick={() => validateAndProceedToStep(5)}
                className="bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Next: Review Submission →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-lg text-text-primary">Step 5: Review & Submit Evidence</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold font-mono rounded-full border border-emerald-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Document Verified 100%</span>
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-3 text-xs">
              {evidenceType === 'CERTIFICATE' && (
                <div className="p-3 bg-white border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={selectedIssuer.logoUrl} alt="" className="w-7 h-7 object-contain" />
                    <div>
                      <span className="font-bold text-slate-900 block">{selectedIssuer.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">ID: {credentialId || 'GOOG-GCP-8849'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    OFFICIAL MNC ISSUER
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Target Skill:</span>
                <span className="font-bold text-primary">{selectedSkill.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Artifact Type:</span>
                <span className="font-bold text-slate-900">{evidenceType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Title:</span>
                <span className="font-bold text-slate-900">{title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">File / Link Reference:</span>
                <span className="font-mono text-slate-800 truncate max-w-xs">{fileRef || externalUrl || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Description:</span>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-900">
              <span className="material-symbols-outlined text-[20px] text-indigo-600 mt-0.5">auto_awesome</span>
              <div>
                <p className="font-bold">Automated Advisory Pre-Screening</p>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Submitting will calculate a SHA-256 content hash, log an immutable audit record, and trigger the advisory AI scoring engine for faculty pre-screening.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-slate-100 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-700 text-white font-bold text-xs px-8 py-3 rounded-xl hover:bg-emerald-800 shadow-md shadow-emerald-700/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>{isSubmitting ? 'Submitting...' : 'Submit Evidence Now'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Verification Error Pop-Up Modal */}
      {verificationErrorModal?.show && (
        <VerificationModal
          title={verificationErrorModal.title}
          errors={verificationErrorModal.errors}
          warnings={verificationErrorModal.warnings}
          onClose={() => setVerificationErrorModal(null)}
        />
      )}
    </div>
  );
};
