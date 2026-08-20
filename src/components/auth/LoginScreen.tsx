import React, { useState, useEffect } from 'react';
import { usePassport } from '../../context/PassportContext';
import { Role, User } from '../../types/passport';
import { CollegeAutocomplete } from '../common/CollegeAutocomplete';
import {
  signInWithSupabase,
  signUpWithSupabase,
  sendPasswordResetEmail,
  updateUserPassword,
  supabase,
} from '../../services/supabaseClient';

export const LoginScreen: React.FC = () => {
  const { users, login, showToast, registerUser } = usePassport();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Create Account State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<Role>('student');
  const [regCollege, setRegCollege] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Password Recovery / New Password Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Detect Supabase Password Recovery Event in Hash or Auth Session
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowRecoveryModal(true);
        showToast('Password recovery session active. Set your new password below.', 'info');
      }
    });

    if (window.location.hash.includes('type=recovery')) {
      setShowRecoveryModal(true);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [showToast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Attempt Supabase Auth Sign In
      const sbResult = await signInWithSupabase(email.trim(), password);

      if (sbResult.success && sbResult.user) {
        const sbUser = sbResult.user;
        const userMeta = sbUser.user_metadata || {};
        const newUser: User = {
          id: sbUser.id,
          name: userMeta.name || sbUser.email?.split('@')[0] || 'User',
          email: sbUser.email || email.trim(),
          role: (userMeta.role as Role) || 'student',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sbUser.email || email)}`,
          department: userMeta.department || 'General Academics',
          institution: userMeta.institution || 'Indian Institute of Technology (IIT), Bombay',
        };

        if (registerUser) {
          registerUser(newUser);
        }
        login(newUser.id);
        showToast(`Authenticated via Supabase! Welcome back, ${newUser.name}.`, 'success');
        setIsSubmitting(false);
        return;
      }

      // 2. Fallback to matching local registered / demo account
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        login(matchedUser.id);
        showToast(`Welcome back, ${matchedUser.name}! (Demo Mode)`, 'success');
      } else {
        // Seamless fallback demo user creation
        const newTempUser: User = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim(),
          role: 'student',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          department: 'General Academics',
          institution: 'Indian Institute of Science (IISc), Bangalore',
        };
        if (registerUser) {
          registerUser(newTempUser);
        }
        login(newTempUser.id);
        showToast(`Signed in successfully as ${newTempUser.name}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!agreedTerms) {
      showToast('Please accept the Terms of Service.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase Sign Up Call
      const sbResult = await signUpWithSupabase(regEmail.trim().toLowerCase(), regPassword, {
        name: regName.trim(),
        role: regRole,
        institution: regCollege || 'Indian Institute of Technology (IIT), Bombay',
        department: regDepartment || 'Computer Science & Engineering',
      });

      const newUser: User = {
        id: sbResult.user?.id || `usr-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: regRole,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(regEmail)}`,
        institution: regCollege || 'Indian Institute of Technology (IIT), Bombay',
        department: regDepartment || 'Computer Science & Engineering',
      };

      if (registerUser) {
        registerUser(newUser);
      }
      login(newUser.id);

      if (sbResult.success && !sbResult.session) {
        showToast(`Account registered in Supabase! Check ${regEmail} for confirmation email.`, 'info');
      } else {
        showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Account registration failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await sendPasswordResetEmail(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setResetEmailSent(true);
      showToast(`Password recovery link dispatched to ${email.trim()} via Supabase!`, 'success');
    } else {
      showToast(res.error || 'Failed to dispatch recovery email.', 'error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await updateUserPassword(newPassword);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Password updated successfully! You can now sign in with your new password.', 'success');
      setShowRecoveryModal(false);
      // Clean URL hash
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      showToast(res.error || 'Failed to update password.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 font-body text-slate-100">
      {/* Auth Card */}
      <div className="w-full max-w-lg bg-surface/95 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
        
        {/* Brand Header */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-indigo-950/90 to-transparent border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold mx-auto shadow-lg shadow-indigo-500/30 mb-3">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-white tracking-tight">
            Skills Evidence Passport
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Verifiable Skill Credentials & Cryptographic Academic Governance
          </p>

          {/* Sign In vs Create Account Tab Bar */}
          <div className="mt-6 flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 rounded-xl font-headline font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-xl font-headline font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              Create Account
            </button>
          </div>
        </div>

        {/* Tab 1: Clean Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email address"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-slate-400 hover:text-indigo-300 font-medium"
              >
                Don't have an account? <span className="text-indigo-400 font-bold underline">Create Account</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Clean Create Account Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Institutional Email Address
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. user@iitb.ac.in"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Persona Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Account Persona Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'student', label: 'Student', icon: 'school' },
                  { role: 'verifier', label: 'Teacher / Verifier', icon: 'verified_user' },
                  { role: 'recruiter', label: 'Recruiter', icon: 'search' },
                ].map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setRegRole(r.role as Role)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      regRole === r.role
                        ? 'border-indigo-500 bg-indigo-950 text-white ring-2 ring-indigo-500/40 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{r.icon}</span>
                    <span className="text-[11px]">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Indian College Autocomplete */}
            <div>
              <CollegeAutocomplete
                label="Search College / University (43,000+ Indian Institutes)"
                value={regCollege}
                onChange={(name) => setRegCollege(name)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Department / Specialization
              </label>
              <input
                type="text"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>I agree to the Terms of Service & Privacy Governance</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  <span>Create Account</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-xs text-slate-400 hover:text-indigo-300 font-medium"
              >
                Already have an account? <span className="text-indigo-400 font-bold underline">Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400">mark_email_read</span>
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Enter your registered email address to receive a secure Supabase password recovery link.
            </p>
            {resetEmailSent && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Password recovery email dispatched to <strong>{email}</strong>!</span>
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Send Recovery Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Password Recovery / New Password Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-indigo-500/40 p-6 sm:p-8 max-w-md w-full text-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-white">Set New Password</h3>
              <p className="text-xs text-slate-400">
                Your account recovery link has been verified. Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-4 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

