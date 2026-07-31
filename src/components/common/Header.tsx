import React, { useState } from 'react';
import { Search, Bell, Send, Check, AlertCircle, TrendingUp, X } from 'lucide-react';
import { NotificationItem, UserRole } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';

interface HeaderProps {
  notifications: NotificationItem[];
  onNewTransferClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeAuthView: 'login' | 'signup' | null;
  onAuthViewChange: (view: 'login' | 'signup' | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onNewTransferClick,
  searchTerm,
  onSearchChange,
  currentRole,
  onRoleChange,
  activeAuthView,
  onAuthViewChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      
      {/* Search Input */}
      <div className="relative w-full max-w-xs lg:max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by reference, recipient, country..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Role Persona Switcher Pill */}
      <div className="hidden xl:flex items-center">
        <RoleSwitcher
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          activeAuthView={activeAuthView}
          onAuthViewChange={onAuthViewChange}
        />
      </div>

      {/* Actions: Send Money Button, Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Quick Send Money CTA */}
        <button
          onClick={onNewTransferClick}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>New Transfer</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center relative transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              </div>

              <div className="space-y-3 my-3 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl transition-all border ${
                      item.read ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/60 border-blue-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.type === 'transfer' ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : item.type === 'rate_alert' ? (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.message}</p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-blue-600 pt-2 border-t border-slate-100 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
     

      </div>
    </header>
  );
};
