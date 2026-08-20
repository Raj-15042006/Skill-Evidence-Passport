import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { SkillTag } from '../common/SkillTag';
import { CandidateProfileView } from './CandidateProfileView';

export const CandidateSearch: React.FC = () => {
  const { users, evidences, shortlistedCandidateIds, toggleShortlistCandidate } = usePassport();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');
  const [minProficiencyFilter, setMinProficiencyFilter] = useState<string>('ALL');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const students = users.filter((u) => u.role === 'student');

  const filteredCandidates = students.filter((student) => {
    const studentEvidences = evidences.filter(
      (e) => e.userId === student.id && e.status === 'APPROVED'
    );

    let matchesSkill = true;
    if (selectedSkillFilter !== 'ALL') {
      matchesSkill = studentEvidences.some((e) => e.skillId === selectedSkillFilter);
    }

    let matchesProficiency = true;
    if (minProficiencyFilter !== 'ALL') {
      matchesProficiency = studentEvidences.some((e) => e.verification?.proficiencyLevel === minProficiencyFilter);
    }

    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.department && student.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      studentEvidences.some((e) => e.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSkill && matchesProficiency && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          Faceted Candidate Search
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Search verified public candidate portfolios. Only faculty-approved competencies are indexed.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              person_search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, department, or skill keyword..."
              className="w-full pl-11 pr-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={minProficiencyFilter}
              onChange={(e) => setMinProficiencyFilter(e.target.value)}
              className="px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="ALL">Min Proficiency: All</option>
              <option value="Intermediate">Min: Intermediate</option>
              <option value="Advanced">Min: Advanced</option>
              <option value="Expert">Min: Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((student) => {
          const approvedEvidences = evidences.filter(
            (e) => e.userId === student.id && e.status === 'APPROVED'
          );
          const isShortlisted = shortlistedCandidateIds.includes(student.id);

          return (
            <div
              key={student.id}
              className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border border-border shadow-xs"
                    />
                    <div>
                      <h3 className="font-headline font-bold text-base text-text-primary">{student.name}</h3>
                      <span className="text-xs text-slate-500 block">{student.institution}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleShortlistCandidate(student.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      isShortlisted
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                        : 'bg-slate-50 border-border text-slate-400 hover:text-slate-700'
                    }`}
                    title={isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isShortlisted ? 'bookmark_added' : 'bookmark_add'}
                    </span>
                  </button>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2">{student.bio}</div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                    Verified Competencies ({approvedEvidences.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {approvedEvidences.map((ev) => (
                      <SkillTag
                        key={ev.id}
                        name={ev.skillName}
                        level={ev.verification?.proficiencyLevel}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-emerald-700 font-bold">
                  100% Faculty Verified
                </span>
                <button
                  onClick={() => setSelectedCandidateId(student.id)}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-xs flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Modal */}
      {selectedCandidateId && (
        <CandidateProfileView
          candidateId={selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
        />
      )}
    </div>
  );
};
