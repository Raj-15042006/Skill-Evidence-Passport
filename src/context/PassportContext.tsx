import React, { createContext, useContext, useEffect, useState } from 'react';
import { evaluateEvidenceWithAI, evaluateEvidenceWithPythonAI } from '../services/aiEngine';
import { AuditLedger } from '../services/auditEngine';
import {
  INITIAL_EVIDENCES,
  INITIAL_JOB_ROLES,
  INITIAL_PORTFOLIO_SETTINGS,
  INITIAL_SKILLS,
  INITIAL_TELEMETRY,
  INITIAL_USERS,
} from '../services/mockData';
import {
  AuditLog,
  Evidence,
  EvidenceStatus,
  EvidenceType,
  JobRole,
  PortfolioSettings,
  Role,
  Skill,
  TelemetryMetrics,
  User,
} from '../types/passport';

interface PassportContextType {
  isAuthenticated: boolean;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: User;
  users: User[];
  skills: Skill[];
  evidences: Evidence[];
  jobRoles: JobRole[];
  auditLogs: AuditLog[];
  telemetry: TelemetryMetrics;
  portfolioSettings: PortfolioSettings;
  shortlistedCandidateIds: string[];
  activeView: string;
  setActiveView: (view: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Auth Handlers
  login: (userId: string) => void;
  registerUser: (newUser: User) => void;
  logout: () => void;

  // Toast notifications
  toastMessage: { text: string; type: 'success' | 'error' | 'warning' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  
  // Action Handlers
  submitEvidence: (data: {
    skillId: string;
    type: EvidenceType;
    title: string;
    description: string;
    fileRef: string;
    externalUrl?: string;
  }) => Promise<Evidence>;

  decideVerification: (
    evidenceId: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO',
    proficiencyLevel: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert',
    rubricScores: Record<string, number>,
    comments: string,
    overrideReason?: string
  ) => void;

  toggleShortlistCandidate: (candidateId: string) => void;

  updatePortfolioPrivacy: (settings: Partial<PortfolioSettings['visibleFields']>) => void;

  updateUserProfile: (updatedFields: Partial<User>) => void;

  togglePublicPortfolio: (isPublic: boolean) => void;

  verifyAuditLedgerIntegrity: () => { isValid: boolean; brokenIndex: number | null; message: string };

  tamperAuditLedgerForDemo: (index: number) => void;

  addSkillToTaxonomy: (skill: Omit<Skill, 'id' | 'taxonomyVersion'>) => void;

  updateSkillTaxonomy: (id: string, updates: Partial<Skill>) => void;

  addJobRole: (role: Omit<JobRole, 'id'>) => void;
}

const PassportContext = createContext<PassportContextType | undefined>(undefined);

const auditLedger = new AuditLedger();

export const PassportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DEFAULT TO FALSE -> LOGIN PAGE IS ALWAYS THE DEFAULT LANDING PAGE!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [currentUserId, setCurrentUserId] = useState<string>('usr-student-1');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [evidences, setEvidences] = useState<Evidence[]>(INITIAL_EVIDENCES);
  const [jobRoles, setJobRoles] = useState<JobRole[]>(INITIAL_JOB_ROLES);
  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings>(INITIAL_PORTFOLIO_SETTINGS);
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState<string[]>(['usr-student-1']);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryMetrics>(INITIAL_TELEMETRY);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const showToast = (text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const login = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      setCurrentRole(user.role);
      setIsAuthenticated(true);
      setActiveView('dashboard');
      auditLedger.appendLog(user.id, user.name, user.role, 'USER_LOGGED_IN', 'USER', user.id, `User ${user.name} authenticated with role ${user.role}`);
      showToast(`Welcome back, ${user.name}! Signed in as ${user.role === 'verifier' ? 'Teacher / Verifier' : user.role.toUpperCase()}`, 'success');
    }
  };

  const logout = () => {
    if (currentUser) {
      auditLedger.appendLog(currentUser.id, currentUser.name, currentUser.role, 'USER_LOGGED_OUT', 'USER', currentUser.id, `User ${currentUser.name} signed out`);
    }
    setIsAuthenticated(false);
    showToast('Signed out successfully.', 'info');
  };

  useEffect(() => {
    if (auditLedger.getLogs().length <= 1) {
      auditLedger.appendLog('usr-student-1', 'Alex Rivera', 'student', 'EVIDENCE_SUBMITTED', 'EVIDENCE', 'evid-101', 'Submitted Evidence for React 18 & TypeScript');
      auditLedger.appendLog('usr-verifier-1', 'Dr. Sarah Jenkins', 'verifier', 'VERIFICATION_DECIDED', 'EVIDENCE', 'evid-101', 'Approved Evidence evid-101 with Expert Level (98/100)');
      auditLedger.appendLog('usr-student-1', 'Alex Rivera', 'student', 'PORTFOLIO_PUBLISHED', 'PORTFOLIO', 'ps-alex-rivera', 'Published public portfolio slug alex-rivera-passport');
    }
  }, []);

