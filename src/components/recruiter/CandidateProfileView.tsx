import React from 'react';
import { usePassport } from '../../context/PassportContext';
import { RadarChart } from '../common/RadarChart';
import { SkillTag } from '../common/SkillTag';

interface CandidateProfileViewProps {
  candidateId: string;
  onClose: () => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({ candidateId, onClose }) => {
  const { users, evidences, shortlistedCandidateIds, toggleShortlistCandidate } = usePassport();

  const student = users.find((u) => u.id === candidateId) || users[0];
  const approvedEvidences = evidences.filter((e) => e.userId === candidateId && e.status === 'APPROVED');
  const isShortlisted = shortlistedCandidateIds.includes(candidateId);

  const radarSkills = approvedEvidences.map((e) => ({
    name: e.skillName,
    score: e.verification?.totalScore || 90,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface rounded-3xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border border-border shadow-sm"
            />
            <div>
              <h2 className="font-headline font-bold text-xl text-text-primary">{student.name}</h2>
              <span className="text-xs text-secondary font-semibold">{student.department} • Class of {student.graduationYear}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleShortlistCandidate(student.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isShortlisted ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isShortlisted ? '★ Shortlisted' : '+ Shortlist'}
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>

        {/* Bio & Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-border flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Competency Radar</span>
            <RadarChart skills={radarSkills} size={220} />
          </div>
          <div className="md:col-span-7 space-y-3">
            <h3 className="font-headline font-bold text-sm text-text-primary">Verified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {approvedEvidences.map((ev) => (
                <SkillTag
                  key={ev.id}
                  name={ev.skillName}
                  level={ev.verification?.proficiencyLevel}
                />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">{student.bio}</p>
          </div>
        </div>

        {/* Evidence List */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-headline font-bold text-sm text-text-primary">
            Faculty-Verified Evidence Submissions ({approvedEvidences.length})
          </h3>
          <div className="space-y-3">
            {approvedEvidences.map((ev) => (
              <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{ev.title}</span>
                  <span className="text-emerald-700 font-mono">
                    Score: {ev.verification?.totalScore}/100 ({ev.verification?.proficiencyLevel})
                  </span>
                </div>
                <p className="text-slate-600">{ev.description}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                  <span>Verified by {ev.verification?.verifierName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
