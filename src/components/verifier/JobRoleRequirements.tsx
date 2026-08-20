import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const JobRoleRequirements: React.FC = () => {
  const { jobRoles } = usePassport();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Job Role Competency Specifications
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Industry-aligned job role benchmarks specifying minimum proficiency levels per skill.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobRoles.map((role) => (
          <div key={role.id} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                {role.department}
              </span>
              <h3 className="font-headline font-bold text-lg text-text-primary mt-0.5">{role.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{role.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Required Skills</h4>
              <div className="space-y-2">
                {role.requiredSkills.map((req) => (
                  <div key={req.skillId} className="p-3 bg-slate-50 rounded-xl border border-border flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{req.skillName}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary font-mono font-bold rounded">
                      Min: {req.minimumLevel} ({Math.round(req.weight * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
