import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';

export const JobRoleManagement: React.FC = () => {
  const { jobRoles, skills, addJobRole } = usePassport();
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & Technology');
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id || '');
  const [minLevel, setMinLevel] = useState<'Novice' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [weight, setWeight] = useState(50);

  const handleCreateJobRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addJobRole({
      title,
      department,
      requiredSkills: [
        { skillId: selectedSkillId, minLevel, weight },
        { skillId: skills[1]?.id || selectedSkillId, minLevel: 'Intermediate', weight: 100 - weight },
      ],
    });

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Job Role Specification Manager
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Define corporate job target profiles and mapping weights against the skill taxonomy.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create Job Spec</span>
        </button>
      </div>

      {/* Grid of Job Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobRoles.map((role) => (
          <div key={role.id} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase">{role.department}</span>
                <h3 className="font-headline font-bold text-base text-text-primary">{role.title}</h3>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg">
                {role.requiredSkills.length} Required Skills
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Required Skill Competencies
              </span>
              <div className="space-y-1.5">
                {role.requiredSkills.map((req, idx) => {
                  const targetSkill = skills.find((s) => s.id === req.skillId);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <span className="font-bold text-slate-900">{targetSkill?.name || req.skillId}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-bold font-mono rounded border border-indigo-200">
                          Min: {req.minLevel || req.minimumLevel}
                        </span>
                        <span className="font-mono text-slate-500 font-bold">{req.weight}% Weight</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={handleCreateJobRole} className="bg-surface rounded-3xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-headline font-bold text-base text-text-primary">Create New Job Specification</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead Cloud Architect"
                className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Required Skill</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-bold outline-none"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Minimum Proficiency Level</label>
              <select
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-bold outline-none"
              >
                <option value="Novice">Novice</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Save Job Specification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
