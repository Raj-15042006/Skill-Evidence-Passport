import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toastMessage } = usePassport();

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex">
      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Content Area (Responsive Padding) */}
      <div className="pl-0 lg:pl-[240px] flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header />

        {/* Dynamic View Canvas */}
        <main className="pt-20 px-4 sm:px-8 pb-16 flex-1 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Toast Notification System */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 max-w-sm sm:max-w-md w-full">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : toastMessage.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toastMessage.type === 'success'
                ? 'check_circle'
                : toastMessage.type === 'warning'
                ? 'warning'
                : toastMessage.type === 'error'
                ? 'error'
                : 'info'}
            </span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
