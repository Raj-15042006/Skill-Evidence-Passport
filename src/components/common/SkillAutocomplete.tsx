import React, { useState, useMemo } from 'react';
import { searchSkillsDataset, SkillItem } from '../../data/skillsDataset';

interface SkillAutocompleteProps {
  value: string;
  onSelectSkill: (skill: SkillItem) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export const SkillAutocomplete: React.FC<SkillAutocompleteProps> = ({
  value,
  onSelectSkill,
  placeholder = 'Search 800+ Skills (e.g. Python, RAG, Cybersecurity, SolidWorks, Quantum)...',
  className = '',
  label,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    return searchSkillsDataset(query, 'ALL', 25);
  }, [query]);

  const handleSelect = (skill: SkillItem) => {
    setQuery(skill.name);
    onSelectSkill(skill);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl shadow-2xl border border-slate-200 max-h-72 overflow-y-auto divide-y divide-slate-100">
          {results.map((skill) => (
            <div
              key={skill.id}
              onMouseDown={() => handleSelect(skill)}
              className="p-3 hover:bg-indigo-50/80 cursor-pointer transition-colors flex items-start gap-3"
            >
              <span className="material-symbols-outlined text-indigo-600 p-2 bg-indigo-50 rounded-lg shrink-0 text-lg">
                {skill.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">{skill.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{skill.description}</div>
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">
                  {skill.domain}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
