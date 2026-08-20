import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Skill } from '../../types/passport';
import { SkillTag } from '../common/SkillTag';

export const BrowseSkills: React.FC = () => {
  const { skills, setActiveView } = usePassport();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectSkill, setInspectSkill] = useState<Skill | null>(null);

  const categories = ['ALL', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'ALL' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Competency & Skill Ontology Taxonomy
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Explore standardized university competency criteria, weighted scoring rubrics, and target job role mappings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competency name, category, or evaluation criteria..."
            className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Taxonomy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-primary/10 rounded-xl text-primary">
                  <span className="material-symbols-outlined text-[24px]">{skill.icon}</span>
                </span>
                <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 px-2.5 py-0.5 rounded-full">
                  {skill.category}
                </span>
              </div>

              <h3 className="font-headline font-bold text-base text-text-primary">{skill.name}</h3>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{skill.description}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {skill.rubricCriteria.length} Rubric Criteria
              </span>
              <button
                onClick={() => setInspectSkill(skill)}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>View Rubric</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Skill Rubric Modal */}
      {inspectSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-xl text-primary">
                  <span className="material-symbols-outlined text-[24px]">{inspectSkill.icon}</span>
                </span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-text-primary">{inspectSkill.name}</h3>
                  <span className="text-xs font-semibold text-secondary">{inspectSkill.category}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectSkill(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500">
                Weighted Rubric Evaluation Criteria
              </h4>

              <div className="space-y-3">
                {inspectSkill.rubricCriteria.map((crit) => (
                  <div key={crit.id} className="p-4 bg-slate-50 rounded-xl border border-border space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                      <span>{crit.name}</span>
                      <span className="font-mono text-emerald-700">{crit.maxPoints} Points Max ({crit.weight || 25}%)</span>
                    </div>
                    <p className="text-xs text-slate-600">{crit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <button
                onClick={() => setInspectSkill(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectSkill(null);
                  setActiveView('upload-evidence');
                }}
                className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-sm"
              >
                Submit Evidence for Skill →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
