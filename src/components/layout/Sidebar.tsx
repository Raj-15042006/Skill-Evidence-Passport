import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    activeView,
    setActiveView,
    evidences,
    shortlistedCandidateIds,
    mobileMenuOpen,
    setMobileMenuOpen,
    logout,
  } = usePassport();

  const pendingQueueCount = evidences.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'AI_SCREENED' || e.status === 'IN_REVIEW'
  ).length;

  const getNavItems = () => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
          { id: 'academic-profile', label: 'Academic Profile', icon: 'school' },
          { id: 'browse-skills', label: 'Browse Skills', icon: 'search' },
          { id: 'upload-evidence', label: 'Add Evidence', icon: 'add_circle' },
          { id: 'my-evidence', label: 'My Evidence', icon: 'verified_user' },
          { id: 'growth-timeline', label: 'Growth Timeline', icon: 'timeline' },
          { id: 'portfolio-preview', label: 'Portfolio Preview', icon: 'preview' },
          { id: 'portfolio-privacy', label: 'Privacy Settings', icon: 'shield_lock' },
        ];
      case 'verifier':
        return [
          { id: 'dashboard', label: 'Verifier Dashboard', icon: 'space_dashboard' },
          { id: 'verification-queue', label: 'Verification Queue', icon: 'fact_check', badge: pendingQueueCount },
          { id: 'rubric-management', label: 'Rubric Management', icon: 'rule' },
          { id: 'verification-history', label: 'Verification History', icon: 'history' },
          { id: 'job-roles', label: 'Job Role Specs', icon: 'work' },
        ];
      case 'recruiter':
        return [
          { id: 'dashboard', label: 'Recruiter Dashboard', icon: 'insights' },
          { id: 'candidate-search', label: 'Candidate Search', icon: 'person_search' },
          { id: 'candidate-comparison', label: 'Compare Candidates', icon: 'compare_arrows' },
          { id: 'shortlist', label: 'Shortlist', icon: 'bookmark', badge: shortlistedCandidateIds.length },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'System Overview', icon: 'monitoring' },
          { id: 'taxonomy-management', label: 'Skill Taxonomy', icon: 'account_tree' },
          { id: 'job-role-management', label: 'Job Role Manager', icon: 'work_history' },
          { id: 'user-management', label: 'User Access Directory', icon: 'group' },
          { id: 'audit-log', label: 'Audit Log Inspector', icon: 'encrypted' },
          { id: 'telemetry', label: 'Telemetry & Analytics', icon: 'analytics' },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        ></div>
      )}

      {/* Responsive Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-border flex flex-col z-50 shadow-sm transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-base text-primary leading-tight tracking-tight">
                Skills Passport
              </h1>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                Evidence Notary
              </span>
            </div>
          </div>

          {/* Close drawer button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Role Access Pill Banner */}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="px-3 py-1 bg-surface-container-low rounded-lg inline-flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-secondary-fixed-variant">
                {currentRole} ACCESS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span className="text-xs tracking-tight">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-primary' : 'bg-warning-fill text-warning-text'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer & Logout */}
        <div className="p-4 border-t border-border bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 truncate">
              <img src={currentUser.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="truncate">{currentUser.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono text-center">
            ● Cryptographically Verified
          </div>
        </div>
      </aside>
    </>
  );
};
