import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const SkillGrowthTimeline: React.FC = () => {
  const { currentUser, evidences } = usePassport();

  const myApprovedEvidences = evidences
    .filter((e) => e.userId === currentUser.id && e.status === 'APPROVED')
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Competency Growth Timeline
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Chronological progression of verified skills and faculty milestones over time.
        </p>
      </div>

      {/* Timeline Display Card */}
      <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
        {myApprovedEvidences.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <span className="material-symbols-outlined text-[48px]">timeline</span>
            <p className="text-sm font-semibold mt-2">No verified skill milestones yet.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-primary/20 ml-4 pl-8 space-y-8">
            {myApprovedEvidences.map((ev, index) => (
              <div key={ev.id} className="relative group">
                {/* Node Milestone Circle */}
                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-primary/30 ring-4 ring-white">
                  {index + 1}
                </div>

                {/* Milestone Details */}
                <div className="p-5 bg-surface-alt rounded-2xl border border-border hover:border-primary/40 transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      ★ {ev.verification?.proficiencyLevel || 'Verified'}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {new Date(ev.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
                    {ev.skillName}
                  </span>
                  <h3 className="font-headline font-bold text-base text-text-primary">{ev.title}</h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{ev.description}</p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Faculty Verifier: {ev.verification?.verifierName || 'Faculty Verifier'}</span>
                    <span className="font-bold text-emerald-700">Score: {ev.verification?.totalScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
