import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Role } from '../../types/passport';

interface GuidedTourModalProps {
  onClose: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ onClose }) => {
  const { setCurrentRole, setActiveView } = usePassport();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const tourSteps: {
    role: Role;
    view: string;
    title: string;
    description: string;
    highlight: string;
  }[] = [
    {
      role: 'student',
      view: 'dashboard',
      title: '1. Student Dashboard & Competency Matrix',
      description: 'Students view their verified skills, pending reviews, and live radar charts representing faculty-verified rubric scores.',
      highlight: 'Notice the radar visualizer and quick upload CTA.',
    },
    {
      role: 'student',
      view: 'upload-evidence',
      title: '2. 5-Step Evidence Upload Wizard',
      description: 'Students attach GitHub repos, PDF lab reports, or live links. Generates a SHA-256 cryptographic content hash and triggers async AI advisory pre-screening.',
      highlight: 'Try dragging & dropping a file or entering a repo URL.',
    },
    {
      role: 'verifier',
      view: 'verification-queue',
      title: '3. Faculty Verification Queue',
      description: 'Faculty verifiers inspect pending evidence items, sorted by SLA turnaround priority and AI confidence score.',
      highlight: 'Click any queue row to open the dual-panel Evidence Review Workspace.',
    },
    {
      role: 'verifier',
      view: 'dashboard',
      title: '4. Evidence Review Workspace & AI Advisory Flags',
      description: 'Faculty evaluate weighted rubric criteria with interactive sliders, review AI duplicate flags, and render binding decisions.',
      highlight: 'AI never auto-approves. Human faculty decision always overrides AI suggestions.',
    },
    {
      role: 'recruiter',
      view: 'candidate-search',
      title: '5. Recruiter Faceted Candidate Search',
      description: 'Recruiters filter candidates by verified competencies, minimum proficiency levels, and department. Excludes unverified draft skills.',
      highlight: '100% faculty-verified profile guarantees zero resume inflation.',
    },
    {
      role: 'recruiter',
      view: 'candidate-comparison',
      title: '6. Overlapping Candidate Comparison Radar',
      description: 'Recruiters compare shortlisted candidates on a single overlapping dual-radar overlay to identify exact candidate skill shapes.',
      highlight: 'Switch between Overlapping Dual Radar and Side-by-Side matrix columns.',
    },
    {
      role: 'admin',
      view: 'audit-log',
      title: '7. Cryptographic SHA-256 Audit Log Inspector',
      description: 'Every state transition is logged to a tamper-evident hash chain. Admins can run instant integrity verification algorithms.',
      highlight: 'Click "Simulate Data Tamper (Demo)" to see how the ledger instantly flags altered data!',
    },
    {
      role: 'admin',
      view: 'telemetry',
      title: '8. System Telemetry & SLA Analytics',
      description: 'Real-time OpenTelemetry tracking of queue depth, median turnaround hours (SLA <= 48h), AI latency (ms), and search percentiles.',
      highlight: 'Monitors platform performance under load.',
    },
  ];

  const currentStep = tourSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      const nextStep = tourSteps[currentStepIndex + 1];
      setCurrentRole(nextStep.role);
      setActiveView(nextStep.view);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStep = tourSteps[currentStepIndex - 1];
      setCurrentRole(prevStep.role);
      setActiveView(prevStep.view);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const jumpToStep = (index: number) => {
    const step = tourSteps[index];
    setCurrentRole(step.role);
    setActiveView(step.view);
    setCurrentStepIndex(index);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-6 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-400">auto_awesome</span>
            <h3 className="font-headline font-bold text-sm text-white">Interactive Stakeholder Tour</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {currentStepIndex + 1} of {tourSteps.length}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-amber-300">{currentStep.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-[11px] text-emerald-400 font-medium">
            💡 {currentStep.highlight}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {tourSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToStep(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentStepIndex === idx ? 'bg-amber-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            ></button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-semibold"
          >
            End Tour
          </button>

          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-md"
            >
              {currentStepIndex === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
