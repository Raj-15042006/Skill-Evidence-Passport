import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { RadarChart } from '../common/RadarChart';
import { StatusBadge } from '../common/StatusBadge';

export const StudentDashboard: React.FC = () => {
  const { currentUser, evidences, setActiveView } = usePassport();

  const myEvidences = evidences.filter((e) => e.userId === currentUser.id);
  const verifiedCount = myEvidences.filter((e) => e.status === 'APPROVED').length;
  const pendingCount = myEvidences.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'AI_SCREENED' || e.status === 'IN_REVIEW'
  ).length;

  const radarSkills = [
    { name: 'React 18 & TS', score: 98 },
    { name: 'Spring Microservices', score: 92 },
    { name: 'Python ML Pipelines', score: 85 },
    { name: 'K8s & CI/CD', score: 75 },
    { name: 'App Security', score: 68 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Student Passport Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back, <span className="font-bold text-primary">{currentUser.name}</span>. Here is your verified competency breakdown.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('academic-profile')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-3 rounded-xl border border-slate-300 transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">school</span>
            <span>Academic Profile</span>
          </button>
          <button
            onClick={() => setActiveView('upload-evidence')}
            className="bg-primary text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-primary-hover transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add New Evidence</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              AUDIT READY
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {verifiedCount}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Verified Competencies</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              IN QUEUE
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {pendingCount}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Pending Faculty Verification</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">supervisor_account</span>
            </div>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              FACULTY NETWORK
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">5</div>
          <div className="text-xs font-semibold text-text-secondary">Active Faculty Verifiers</div>
        </div>
      </div>

      {/* Main Split Layout: Competency Radar + Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Matrix Card */}
        <div className="lg:col-span-6 bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h2 className="font-headline font-bold text-base text-text-primary">
                Competency Matrix Visualizer
              </h2>
              <p className="text-xs text-text-muted">Real-time normalized rubric scores</p>
            </div>
            <button
              onClick={() => setActiveView('portfolio-preview')}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>View Portfolio</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="py-4 flex justify-center">
            <RadarChart skills={radarSkills} size={280} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Top Category</span>
              <span className="font-bold text-xs text-primary">Software Engineering</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Avg Rubric Score</span>
              <span className="font-bold text-xs text-emerald-700">95.0 / 100</span>
            </div>
          </div>
        </div>

        {/* Recent Submissions List */}
        <div className="lg:col-span-6 bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h2 className="font-headline font-bold text-base text-text-primary">
                Recent Submissions & Reviews
              </h2>
              <p className="text-xs text-text-muted">Track status transitions</p>
            </div>
            <button
              onClick={() => setActiveView('my-evidence')}
              className="text-xs text-primary font-bold hover:underline"
            >
              View All ({myEvidences.length})
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {myEvidences.map((ev) => (
              <div
                key={ev.id}
                className="p-4 bg-surface-alt rounded-xl border border-border hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-secondary tracking-wider block">
                      {ev.skillName}
                    </span>
                    <h3 className="font-headline font-bold text-sm text-text-primary mt-0.5">
                      {ev.title}
                    </h3>
                  </div>
                  <StatusBadge status={ev.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  {ev.verification ? (
                    <span className="font-semibold text-emerald-700">
                      Score: {ev.verification.totalScore}/100 ({ev.verification.proficiencyLevel})
                    </span>
                  ) : <span></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
