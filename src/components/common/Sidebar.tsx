import React, { useState } from 'react';
import { Send, LayoutDashboard, ArrowRightLeft, History, CreditCard, Settings, LogOut, ShieldCheck, UserCheck, ChevronRight } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  onLogout,
}) => {
  // Dynamically resolve authenticated user details from local storage cache
  const [userProfile] = useState<{ fullName: string; email: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Failed to parse cached user details inside Sidebar', e);
        }
      }
    }
    return null;
  });

  const getNavItems = () => {
    if (currentRole === 'agent') {
      return [
        { id: 'agent_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'new_transfer', label: 'New Transfer', icon: ArrowRightLeft },
        { id: 'transactions', label: 'My Transfers Queue', icon: History },
        { id: 'agent_stats', label: 'Agent Statistics', icon: ShieldCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (currentRole === 'admin') {
      return [
        { id: 'admin_dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'All Transfers', icon: History },
        { id: 'agents_admin', label: 'Agent Queue & KYC', icon: UserCheck },
        { id: 'cards', label: 'Saved Cards Vault', icon: CreditCard },
        { id: 'settings', label: 'SWIFT & Banking', icon: Settings },
      ];
    }

    // Default Customer role navigation
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'new_transfer', label: 'New Transfer', icon: ArrowRightLeft },
      { id: 'transactions', label: 'Transactions', icon: History },
      { id: 'cards', label: 'Saved Cards', icon: CreditCard },
      { id: 'settings', label: 'Banking Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const userFullName = userProfile?.fullName || 'Guest User';
  const userEmail = userProfile?.email || 'guest@wextransfer.com';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 shrink-0 min-h-screen select-none">
      {/* Brand & Logo */}
      <div>
        <div className="flex items-center justify-between px-3 py-4 mb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md border border-white/10">
              <span className="text-white font-black text-xl font-mono">W</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">
                WeXTransfer
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                {currentRole === 'admin' ? 'Admin Portal' : currentRole === 'agent' ? 'Agent Workspace' : 'Personal Banking'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer border-none ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-3 mb-3 flex items-center gap-3 border border-slate-700/50">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt={userFullName}
            className="w-9 h-9 rounded-full object-cover border border-blue-400/40"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userFullName}</p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer border-none bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};