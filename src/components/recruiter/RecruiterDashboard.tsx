import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const RecruiterDashboard: React.FC = () => {
  const { shortlistedCandidateIds, setActiveView } = usePassport();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Recruiter & Talent Scout Portal
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Search verified candidate profiles, compare skills side-by-side, and manage shortlists.
          </p>
        </div>
        <button
          onClick={() => setActiveView('candidate-search')}
          className="bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-teal-800 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_search</span>
          <span>Launch Faceted Candidate Search</span>
        </button>
      </div>

      {/* Recruiter Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              PUBLIC ONLY
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">100%</div>
          <div className="text-xs font-semibold text-text-secondary">Faculty Verified Candidates</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">bookmark</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {shortlistedCandidateIds.length}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Shortlisted Candidates</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">bolt</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">45ms</div>
          <div className="text-xs font-semibold text-text-secondary">Faceted Search Latency</div>
        </div>
      </div>

      {/* Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl shadow-md space-y-4">
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold rounded-full uppercase">
            FACETED MATCHING
          </span>
          <h3 className="font-headline font-bold text-lg">Search Candidates by Verified Skills</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Filter by specific verified skills, minimum rubric proficiency levels (Novice to Expert), and academic department.
          </p>
          <button
            onClick={() => setActiveView('candidate-search')}
            className="px-5 py-2.5 bg-teal-500 text-slate-900 font-bold text-xs rounded-xl hover:bg-teal-400 transition-colors"
          >
            Start Search
          </button>
        </div>

        <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md space-y-4">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded-full uppercase">
            COMPARISON MATRIX
          </span>
          <h3 className="font-headline font-bold text-lg">Side-by-Side Candidate Comparison</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Select shortlisted candidates to compare their verified competency radar charts and evidence depth side by side.
          </p>
          <button
            onClick={() => setActiveView('candidate-comparison')}
            className="px-5 py-2.5 bg-indigo-500 text-white font-bold text-xs rounded-xl hover:bg-indigo-400 transition-colors"
          >
            Open Comparison View
          </button>
        </div>
      </div>
    </div>
  );
};
