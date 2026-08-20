import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const AdminOverview: React.FC = () => {
  const { telemetry, auditLogs, setActiveView } = usePassport();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          System Governance Overview
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          System-wide visibility over taxonomy, RBAC user access, tamper-evident audit ledger, and operational telemetry.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">dataset</span>
            </div>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              LIVE METRICS
            </span>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {telemetry.totalSubmissions}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Total Submissions Processed</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {telemetry.approvedCount}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Approved Competencies</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">encrypted</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">
            {auditLogs.length}
          </div>
          <div className="text-xs font-semibold text-text-secondary">Immutable Audit Log Blocks</div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
          </div>
          <div className="font-headline font-extrabold text-3xl text-text-primary mb-1">142ms</div>
          <div className="text-xs font-semibold text-text-secondary">AI Service Response Latency</div>
        </div>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveView('audit-log')}
          className="p-6 bg-surface rounded-2xl border border-border hover:border-primary cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl w-fit">
            <span className="material-symbols-outlined text-[24px]">encrypted</span>
          </div>
          <h3 className="font-headline font-bold text-base text-text-primary group-hover:text-primary">
            Tamper-Evident Audit Ledger →
          </h3>
          <p className="text-xs text-text-secondary">
            Inspect cryptographic SHA-256 hash chains. Run instant integrity verification algorithms.
          </p>
        </div>

        <div
          onClick={() => setActiveView('taxonomy-management')}
          className="p-6 bg-surface rounded-2xl border border-border hover:border-primary cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
            <span className="material-symbols-outlined text-[24px]">account_tree</span>
          </div>
          <h3 className="font-headline font-bold text-base text-text-primary group-hover:text-primary">
            Skill Taxonomy Editor →
          </h3>
          <p className="text-xs text-text-secondary">
            Manage skills, version ontologies without breaking historical records, and define categories.
          </p>
        </div>

        <div
          onClick={() => setActiveView('telemetry')}
          className="p-6 bg-surface rounded-2xl border border-border hover:border-primary cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl w-fit">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
          <h3 className="font-headline font-bold text-base text-text-primary group-hover:text-primary">
            Telemetry & SLA Dashboard →
          </h3>
          <p className="text-xs text-text-secondary">
            Monitor verifier queue depths, SLA turnaround stats, search performance, and AI error rates.
          </p>
        </div>
      </div>
    </div>
  );
};
