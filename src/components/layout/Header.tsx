import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { GuidedTourModal } from '../common/GuidedTourModal';
import { AcademicProfileModal } from '../profile/AcademicProfileModal';

export const Header: React.FC = () => {
  const {
    currentRole,
    currentUser,
    telemetry,
    mobileMenuOpen,
    setMobileMenuOpen,
    logout,
  } = usePassport();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'verifier':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'recruiter':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'admin':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[240px] h-16 bg-surface/90 backdrop-blur-xl border-b border-border z-40 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      {/* Mobile Hamburger & Integral Role Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Integral Authenticated Role Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 border rounded-full text-xs font-mono font-bold uppercase tracking-wider ${getRoleBadgeColor(currentRole)}`}>
            ● {currentRole === 'verifier' ? 'Faculty Verifier' : currentRole} Session
          </span>
        </div>
      </div>

      {/* Right side: Tour, Notifications, Authenticated User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Interactive Tour Launch CTA */}
        <button
          onClick={() => setShowTour(!showTour)}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-amber-700">auto_awesome</span>
          <span>Interactive Tour</span>
        </button>



        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDrawer(false);
            }}
            className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface rounded-xl shadow-xl border border-border p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h4 className="font-headline font-bold text-sm text-text-primary">System Activity Notifications</h4>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Live Feed
                  </span>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto py-1">
                  <div className="py-2.5 flex items-start gap-2.5 text-xs">
                    <span className="material-symbols-outlined text-emerald-600 mt-0.5">verified</span>
                    <div>
                      <p className="font-medium text-slate-800">React 18 Evidence Verified</p>
                      <p className="text-slate-500 text-[11px]">Dr. Sarah Jenkins approved your submission with Expert rating.</p>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5 text-xs">
                    <span className="material-symbols-outlined text-amber-600 mt-0.5">auto_awesome</span>
                    <div>
                      <p className="font-medium text-slate-800">AI Scoring Complete</p>
                      <p className="text-slate-500 text-[11px]">Docker & K8s submission processed. Advisory confidence: 88%.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Authenticated User Profile Menu */}
        <div className="relative border-l border-border pl-2 sm:pl-4">
          <button
            onClick={() => {
              setShowProfileDrawer(!showProfileDrawer);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-xl transition-colors text-left"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-border shadow-sm"
            />
            <div className="hidden md:block">
              <div className="font-headline font-bold text-xs text-text-primary leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-text-muted capitalize">
                {currentUser.title || currentUser.role}
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
          </button>

          {showProfileDrawer && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileDrawer(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-xl border border-border p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-sm text-text-primary">{currentUser.name}</h5>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="px-2 py-1.5 text-xs text-slate-600 rounded-lg bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold">Current Role:</span>
                    <span className="font-mono font-bold uppercase text-primary">{currentUser.role}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowAcademicModal(true);
                      setShowProfileDrawer(false);
                    }}
                    className="w-full mt-2 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">school</span>
                      Edit Academic Profile
                    </span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">43k+ Institutes</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full mt-1 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <span>Sign Out</span>
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showTour && <GuidedTourModal onClose={() => setShowTour(false)} />}
      {showAcademicModal && <AcademicProfileModal isOpen={showAcademicModal} onClose={() => setShowAcademicModal(false)} />}
    </header>
  );
};
