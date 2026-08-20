import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { StatusBadge } from '../common/StatusBadge';

export const VerificationHistory: React.FC = () => {
  const { evidences } = usePassport();

  const historyEvidences = evidences.filter((e) => e.verification !== undefined);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Verification Decision Archive
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Historical record of all faculty rubric scores, decisions, and AI override explanations.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Skill</th>
                <th className="py-3.5 px-4">Decision</th>
                <th className="py-3.5 px-4">Score & Rating</th>
                <th className="py-3.5 px-4">Verifier</th>
                <th className="py-3.5 px-4">Decided At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyEvidences.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ev.studentName}</td>
                  <td className="py-3.5 px-4 font-semibold text-secondary">{ev.skillName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ev.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {ev.verification?.totalScore}/100 ({ev.verification?.proficiencyLevel})
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{ev.verification?.verifierName}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(ev.verification?.decidedAt || '').toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
