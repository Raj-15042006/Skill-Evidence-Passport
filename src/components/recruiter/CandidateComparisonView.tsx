import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { DualRadarOverlay } from '../common/DualRadarOverlay';
import { RadarChart } from '../common/RadarChart';

export const CandidateComparisonView: React.FC = () => {
  const { users, evidences, skills } = usePassport();
  const students = users.filter((u) => u.role === 'student');

  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([
    students[0]?.id || '',
    students[1]?.id || '',
  ]);
  const [viewMode, setViewMode] = useState<'SIDE_BY_SIDE' | 'OVERLAY'>('OVERLAY');

  const toggleCandidateForCompare = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds(selectedCandidateIds.filter((cId) => cId !== id));
      }
    } else {
      if (selectedCandidateIds.length < 3) {
        setSelectedCandidateIds([...selectedCandidateIds, id]);
      }
    }
  };

  const selectedStudents = students.filter((s) => selectedCandidateIds.includes(s.id));

  // Prepare colors for overlay radar
  const colors = ['#006a63', '#1e3a8a', '#b45309'];

  const dualRadarData = selectedStudents.map((student, idx) => {
    const approvedEvidences = evidences.filter((e) => e.userId === student.id && e.status === 'APPROVED');
    return {
      candidateName: student.name,
      color: colors[idx % colors.length],
      skills: approvedEvidences.map((e) => ({
        name: e.skillName,
        score: e.verification?.totalScore || 85,
      })),
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Candidate Competency Comparison Matrix
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Compare candidate competency radar targets and rubric scores side-by-side or overlaid.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode('OVERLAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'OVERLAY' ? 'bg-surface text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overlapping Dual Radar
          </button>
          <button
            onClick={() => setViewMode('SIDE_BY_SIDE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'SIDE_BY_SIDE' ? 'bg-surface text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side Columns
          </button>
        </div>
      </div>

      {/* Candidate Selector Chips */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Up to 3 Candidates to Compare
        </span>
        <div className="flex flex-wrap gap-2">
          {students.map((s) => {
            const isSelected = selectedCandidateIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleCandidateForCompare(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <img src={s.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                <span>{s.name}</span>
                {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay View Mode */}
      {viewMode === 'OVERLAY' && (
        <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm space-y-6 flex flex-col items-center">
          <div className="text-center">
            <h3 className="font-headline font-bold text-lg text-text-primary">
              Overlapping Competency Overlay Radar
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Directly compare skill shapes and relative strengths across candidates.
            </p>
          </div>

          <div className="py-4">
            <DualRadarOverlay candidatesData={dualRadarData} size={320} />
          </div>
        </div>
      )}

      {/* Side-by-Side Column Matrix */}
      {viewMode === 'SIDE_BY_SIDE' && (
        <div className={`grid grid-cols-1 md:grid-cols-${selectedStudents.length} gap-6`}>
          {selectedStudents.map((student) => {
            const approvedEvidences = evidences.filter((e) => e.userId === student.id && e.status === 'APPROVED');
            const radarSkills = approvedEvidences.map((e) => ({
              name: e.skillName,
              score: e.verification?.totalScore || 85,
            }));

            return (
              <div key={student.id} className="bg-surface rounded-3xl border border-border p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-headline font-bold text-base text-text-primary">{student.name}</h3>
                      <span className="text-xs text-secondary font-semibold">{student.department}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-border flex flex-col items-center justify-center">
                    <RadarChart skills={radarSkills} size={210} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                      Competency Score Breakdown
                    </h4>
                    <div className="space-y-2">
                      {skills.map((skill) => {
                        const ev = approvedEvidences.find((e) => e.skillId === skill.id);
                        return (
                          <div key={skill.id} className="p-3 bg-slate-50 rounded-xl border border-border flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-800">{skill.name}</span>
                            {ev ? (
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {ev.verification?.totalScore}/100 ({ev.verification?.proficiencyLevel})
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">Unverified</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
