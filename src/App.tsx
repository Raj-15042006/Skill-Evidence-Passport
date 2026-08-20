import React from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { Layout } from './components/layout/Layout';
import { PassportProvider, usePassport } from './context/PassportContext';

// Student Persona Views
import { BrowseSkills } from './components/student/BrowseSkills';
import { EvidenceUploadWizard } from './components/student/EvidenceUploadWizard';
import { MyEvidenceHistory } from './components/student/MyEvidenceHistory';
import { MyPortfolioPreview } from './components/student/MyPortfolioPreview';
import { PortfolioPrivacySettings } from './components/student/PortfolioPrivacySettings';
import { SkillGrowthTimeline } from './components/student/SkillGrowthTimeline';
import { StudentDashboard } from './components/student/StudentDashboard';

// Verifier Persona Views
import { JobRoleRequirements } from './components/verifier/JobRoleRequirements';
import { RubricManagement } from './components/verifier/RubricManagement';
import { VerificationHistory } from './components/verifier/VerificationHistory';
import { VerificationQueue } from './components/verifier/VerificationQueue';
import { VerifierDashboard } from './components/verifier/VerifierDashboard';

// Recruiter Persona Views
import { CandidateComparisonView } from './components/recruiter/CandidateComparisonView';
import { CandidateSearch } from './components/recruiter/CandidateSearch';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { ShortlistedCandidates } from './components/recruiter/ShortlistedCandidates';

// Admin Persona Views
import { AdminOverview } from './components/admin/AdminOverview';
import { AuditLogViewer } from './components/admin/AuditLogViewer';
import { JobRoleManagement } from './components/admin/JobRoleManagement';
import { SkillTaxonomyManagement } from './components/admin/SkillTaxonomyManagement';
import { SystemTelemetryDashboard } from './components/admin/SystemTelemetryDashboard';
import { UserManagement } from './components/admin/UserManagement';

import { StudentAcademicProfile } from './components/student/StudentAcademicProfile';

const ViewRouter: React.FC = () => {
  const { currentRole, activeView } = usePassport();

  // Student Views
  if (currentRole === 'student') {
    switch (activeView) {
      case 'browse-skills':
        return <BrowseSkills />;
      case 'upload-evidence':
        return <EvidenceUploadWizard />;
      case 'my-evidence':
        return <MyEvidenceHistory />;
      case 'growth-timeline':
        return <SkillGrowthTimeline />;
      case 'portfolio-preview':
        return <MyPortfolioPreview />;
      case 'portfolio-privacy':
        return <PortfolioPrivacySettings />;
      case 'academic-profile':
        return <StudentAcademicProfile />;
      default:
        return <StudentDashboard />;
    }
  }

  // Faculty Verifier / Teacher Views
  if (currentRole === 'verifier') {
    switch (activeView) {
      case 'verification-queue':
        return <VerificationQueue />;
      case 'rubric-management':
        return <RubricManagement />;
      case 'verification-history':
        return <VerificationHistory />;
      case 'job-roles':
        return <JobRoleRequirements />;
      default:
        return <VerifierDashboard />;
    }
  }

  // Recruiter Views
  if (currentRole === 'recruiter') {
    switch (activeView) {
      case 'candidate-search':
        return <CandidateSearch />;
      case 'candidate-comparison':
        return <CandidateComparisonView />;
      case 'shortlist':
        return <ShortlistedCandidates />;
      default:
        return <RecruiterDashboard />;
    }
  }

  // Admin Views
  if (currentRole === 'admin') {
    switch (activeView) {
      case 'taxonomy-management':
        return <SkillTaxonomyManagement />;
      case 'job-role-management':
        return <JobRoleManagement />;
      case 'user-management':
        return <UserManagement />;
      case 'audit-log':
        return <AuditLogViewer />;
      case 'telemetry':
        return <SystemTelemetryDashboard />;
      default:
        return <AdminOverview />;
    }
  }

  return <StudentDashboard />;
};

const ViewLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading module interface...</p>
    </div>
  </div>
);

const MainContent: React.FC = () => {
  const { isAuthenticated } = usePassport();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Layout>
      <React.Suspense fallback={<ViewLoadingFallback />}>
        <ViewRouter />
      </React.Suspense>
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <PassportProvider>
      <MainContent />
    </PassportProvider>
  );
};

export default App;