  useEffect(() => {
    const total = evidences.length;
    const pending = evidences.filter((e) => e.status === 'SUBMITTED' || e.status === 'AI_SCREENED' || e.status === 'IN_REVIEW').length;
    const approved = evidences.filter((e) => e.status === 'APPROVED').length;
    const rejected = evidences.filter((e) => e.status === 'REJECTED').length;
    const needsInfo = evidences.filter((e) => e.status === 'NEEDS_INFO').length;

    const integrity = auditLedger.verifyIntegrity();

    setTelemetry((prev) => ({
      ...prev,
      totalSubmissions: total,
      pendingQueueDepth: pending,
      approvedCount: approved,
      rejectedCount: rejected,
      needsInfoCount: needsInfo,
      auditLedgerStatus: integrity.isValid ? 'HEALTHY' : 'TAMPERED',
    }));
  }, [evidences]);

  const submitEvidence = async (data: {
    skillId: string;
    type: EvidenceType;
    title: string;
    description: string;
    fileRef: string;
    externalUrl?: string;
  }): Promise<Evidence> => {
    const targetSkill = skills.find((s) => s.id === data.skillId) || skills[0];

    const contentHash = Array.from(`${data.title}${data.description}${data.fileRef}`)
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
      .toString(16)
      .padStart(64, '0');

    const aiResult = await evaluateEvidenceWithPythonAI(data.title, data.description, data.type, targetSkill, evidences);

    const newEvidence: Evidence = {
      id: `evid-${Date.now()}`,
      userId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatarUrl,
      studentEmail: currentUser.email,
      department: currentUser.department || 'Computer Science & Engineering',
      skillId: targetSkill.id,
      skillName: targetSkill.name,
      skillCategory: targetSkill.category,
      type: data.type,
      title: data.title,
      description: data.description,
      fileRef: data.fileRef,
      externalUrl: data.externalUrl,
      status: 'AI_SCREENED',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentHash,
      aiScore: aiResult,
    };

    setEvidences((prev) => [newEvidence, ...prev]);

    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'EVIDENCE_SUBMITTED',
      'EVIDENCE',
      newEvidence.id,
      `Submitted evidence "${data.title}" for skill ${targetSkill.name}. Content Hash: ${contentHash.substring(0, 12)}...`
    );

