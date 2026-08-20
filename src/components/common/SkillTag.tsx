import React from 'react';

interface SkillTagProps {
  name: string;
  category?: string;
  level?: string;
}

export const SkillTag: React.FC<SkillTagProps> = ({ name, category, level }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-alt hover:bg-slate-200 border border-border rounded-md text-xs font-medium text-text-primary transition-colors">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
      <span>{name}</span>
      {level && (
        <span className="ml-1 text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-primary-container/10 text-primary rounded">
          {level}
        </span>
      )}
    </div>
  );
};
