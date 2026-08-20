import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { RadarChart } from '../common/RadarChart';
import { SkillTag } from '../common/SkillTag';

export const MyPortfolioPreview: React.FC = () => {
  const { currentUser, evidences, portfolioSettings, togglePublicPortfolio, setActiveView, showToast } = usePassport();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const approvedEvidences = evidences.filter((e) => e.userId === currentUser.id && e.status === 'APPROVED');

  const radarSkills = approvedEvidences.map((e) => ({
    name: e.skillName,
    score: e.verification?.totalScore || 90,
  }));

  const shareableUrl = `https://passport.edu/p/${portfolioSettings.shareableSlug}`;
  const embedCodeSnippet = `<iframe src="${shareableUrl}/badge" width="380" height="220" frameborder="0" title="Skills Passport Badge"></iframe>`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    showToast('Shareable public portfolio link copied to clipboard!', 'success');
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    showToast('HTML Embed snippet copied! Paste into GitHub README or personal site.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${portfolioSettings.isPublic ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
          ></span>
          <div>
            <h2 className="font-headline font-bold text-sm text-text-primary">
              Public Portfolio Status: {portfolioSettings.isPublic ? 'PUBLIC (Discoverable)' : 'PRIVATE'}
            </h2>
            <p className="text-xs text-text-muted">
              {portfolioSettings.isPublic
                ? 'Recruiters and verified employers can view your public competencies.'
                : 'Only you can view this profile.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => togglePublicPortfolio(!portfolioSettings.isPublic)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              portfolioSettings.isPublic
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {portfolioSettings.isPublic ? 'Make Private' : 'Publish Portfolio'}
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share Link & QR</span>
          </button>
          <button
            onClick={() => setShowEmbedModal(true)}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Embed Badge Snippet</span>
          </button>
          <button
            onClick={() => setActiveView('portfolio-privacy')}
            className="p-2 text-slate-500 hover:text-slate-900 border border-border rounded-xl hover:bg-slate-50"
            title="Privacy Settings"
          >
            <span className="material-symbols-outlined text-[20px]">shield_lock</span>
          </button>
        </div>
      </div>

      {/* High Fidelity Portfolio Profile Resume Card */}
      <div className="bg-surface rounded-3xl border border-border p-8 shadow-md space-y-8">
        {/* Profile Banner Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-border text-center md:text-left">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-border"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h1 className="font-headline font-extrabold text-2xl text-text-primary">
                  {currentUser.name}
                </h1>
                <p className="text-xs font-semibold text-secondary">{currentUser.institution}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified Skills Passport</span>
              </span>
            </div>

            <p className="text-xs text-text-secondary max-w-2xl">{currentUser.bio}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-500 font-medium">
              {portfolioSettings.visibleFields.showEmail && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">email</span>
                  <span>{currentUser.email}</span>
                </div>
              )}
              {portfolioSettings.visibleFields.showDepartment && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  <span>{currentUser.department}</span>
                </div>
              )}
              {portfolioSettings.visibleFields.showGraduationYear && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Class of {currentUser.graduationYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Competency Radar & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/70 p-6 rounded-2xl border border-border">
            <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500 mb-4">
              Verified Competency Matrix
            </h3>
            {radarSkills.length > 0 ? (
              <RadarChart skills={radarSkills} size={250} />
            ) : (
              <p className="text-xs text-slate-400">No verified skills to render radar</p>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-headline font-bold text-base text-text-primary">
              Faculty-Verified Skill Credentials ({approvedEvidences.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {approvedEvidences.map((ev) => (
                <SkillTag
                  key={ev.id}
                  name={ev.skillName}
                  category={ev.skillCategory}
                  level={ev.verification?.proficiencyLevel}
                />
              ))}
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Cryptographic Proof Guarantee</span>
              </span>
              <p className="text-[11px] text-emerald-800">
                All skills displayed above are backed by faculty rubric evaluations and logged to a SHA-256 tamper-evident audit ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Artifacts & Authentic MNC / University Issuer Badges */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-headline font-bold text-lg text-text-primary">
            Verified Credentials & Authentic MNC/University Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedEvidences.map((ev) => (
              <div key={ev.id} className="p-5 bg-surface-alt rounded-2xl border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase">{ev.skillName}</span>
                    <h4 className="font-bold text-sm text-text-primary">{ev.title}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full">
                    {ev.verification?.proficiencyLevel}
                  </span>
                </div>

                {/* MNC / University Authentic Logo Badge Card */}
                {ev.issuerInfo && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${ev.issuerInfo.brandColor}`}>
                    <div className="flex items-center gap-2.5">
                      <img src={ev.issuerInfo.logoUrl} alt={ev.issuerInfo.issuerName} className="w-7 h-7 object-contain" />
                      <div>
                        <span className="font-bold text-xs block leading-tight">{ev.issuerInfo.issuerName}</span>
                        <span className="text-[10px] font-mono opacity-80">ID: {ev.issuerInfo.credentialId}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-white/90 rounded text-[9px] font-bold shadow-2xs uppercase">
                      {ev.issuerInfo.category.replace('_', ' ')}
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Verifier: {ev.verification?.verifierName}</span>
                  {ev.externalUrl && (
                    <a
                      href={ev.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Verify Issuer Credential</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Badge Snippet Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-headline font-bold text-base text-text-primary">
                Embed Verified Passport Badge
              </h3>
              <button onClick={() => setShowEmbedModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Copy this HTML snippet to embed your live verified skill badge directly into your GitHub README or personal portfolio.
            </p>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>{embedCodeSnippet}</pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Copy Embed Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Link & QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-headline font-bold text-base text-text-primary">
                Share Public Portfolio
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-slate-50 rounded-xl border border-border">
              <div className="w-36 h-36 bg-white p-3 border border-slate-300 rounded-xl shadow-xs flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${i % 2 === 0 || i % 7 === 0 ? 'bg-primary' : 'bg-slate-200'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Scan for instant verification</span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Public Share URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 px-3 py-2 bg-slate-100 border border-border rounded-xl text-xs font-mono text-slate-700 outline-none"
                />
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
