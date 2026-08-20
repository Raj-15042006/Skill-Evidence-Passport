import React from 'react';

interface VerificationModalProps {
  title: string;
  errors: string[];
  warnings?: string[];
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  title,
  errors,
  warnings = [],
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface rounded-3xl border border-rose-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
        {/* Error Header Icon */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center font-bold shadow-sm">
            <span className="material-symbols-outlined text-[28px]">gpp_bad</span>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block">
              VERIFICATION GATEKEEPER BLOCKED
            </span>
            <h3 className="font-headline font-bold text-lg text-text-primary">{title}</h3>
          </div>
        </div>

        {/* Error Bullet Details */}
        {errors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-rose-700">error</span>
              <span>Verification Errors ({errors.length})</span>
            </h4>
            <ul className="space-y-1.5 pl-5 list-disc text-xs text-rose-900 leading-relaxed">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning Bullet Details */}
        {warnings.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-700">warning</span>
              <span>Advisory Warnings</span>
            </h4>
            <ul className="space-y-1.5 pl-5 list-disc text-xs text-amber-900 leading-relaxed">
              {warnings.map((warn, idx) => (
                <li key={idx}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-text-secondary leading-relaxed">
          Please resolve the verification issues listed above before attempting to proceed to the next page.
        </p>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-rose-700 text-white font-bold text-xs rounded-xl hover:bg-rose-800 shadow-md shadow-rose-700/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">build</span>
            <span>Fix Requirements & Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
