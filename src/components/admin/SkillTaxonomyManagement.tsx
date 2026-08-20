import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';

export const SkillTaxonomyManagement: React.FC = () => {
  const { skills, addSkillToTaxonomy } = usePassport();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<'Software Engineering' | 'Data Science' | 'Cybersecurity' | 'Cloud & DevOps' | 'UI/UX Design' | 'Soft Skills'>('Software Engineering');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName || !newDescription) return;

    addSkillToTaxonomy({
      name: newSkillName,
      category: newCategory,
      description: newDescription,
      icon: 'code',
      rubricCriteria: [
        { id: `crit-${Date.now()}-1`, name: 'Technical Execution & Architecture', description: 'Code quality and design patterns', maxPoints: 25, weight: 0.4 },
        { id: `crit-${Date.now()}-2`, name: 'Testing & Documentation', description: 'Unit test coverage and README documentation', maxPoints: 25, weight: 0.6 },
      ],
    });

    setNewSkillName('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Skill Taxonomy Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Maintain the skill ontology tree and bump version numbers without breaking historical evidence records.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-primary-hover transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Taxonomy Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{skill.category}</span>
              <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10px] font-bold rounded">
                Version {skill.taxonomyVersion}.0
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-text-primary">{skill.name}</h3>
            <p className="text-xs text-text-secondary line-clamp-3">{skill.description}</p>
            <div className="pt-3 border-t border-border text-[11px] text-slate-500 font-semibold">
              Rubric Criteria: {skill.rubricCriteria.length} criteria defined
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={handleCreate} className="bg-surface rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-headline font-bold text-base text-text-primary">Add Skill to Taxonomy</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Skill Name *</label>
              <input
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. GraphQL & Apollo Federation"
                className="w-full px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs font-bold outline-none"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Skill scope and core competency requirements..."
                className="w-full px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs outline-none"
              />
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Create Skill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
