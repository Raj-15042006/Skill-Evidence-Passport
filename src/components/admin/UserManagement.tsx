import React from 'react';
import { usePassport } from '../../context/PassportContext';

export const UserManagement: React.FC = () => {
  const { users } = usePassport();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-text-primary tracking-tight">
          User Access & RBAC Directory
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage system personas, department assignments, and Keycloak-issued role scope grants.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Department / Institution</th>
                <th className="py-3.5 px-4 text-right">Access Scopes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold rounded-full uppercase text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{u.department || u.institution || 'System Office'}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-500">
                    {u.role === 'student'
                      ? 'evidence:write, portfolio:read'
                      : u.role === 'verifier'
                      ? 'verifier:review, rubric:write'
                      : u.role === 'recruiter'
                      ? 'recruiter:search, candidate:view'
                      : 'admin:*'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
