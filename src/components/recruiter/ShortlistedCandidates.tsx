import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { SkillTag } from '../common/SkillTag';

export const ShortlistedCandidates: React.FC = () => {
  const { users, evidences, shortlistedCandidateIds, toggleShortlistCandidate, setActiveView } = usePassport();

  const shortlistedStudents = users.filter(
    (u) => u.role === 'student' && shortlistedCandidateIds.includes(u.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end pb-4 border-b border-border">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
            Shortlisted Candidate Folder ({shortlistedStudents.length})
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Bookmarked candidates saved for placement consideration and recruiter outreach.
          </p>
        </div>
        {shortlistedStudents.length > 0 && (
          <button
            onClick={() => setActiveView('candidate-comparison')}
            className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Compare Shortlist Side-by-Side</span>
          </button>
        )}
      </div>

      {shortlistedStudents.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center text-slate-400">
          <span className="material-symbols-outlined text-[48px]">bookmark_border</span>
          <p className="text-sm font-semibold mt-2">No candidates in shortlist.</p>
          <button
            onClick={() => setActiveView('candidate-search')}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
          >
            Browse Candidates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlistedStudents.map((student) => {
            const approvedEvidences = evidences.filter(
              (e) => e.userId === student.id && e.status === 'APPROVED'
            );

            return (
              <div key={student.id} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-headline font-bold text-base text-text-primary">{student.name}</h3>
                      <span className="text-xs text-slate-500">{student.department}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleShortlistCandidate(student.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                    title="Remove from shortlist"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {approvedEvidences.map((ev) => (
                      <SkillTag
                        key={ev.id}
                        name={ev.skillName}
                        level={ev.verification?.proficiencyLevel}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-mono font-bold">100% Faculty Verified</span>
                  <button
                    onClick={() => setActiveView('candidate-search')}
                    className="text-primary font-bold hover:underline"
                  >
                    View Search Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
