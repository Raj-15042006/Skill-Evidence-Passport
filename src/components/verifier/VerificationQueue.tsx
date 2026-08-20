import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Evidence } from '../../types/passport';
import { StatusBadge } from '../common/StatusBadge';
import { EvidenceReviewWorkspace } from './EvidenceReviewWorkspace';

export const VerificationQueue: React.FC = () => {
  const { evidences } = usePassport();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('PENDING');
  const [selectedEvidenceForReview, setSelectedEvidenceForReview] = useState<Evidence | null>(null);

  const filteredEvidences = evidences.filter((ev) => {
    let matchesStatus = true;
    if (selectedStatusFilter === 'PENDING') {
      matchesStatus = ev.status === 'SUBMITTED' || ev.status === 'AI_SCREENED' || ev.status === 'IN_REVIEW';
    } else if (selectedStatusFilter !== 'ALL') {
      matchesStatus = ev.status === selectedStatusFilter;
    }

    const matchesSearch =
      ev.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Calculate SLA countdown string helper
  const getSLAStatus = (submittedAt: string) => {
    const elapsedHours = (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60);
    const remainingHours = Math.max(Math.round(48 - elapsedHours), 0);

    if (remainingHours <= 0) {
      return { text: 'SLA EXPIRED', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (remainingHours <= 12) {
      return { text: `SLA: ${remainingHours}h remaining (URGENT)`, badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { text: `SLA: ${remainingHours}h remaining`, badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Faculty Verification Queue
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Review evidence submissions, verify rubric criteria, and issue binding competency decisions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, skill, or evidence title..."
            className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['PENDING', 'ALL', 'APPROVED', 'NEEDS_INFO', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatusFilter === filter
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Candidate Student</th>
                <th className="py-3.5 px-4">Target Skill</th>
                <th className="py-3.5 px-4">SLA Clock</th>
                <th className="py-3.5 px-4">AI Advisory Pre-Screen</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEvidences.map((ev, index) => {
                  const sla = getSLAStatus(ev.submittedAt);
                  return (
                    <tr
                      key={ev.id}
                      onClick={() => setSelectedEvidenceForReview(ev)}
                      className={`hover:bg-slate-100/80 cursor-pointer transition-colors ${
                        index % 2 === 1 ? 'bg-slate-50/40' : 'bg-surface'
                      }`}
                    >
                      {/* Student Cell */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.studentAvatar}
                            alt={ev.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{ev.studentName}</div>
                            <div className="text-[10px] text-slate-400">{ev.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Skill Cell */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-secondary">{ev.skillName}</span>
                        <span className="text-[10px] text-slate-400 block">{ev.skillCategory}</span>
                      </td>

                      {/* SLA Clock Cell */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 border rounded font-mono font-bold text-[10px] ${sla.badgeClass}`}>
                          {sla.text}
                        </span>
                      </td>

                      {/* AI Score Cell */}
                      <td className="py-3.5 px-4">
                        {ev.aiScore ? (
                          <div>
                            <span className="font-bold text-indigo-700 block">
                              {ev.aiScore.suggestedLevel} ({Math.round(ev.aiScore.confidenceScore * 100)}%)
                            </span>
                            {ev.aiScore.similarityFlag && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                ⚠ Similarity Warning
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Manual Queue</span>
                        )}
                      </td>

                      {/* Status Cell */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ev.status} size="sm" />
                      </td>

                      {/* Action Cell */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvidenceForReview(ev);
                          }}
                          className="px-3 py-1.5 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary-hover shadow-xs"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Workspace Modal/Drawer */}
      {selectedEvidenceForReview && (
        <EvidenceReviewWorkspace
          evidence={selectedEvidenceForReview}
          onClose={() => setSelectedEvidenceForReview(null)}
        />
      )}
    </div>
  );
};
