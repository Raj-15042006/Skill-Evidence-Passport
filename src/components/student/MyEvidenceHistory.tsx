import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Evidence } from '../../types/passport';
import { StatusBadge } from '../common/StatusBadge';

export const MyEvidenceHistory: React.FC = () => {
  const { currentUser, evidences } = usePassport();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<Evidence | null>(null);

  const myEvidences = evidences.filter((e) => e.userId === currentUser.id);

  const filteredEvidences = myEvidences.filter((e) => {
    if (selectedStatus === 'ALL') return true;
    return e.status === selectedStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          My Evidence History
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Review all submitted evidence, AI advisory scoring feedback, and faculty verifier decisions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        {['ALL', 'APPROVED', 'AI_SCREENED', 'IN_REVIEW', 'NEEDS_INFO', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvidences.map((ev) => (
          <div
            key={ev.id}
            className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold uppercase text-secondary tracking-wider block">
                  {ev.skillName}
                </span>
                <StatusBadge status={ev.status} size="sm" />
              </div>

              <h3 className="font-headline font-bold text-base text-text-primary">{ev.title}</h3>
              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">{ev.description}</p>

              {/* Status specific banner */}
              {ev.needsInfoComment && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <span className="font-bold block">Faculty Request:</span>
                  {ev.needsInfoComment}
                </div>
              )}

              {ev.verification && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Verified by {ev.verification.verifierName}</span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      Rating: {ev.verification.proficiencyLevel} ({ev.verification.totalScore}/100)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified</span>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                Submitted: {new Date(ev.submittedAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setActiveEvidenceModal(ev)}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>View Full Details</span>
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail View */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold text-secondary uppercase">{activeEvidenceModal.skillName}</span>
                <h3 className="font-headline font-bold text-lg text-text-primary mt-0.5">
                  {activeEvidenceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge status={activeEvidenceModal.status} size="md" />
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-border">
                {activeEvidenceModal.description}
              </p>
            </div>

            {/* AI Advisory Pre-Screening Summary */}
            {activeEvidenceModal.aiScore && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-indigo-900 font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-indigo-600">auto_awesome</span>
                    <span>AI Advisory Pre-Screening Result</span>
                  </div>
                  <span className="font-mono bg-white px-2 py-0.5 rounded text-[11px] text-indigo-800">
                    Confidence: {Math.round(activeEvidenceModal.aiScore.confidenceScore * 100)}%
                  </span>
                </div>
                <p className="text-indigo-800 text-[11px]">{activeEvidenceModal.aiScore.summary}</p>
              </div>
            )}

            {/* Verification Details */}
            {activeEvidenceModal.verification && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
                  <span>Faculty Verification Decision</span>
                </h4>
                <p className="text-emerald-800 font-medium">
                  {activeEvidenceModal.verification.comments}
                </p>
                <div className="text-[11px] text-emerald-700 pt-2 border-t border-emerald-200/60 flex justify-between">
                  <span>Verifier: {activeEvidenceModal.verification.verifierName}</span>
                  <span>Decided: {new Date(activeEvidenceModal.verification.decidedAt).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