    showToast(`Evidence "${data.title}" submitted successfully! AI advisory pre-screening complete.`, 'success');
    return newEvidence;
  };

  const decideVerification = (
    evidenceId: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO',
    proficiencyLevel: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert',
    rubricScores: Record<string, number>,
    comments: string,
    overrideReason?: string
  ) => {
    setEvidences((prev) =>
      prev.map((item) => {
        if (item.id !== evidenceId) return item;

        let newStatus: EvidenceStatus = 'APPROVED';
        if (decision === 'REJECT') newStatus = 'REJECTED';
        if (decision === 'REQUEST_INFO') newStatus = 'NEEDS_INFO';

        const totalScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);

        const verification = {
          id: `ver-${Date.now()}`,
          evidenceId,
          verifierId: currentUser.id,
          verifierName: currentUser.name,
          verifierAvatar: currentUser.avatarUrl,
          decision,
          proficiencyLevel,
          rubricScores,
          totalScore,
          comments,
          decidedAt: new Date().toISOString(),
          overrodeAISuggestion: !!overrideReason,
          overrideReason,
        };

        return {
          ...item,
          status: newStatus,
          verification,
          needsInfoComment: decision === 'REQUEST_INFO' ? comments : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const targetEvidence = evidences.find((e) => e.id === evidenceId);

    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'VERIFICATION_DECIDED',
      'EVIDENCE',
      evidenceId,
      `Verifier ${currentUser.name} marked evidence as ${decision} (${proficiencyLevel}, Score: ${Object.values(rubricScores).reduce((a, b) => a + b, 0)}/100)`
    );

    showToast(`Verification decision recorded: ${decision} for "${targetEvidence?.title || evidenceId}".`, 'success');
  };

  const toggleShortlistCandidate = (candidateId: string) => {
    setShortlistedCandidateIds((prev) => {
      const isAlready = prev.includes(candidateId);
      const updated = isAlready ? prev.filter((id) => id !== candidateId) : [...prev, candidateId];

      auditLedger.appendLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        isAlready ? 'CANDIDATE_REMOVED_SHORTLIST' : 'CANDIDATE_SHORTLISTED',
        'USER',
        candidateId,
        `${isAlready ? 'Removed candidate' : 'Shortlisted candidate'} ${candidateId}`
      );

      showToast(isAlready ? 'Candidate removed from shortlist.' : 'Candidate added to shortlist!', isAlready ? 'info' : 'success');

      return updated;
    });
  };

  const updatePortfolioPrivacy = (settings: Partial<PortfolioSettings['visibleFields']>) => {
    setPortfolioSettings((prev) => {
      const next = {
        ...prev,
        visibleFields: {
          ...prev.visibleFields,
          ...settings,
        },
      };

      auditLedger.appendLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        'PORTFOLIO_PRIVACY_UPDATED',
        'PORTFOLIO',
        prev.id,
        `Updated visible privacy toggles: ${JSON.stringify(settings)}`
      );

      showToast('Portfolio privacy settings saved.', 'success');
      return next;
    });
  };

  const togglePublicPortfolio = (isPublic: boolean) => {
    setPortfolioSettings((prev) => ({ ...prev, isPublic }));
    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      isPublic ? 'PORTFOLIO_MADE_PUBLIC' : 'PORTFOLIO_MADE_PRIVATE',
      'PORTFOLIO',
      portfolioSettings.id,
      `Portfolio public status set to ${isPublic}`
    );
    showToast(isPublic ? 'Portfolio is now PUBLIC and shareable!' : 'Portfolio is now PRIVATE.', 'info');
  };

  const verifyAuditLedgerIntegrity = () => {
    return auditLedger.verifyIntegrity();
  };

  const tamperAuditLedgerForDemo = (index: number) => {
    auditLedger.tamperRecord(index);
    setTelemetry((prev) => ({ ...prev, auditLedgerStatus: 'TAMPERED' }));
    showToast(`Simulated data tampering at log record #${index}! Run Audit Integrity Check to verify.`, 'warning');
  };

  const addSkillToTaxonomy = (skillData: Omit<Skill, 'id' | 'taxonomyVersion'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      taxonomyVersion: 1,
    };
    setSkills((prev) => [...prev, newSkill]);
    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'SKILL_ADDED_TAXONOMY',
      'SKILL',
      newSkill.id,
      `Added new skill "${newSkill.name}" to category ${newSkill.category}`
    );
    showToast(`Added skill "${newSkill.name}" to taxonomy.`, 'success');
  };

  const updateSkillTaxonomy = (id: string, updates: Partial<Skill>) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, taxonomyVersion: s.taxonomyVersion + 1 } : s))
    );
    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'SKILL_UPDATED_TAXONOMY',
      'SKILL',
      id,
      `Updated skill ${id} taxonomy version`
    );
    showToast(`Skill taxonomy updated to version bump.`, 'success');
  };

  const addJobRole = (jobData: Omit<JobRole, 'id'>) => {
    const newJob: JobRole = {
      ...jobData,
      id: `job-${Date.now()}`,
    };
    setJobRoles((prev) => [...prev, newJob]);
    auditLedger.appendLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'JOB_ROLE_CREATED',
      'JOB_ROLE',
      newJob.id,
      `Created job role requirement "${newJob.title}"`
    );
    showToast(`Created job role "${newJob.title}".`, 'success');
  };

  const registerUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setCurrentRole(newUser.role);
    setIsAuthenticated(true);
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedFields } : u))
    );
    showToast('Academic profile updated successfully.', 'success');
  };

  return (
    <PassportContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        setCurrentRole: (role) => {
          setCurrentRole(role);
          const firstUserOfRole = users.find((u) => u.role === role);
          if (firstUserOfRole) setCurrentUserId(firstUserOfRole.id);
          setActiveView('dashboard');
        },
        currentUser,
        users,
        skills,
        evidences,
        jobRoles,
        auditLogs: auditLedger.getLogs(),
        telemetry,
        portfolioSettings,
        shortlistedCandidateIds,
        activeView,
        setActiveView,
        mobileMenuOpen,
        setMobileMenuOpen,
        login,
        registerUser,
        logout,
        toastMessage,
        showToast,
        submitEvidence,
        decideVerification,
        toggleShortlistCandidate,
        updatePortfolioPrivacy,
        updateUserProfile,
        togglePublicPortfolio,
        verifyAuditLedgerIntegrity,
        tamperAuditLedgerForDemo,
        addSkillToTaxonomy,
        updateSkillTaxonomy,
        addJobRole,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
};

export const usePassport = () => {
  const context = useContext(PassportContext);
  if (!context) throw new Error('usePassport must be used within a PassportProvider');
  return context;
};
