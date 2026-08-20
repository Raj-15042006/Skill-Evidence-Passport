import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Skill } from '../../types/passport';

export const RubricManagement: React.FC = () => {
  const { skills, updateSkillTaxonomy } = usePassport();
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [editingCriteria, setEditingCriteria] = useState<Skill['rubricCriteria']>(
    skills[0]?.rubricCriteria || []
  );

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  const handleSkillChange = (id: string) => {
    setSelectedSkillId(id);
    const target = skills.find((s) => s.id === id);
    if (target) setEditingCriteria(target.rubricCriteria);
  };

  const handleSave = () => {
    updateSkillTaxonomy(selectedSkillId, { rubricCriteria: editingCriteria });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Rubric Criteria Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure weighted rubric criteria, maximum point allocations, and grading specifications per skill.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Skill Taxonomy Target
          </label>
          <div className="space-y-2">
            {skills.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSkillChange(s.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedSkillId === s.id
                    ? 'border-primary bg-primary/5 shadow-sm font-bold text-primary ring-1 ring-primary/20'
                    : 'border-border bg-surface hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">{s.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">v{s.taxonomyVersion}.0</span>
                </div>
                <span className="text-[10px] font-semibold text-secondary block mt-1">{s.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Criteria Editor */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold text-secondary uppercase">{selectedSkill.category}</span>
              <h2 className="font-headline font-bold text-lg text-text-primary mt-0.5">
                {selectedSkill.name} Rubric Rules
              </h2>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm"
            >
              Save Rubric Rules
            </button>
          </div>

          <div className="space-y-4">
            {editingCriteria.map((crit, index) => (
              <div key={crit.id} className="p-4 bg-slate-50 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={crit.name}
                    onChange={(e) => {
                      const updated = [...editingCriteria];
                      updated[index].name = e.target.value;
                      setEditingCriteria(updated);
                    }}
                    className="flex-1 font-bold text-xs text-slate-900 bg-white px-3 py-1.5 border border-border rounded-lg outline-none"
                  />
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span>Max Pts:</span>
                    <input
                      type="number"
                      value={crit.maxPoints}
                      onChange={(e) => {
                        const updated = [...editingCriteria];
                        updated[index].maxPoints = parseInt(e.target.value) || 0;
                        setEditingCriteria(updated);
                      }}
                      className="w-16 px-2 py-1 bg-white border border-border rounded-lg text-center outline-none"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={crit.description}
                  onChange={(e) => {
                    const updated = [...editingCriteria];
                    updated[index].description = e.target.value;
                    setEditingCriteria(updated);
                  }}
                  className="w-full text-xs text-slate-700 bg-white p-2.5 border border-border rounded-lg outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
