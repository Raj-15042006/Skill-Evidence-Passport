import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { StatusBadge } from '../common/StatusBadge';

export const VerifierDashboard: React.FC = () => {
  const { evidences, setActiveView } = usePassport();

  const pendingEvidences = evidences.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'AI_SCREENED' || e.status === 'IN_REVIEW'
  );
  const reviewedEvidences = evidences.filter((e) => e.verification !== undefined);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Faculty Verifier Workspace
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Review queued evidence, inspect AI advisory suggestions, score weighted rubrics, and render decisions.
          </p>
        </div>
        <button
          onClick={() => setActiveView('verification-queue')}
          className="bg-amber-600 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-amber-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">fact_check</span>
          <span>Open Verification Queue ({pendingEvidences.length})</span>
        </button>
      </div>

      {/* Verifier Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              SLA &lt; 48H
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {pendingEvidences.length}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Pending In Queue</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {reviewedEvidences.length}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Completed Reviews</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">18.4h</div>
          <div className="text-xs font-semibold text-text-secondary">Median Turnaround SLA</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">91%</div>
          <div className="text-xs font-semibold text-text-secondary">AI-Verifier Agreement Rate</div>
        </div>
      </div>

      {/* Priority Review Queue Preview */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="font-headline font-bold text-base text-text-primary">
              Priority Verification Queue
            </h2>
            <p className="text-xs text-text-muted">Submissions pre-screened by AI Engine</p>
          </div>
          <button
            onClick={() => setActiveView('verification-queue')}
            className="text-xs text-primary font-bold hover:underline"
          >
            View Full Queue →
          </button>
        </div>

        <div className="divide-y divide-border">
          {pendingEvidences.map((ev) => (
            <div key={ev.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={ev.studentAvatar}
                  alt={ev.studentName}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-text-primary">{ev.studentName}</h3>
                    <span className="text-xs text-slate-400">• {ev.department}</span>
                  </div>
                  <span className="text-xs font-semibold text-secondary">{ev.skillName}</span>
                  <p className="text-xs text-slate-600 mt-1">{ev.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                {ev.aiScore && (
                  <div className="text-right text-xs">
                    <span className="text-slate-500 font-semibold block">AI Advisory</span>
                    <span className="font-mono text-indigo-700 font-bold">
                      {ev.aiScore.suggestedLevel} ({Math.round(ev.aiScore.confidenceScore * 100)}% conf)
                    </span>
                  </div>
                )}
                <StatusBadge status={ev.status} size="sm" />
                <button
                  onClick={() => setActiveView('verification-queue')}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-xs"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
