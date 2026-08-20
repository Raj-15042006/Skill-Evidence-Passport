import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import { CollegeAutocomplete } from '../common/CollegeAutocomplete';
import { SkillAutocomplete } from '../common/SkillAutocomplete';
import { IndianCollege } from '../../data/indianCollegesDataset';
import { FetchedCollege } from '../../services/collegeService';
import { SkillItem } from '../../data/skillsDataset';

interface AcademicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicProfileModal: React.FC<AcademicProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = usePassport();
  const [institution, setInstitution] = useState(currentUser.institution || 'Tech Institute of Science');
  const [selectedCollege, setSelectedCollege] = useState<IndianCollege | FetchedCollege | null>(null);
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(currentUser.graduationYear || 2025);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [selectedSkills, setSelectedSkills] = useState<SkillItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      institution,
      department,
      graduationYear: currentUser.role === 'student' ? graduationYear : undefined,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleAddSkill = (skill: SkillItem) => {
    if (!selectedSkills.some((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-indigo-400 text-2xl">account_balance</span>
            <div>
              <h2 className="font-headline font-bold text-lg text-white">
                Academic & Institutional Profile
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Search and select your college from 43,000+ Indian institutions & configure target domain skills.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
              Academic Profile & College Institution Updated Successfully!
            </div>
          )}

          {/* User Persona Banner */}
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-indigo-200" />
            <div>
              <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
              <div className="text-xs text-indigo-700 font-medium capitalize flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Role: {currentUser.role} Account • {currentUser.email}
              </div>
            </div>
          </div>

          {/* 1. Indian College & University Autocomplete */}
          <div>
            <CollegeAutocomplete
              label="1. Search & Select College / University (43,000+ Indian Institutes)"
              value={institution}
              onChange={(name, data) => {
                setInstitution(name);
                if (data) setSelectedCollege(data);
              }}
            />
            {selectedCollege && (
              <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{selectedCollege.name}</span>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Location: {selectedCollege.city}, {selectedCollege.state} • Type: {selectedCollege.category}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md uppercase">
                  {selectedCollege.tier}
                </span>
              </div>
            )}
          </div>

          {/* 2. Department & Graduation Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Faculty Specialization
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {currentUser.role === 'student' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Graduation Year
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029].map((yr) => (
                    <option key={yr} value={yr}>
                      Class of {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 3. Academic Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Bio & Statement of Purpose
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief summary of research areas, projects, or teaching specializations..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 4. Target Skill Domain Selection (800+ Real-Life Skills) */}
          <div>
            <SkillAutocomplete
              label="4. Add Target Skills & Domains (Choose from 800+ Skills)"
              value=""
              onSelectSkill={handleAddSkill}
            />

            {/* Selected Skills Chips */}
            {selectedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSkills.map((sk) => (
                  <span
                    key={sk.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold rounded-full"
                  >
                    <span className="material-symbols-outlined text-sm">{sk.icon}</span>
                    {sk.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk.id)}
                      className="hover:text-red-600"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Academic Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
