import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const PortfolioPrivacySettings: React.FC = () => {
  const { portfolioSettings, updatePortfolioPrivacy, togglePublicPortfolio } = usePassport();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Portfolio Privacy & Data Visibility
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Control which verified fields are visible on your public portfolio to recruiters and third parties.
        </p>
      </div>

      {/* Public Visibility Toggle */}
      <div className="p-6 bg-surface rounded-2xl border border-border shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-headline font-bold text-base text-text-primary">
            Public Portfolio Discoverability
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-md">
            When enabled, recruiters can search your verified competencies and view your public share link.
          </p>
        </div>

        <button
          onClick={() => togglePublicPortfolio(!portfolioSettings.isPublic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            portfolioSettings.isPublic ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              portfolioSettings.isPublic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Field Privacy Matrix */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <h3 className="font-headline font-bold text-sm text-text-primary border-b border-border pb-3">
          Granular Field Visibility Controls
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Show Student Email Address</span>
              <span className="text-[11px] text-slate-500">Allow recruiters to see your university email</span>
            </div>
            <input
              type="checkbox"
              checked={portfolioSettings.visibleFields.showEmail}
              onChange={(e) => updatePortfolioPrivacy({ showEmail: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Show Department & Major</span>
              <span className="text-[11px] text-slate-500">Display Computer Science / Engineering department badge</span>
            </div>
            <input
              type="checkbox"
              checked={portfolioSettings.visibleFields.showDepartment}
              onChange={(e) => updatePortfolioPrivacy({ showDepartment: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Show Graduation Batch Year</span>
              <span className="text-[11px] text-slate-500">Display Class of 2025 badge</span>
            </div>
            <input
              type="checkbox"
              checked={portfolioSettings.visibleFields.showGraduationYear}
              onChange={(e) => updatePortfolioPrivacy({ showGraduationYear: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="font-bold text-xs text-slate-900 block">Show Skill Growth Timeline</span>
              <span className="text-[11px] text-slate-500">Display chronological milestone progression</span>
            </div>
            <input
              type="checkbox"
              checked={portfolioSettings.visibleFields.showTimeline}
              onChange={(e) => updatePortfolioPrivacy({ showTimeline: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
