import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, verifyAuditLedgerIntegrity, tamperAuditLedgerForDemo, showToast } = usePassport();
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    brokenIndex: number | null;
    message: string;
  } | null>(null);

  const handleRunIntegrityCheck = () => {
    const res = verifyAuditLedgerIntegrity();
    setVerificationResult(res);
    if (res.isValid) {
      showToast('SHA-256 Hash Chain Integrity Verified 100% Valid!', 'success');
    } else {
      showToast(`Integrity Check Failed: ${res.message}`, 'error');
    }
  };

  const handleSimulateTamper = () => {
    if (auditLogs.length > 1) {
      tamperAuditLedgerForDemo(1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-indigo-700">encrypted</span>
            <span>Tamper-Evident SHA-256 Audit Ledger</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Immutable hash-chained ledger where every state transition is cryptographically linked to previous entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateTamper}
            className="px-4 py-2.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors"
          >
            Simulate Data Tamper (Demo)
          </button>
          <button
            onClick={handleRunIntegrityCheck}
            className="px-5 py-2.5 bg-indigo-700 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 shadow-md shadow-indigo-700/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Verify Ledger Integrity</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-in fade-in ${
            verificationResult.isValid
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">
              {verificationResult.isValid ? 'check_circle' : 'gpp_bad'}
            </span>
            <div>
              <p className="font-bold text-sm">
                Ledger Status: {verificationResult.isValid ? '100% HEALTHY' : 'DATA TAMPERING DETECTED!'}
              </p>
              <p className="text-[11px] mt-0.5">{verificationResult.message}</p>
            </div>
          </div>
          {verificationResult.brokenIndex !== null && (
            <span className="px-3 py-1 bg-rose-200 text-rose-900 font-mono font-bold rounded-full text-[11px]">
              Broken Index: #{verificationResult.brokenIndex}
            </span>
          )}
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Payload Summary</th>
                <th className="py-3.5 px-4">SHA-256 Hash Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {auditLogs.map((log, index) => {
                const isBroken = verificationResult && !verificationResult.isValid && verificationResult.brokenIndex === index;
                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-100/80 transition-colors ${
                      isBroken ? 'bg-rose-100 text-rose-900 font-bold' : index % 2 === 1 ? 'bg-slate-50/40' : 'bg-surface'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">{index}</td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-900">
                      {log.actorName} <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 max-w-xs truncate">
                      {log.payloadSummary}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[10px] text-slate-400">Prev: {log.prevHash.substring(0, 12)}...</div>
                      <div className="font-bold text-indigo-700">Hash: {log.hash.substring(0, 16)}...</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
