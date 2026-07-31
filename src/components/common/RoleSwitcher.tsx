import React from 'react';
import { UserRole } from '../../types';
import { User, ShieldCheck, Cpu, LogIn, UserPlus } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeAuthView?: 'login' | 'signup' | null;
  onAuthViewChange?: (view: 'login' | 'signup' | null) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  activeAuthView,
  onAuthViewChange,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white p-1.5 rounded-full shadow-2xl border border-slate-700/60 inline-flex items-center gap-1 text-xs font-medium">
      <span className="px-2.5 text-slate-400 font-semibold tracking-wide uppercase text-[10px]">
        Role Persona
      </span>

      <button
        onClick={() => {
          onRoleChange('user');
          if (onAuthViewChange) onAuthViewChange(null);
        }}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          currentRole === 'user' && !activeAuthView
            ? 'bg-blue-600 text-white shadow-md font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Customer
      </button>

      <button
        onClick={() => {
          onRoleChange('agent');
          if (onAuthViewChange) onAuthViewChange(null);
        }}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          currentRole === 'agent' && !activeAuthView
            ? 'bg-indigo-600 text-white shadow-md font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Transfer Agent
      </button>

      <button
        onClick={() => {
          onRoleChange('admin');
          if (onAuthViewChange) onAuthViewChange(null);
        }}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          currentRole === 'admin' && !activeAuthView
            ? 'bg-emerald-600 text-white shadow-md font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Cpu className="w-3.5 h-3.5" />
        Admin Dashboard
      </button>

      <div className="h-4 w-px bg-slate-700 mx-1" />

      <button
        onClick={() => {
          if (onAuthViewChange) onAuthViewChange('login');
        }}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          activeAuthView === 'login'
            ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <LogIn className="w-3.5 h-3.5" />
        Login
      </button>

      <button
        onClick={() => {
          if (onAuthViewChange) onAuthViewChange('signup');
        }}
        className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
          activeAuthView === 'signup'
            ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        Signup
      </button>
    </div>
  );
};
