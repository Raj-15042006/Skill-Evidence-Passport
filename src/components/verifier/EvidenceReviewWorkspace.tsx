import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Evidence } from '../../types/passport';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationModal } from '../common/VerificationModal';

interface EvidenceReviewWorkspaceProps {
  evidence: Evidence;
  onClose: () => void;
}

export const EvidenceReviewWorkspace: React.FC<EvidenceReviewWorkspaceProps> = ({ evidence, onClose }) => {
  const { skills, decideVerification } = usePassport();

  const targetSkill = skills.find((s) => s.id === evidence.skillId) || skills[0];

  const initialScores: Record<string, number> = {};
  targetSkill.rubricCriteria.forEach((crit) => {
    const aiSug = evidence.aiScore?.rubricSuggestions[crit.id];
    initialScores[crit.id] = aiSug !== undefined ? aiSug : Math.floor(crit.maxPoints * 0.85);
  });

  const [rubricScores, setRubricScores] = useState<Record<string, number>>(initialScores);
  const [proficiencyLevel, setProficiencyLevel] = useState<'Novice' | 'Intermediate' | 'Advanced' | 'Expert'>(
    evidence.aiScore?.suggestedLevel || 'Advanced'
  );
  const [comments, setComments] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideField, setShowOverrideField] = useState<boolean>(false);

  // Verification Pop-Up Modal state
  const [verificationErrorModal, setVerificationErrorModal] = useState<{
    show: boolean;
    title: string;
    errors: string[];
  } | null>(null);

  const totalScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);

  const handleDecision = (decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO') => {
    if (decision === 'APPROVE') {
      const errors: string[] = [];

      targetSkill.rubricCriteria.forEach((crit) => {
        const score = rubricScores[crit.id];
        if (score === undefined || score === null) {
          errors.push(`Criterion "${crit.name}" has not been evaluated.`);
        }
      });

      if (!comments || comments.trim().length < 5) {
        errors.push('Verifier feedback and rationale is required (minimum 5 characters).');
      }

      if (showOverrideField && (!overrideReason || overrideReason.trim().length < 5)) {
        errors.push('AI Advisory Override checkbox is selected, but no override justification was provided.');
      }

      if (errors.length > 0) {
        setVerificationErrorModal({
          show: true,
          title: 'Rubric Evaluation Verification Incomplete',
          errors,
        });
        return; // BLOCK DECISION
      }
    }

    decideVerification(
      evidence.id,
      decision,
      proficiencyLevel,
      rubricScores,
      comments || (decision === 'APPROVE' ? 'Evidence satisfies rubric criteria.' : 'Action required on evidence submission.'),
      showOverrideField ? overrideReason : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in">
      <div className="bg-surface rounded-3xl border border-border shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src={evidence.studentAvatar}
              alt={evidence.studentName}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-base text-text-primary">{evidence.studentName}</h2>
                <span className="text-xs text-slate-400">• {evidence.department}</span>
              </div>
              <span className="text-xs font-semibold text-secondary">{evidence.skillName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={evidence.status} size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Panel: Artifact Preview & MNC Certificate Authenticity */}
          <div className="lg:col-span-6 border-r border-border p-6 overflow-y-auto space-y-6 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Evidence Artifact Preview
              </span>
              <h3 className="font-headline font-bold text-lg text-text-primary mt-0.5">{evidence.title}</h3>
            </div>

            {/* Authentic MNC / University Certificate Issuer Card */}
            {evidence.issuerInfo && (
              <div className={`p-4 rounded-2xl border ${evidence.issuerInfo.brandColor} space-y-2 shadow-xs`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={evidence.issuerInfo.logoUrl} alt="" className="w-8 h-8 object-contain" />
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{evidence.issuerInfo.issuerName}</h4>
                      <span className="text-[11px] font-mono opacity-80">Credential Serial ID: {evidence.issuerInfo.credentialId}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white/90 rounded-full text-[10px] font-bold text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    <span>AUTHENTICATED</span>
                  </span>
                </div>
                <div className="text-[11px] font-mono pt-1 border-t border-black/10 flex justify-between items-center">
                  <span>Signature: {evidence.issuerInfo.signatureStatus}</span>
                  <a
                    href={evidence.issuerInfo.verificationEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:opacity-80"
                  >
                    Verify Issuer Registry →
                  </a>
                </div>
              </div>
            )}



            {/* Simulated File/Code Viewer Box */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs space-y-3 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span>Ref: {evidence.fileRef}</span>
                <span>Type: {evidence.type}</span>
              </div>
              <pre className="text-emerald-400 text-[11px] leading-relaxed whitespace-pre-wrap">
                {`// Extracted Evidence Payload & Meta Highlights\n// Student: ${evidence.studentName}\n// Skill Target: ${evidence.skillName}\n\n${evidence.description}`}
              </pre>
            </div>

            {/* AI Advisory Summary Box */}
            {evidence.aiScore && (
              <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-indigo-950">
                    <span className="material-symbols-outlined text-[20px] text-indigo-600">auto_awesome</span>
                    <span>AI Advisory Pre-Screening Analysis</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-indigo-900 font-mono font-bold border border-indigo-200 text-[11px]">
                    Confidence: {Math.round(evidence.aiScore.confidenceScore * 100)}%
                  </span>
                </div>

                <p className="text-indigo-900 text-xs leading-relaxed">{evidence.aiScore.summary}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Faculty Rubric Scoring & Decision Form */}
          <div className="lg:col-span-6 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-headline font-bold text-base text-text-primary">
                  Weighted Rubric Assessment
                </h3>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Score</span>
                  <span className="font-headline font-extrabold text-xl text-emerald-700">{totalScore} / 100</span>
                </div>
              </div>

              {/* Rubric Criteria Sliders/Inputs */}
              <div className="space-y-4">
                {targetSkill.rubricCriteria.map((crit) => {
                  const currentVal = rubricScores[crit.id] || 0;
                  return (
                    <div key={crit.id} className="p-4 bg-slate-50 rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{crit.name}</span>
                        <span className="font-mono text-emerald-700">
                          {currentVal} / {crit.maxPoints} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{crit.description}</p>
                      <input
                        type="range"
                        min={0}
                        max={crit.maxPoints}
                        value={currentVal}
                        onChange={(e) =>
                          setRubricScores({
                            ...rubricScores,
                            [crit.id]: parseInt(e.target.value),
                          })
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Suggested Level Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assigned Proficiency Level
                </label>
                <select
                  value={proficiencyLevel}
                  onChange={(e) => setProficiencyLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="Novice">Novice</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Verifier Comments */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Verifier Feedback & Rationale *
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter feedback for student or details on rubric points..."
                  className="w-full px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs outline-none"
                />
              </div>

              {/* AI Override Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={showOverrideField}
                    onChange={(e) => setShowOverrideField(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Override AI Advisory Score Suggestion</span>
                </label>
                {showOverrideField && (
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Provide justification for overriding AI recommendation..."
                    className="w-full mt-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 outline-none"
                  />
                )}
              </div>
            </div>

            {/* Decision CTAs */}
            <div className="pt-4 border-t border-border grid grid-cols-3 gap-3">
              <button
                onClick={() => handleDecision('REQUEST_INFO')}
                className="px-4 py-2.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-200 border border-amber-300"
              >
                Needs Info
              </button>
              <button
                onClick={() => handleDecision('REJECT')}
                className="px-4 py-2.5 bg-rose-100 text-rose-900 font-bold text-xs rounded-xl hover:bg-rose-200 border border-rose-300"
              >
                Reject
              </button>
              <button
                onClick={() => handleDecision('APPROVE')}
                className="px-4 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
              >
                Approve Evidence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Gatekeeper Pop-Up Modal */}
      {verificationErrorModal?.show && (
        <VerificationModal
          title={verificationErrorModal.title}
          errors={verificationErrorModal.errors}
          onClose={() => setVerificationErrorModal(null)}
        />
      )}
    </div>
  );
};
