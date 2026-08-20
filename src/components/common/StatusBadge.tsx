import React from 'react';
import { EvidenceStatus } from '../../types/passport';

interface StatusBadgeProps {
  status: EvidenceStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let bgColor = 'bg-slate-100';
  let textColor = 'text-slate-700';
  let icon = 'help_outline';
  let label = status;

  switch (normalized) {
    case 'APPROVED':
    case 'VERIFIED':
      bgColor = 'bg-success-fill';
      textColor = 'text-success-text';
      icon = 'check_circle';
      label = 'VERIFIED';
      break;
    case 'AI_SCREENED':
    case 'IN_REVIEW':
    case 'SUBMITTED':
      bgColor = 'bg-warning-fill';
      textColor = 'text-warning-text';
      icon = 'pending_actions';
      label = normalized === 'AI_SCREENED' ? 'AI SCREENED' : 'IN REVIEW';
      break;
    case 'NEEDS_INFO':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      icon = 'error_outline';
      label = 'NEEDS INFO';
      break;
    case 'REJECTED':
      bgColor = 'bg-error-fill';
      textColor = 'text-error-text';
      icon = 'cancel';
      label = 'REJECTED';
      break;
    case 'DRAFT':
      bgColor = 'bg-slate-200';
      textColor = 'text-slate-600';
      icon = 'edit_note';
      label = 'DRAFT';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold gap-1',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-sm font-bold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wider uppercase font-mono ${bgColor} ${textColor} ${sizeClasses}`}
    >
      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
};
