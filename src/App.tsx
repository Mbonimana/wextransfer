import React, { useState } from 'react';
import { UserRole, Transaction, NotificationItem } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS } from './data/mockData';

// Layout & Common Components
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { TransactionDrawer } from './components/transactions/TransactionDrawer';

// Views
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { NewTransferPage } from './components/transfer/NewTransferPage';
import { TransactionsPage } from './components/transactions/TransactionsPage';
import { SavedCardsPage } from './components/wallet/SavedCardsPage';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SettingsPage } from './components/settings/SettingsPage';

export default function App() {
  // Authentication State (Restored from cache)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  });

  // Dynamic Navigation & Role State (Restored and mapped from API user payload)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const user = JSON.parse(cachedUser);
          const role = user.role?.toLowerCase();
          if (role === 'customer' || role === 'user') return 'user';
          if (role === 'agent') return 'agent';
          if (role === 'admin' || role === 'super_admin') return 'admin';
        } catch (e) {
          console.error("Failed to parse cached user role", e);
        }
      }
    }
    return 'user';
  });

  const [activeAuthView, setActiveAuthView] = useState<'login' | 'signup' | null>(null);
  
  // Set default initial tab based on role on application load
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentRole === 'agent') return 'agent_dashboard';
    if (currentRole === 'admin') return 'admin_dashboard';
    return 'dashboard';
  });

  // Application Data State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Drawer / Modal State
  const [selectedTxForDrawer, setSelectedTxForDrawer] = useState<Transaction | null>(null);

  // New Transfer Prefill State
  const [prefilledSendAmount, setPrefilledSendAmount] = useState<number>(1000);
  const [prefilledFromCode, setPrefilledFromCode] = useState<string>('USD');
  const [prefilledToCode, setPrefilledToCode] = useState<string>('EUR');

  // Handle New Transfer Completion
  const handleTransferCompleted = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);

    // Push real-time notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Transfer Submitted 🚀',
      message: `Your transfer ${newTx.reference} of $${newTx.sendAmount.toFixed(2)} to ${newTx.recipient.name} is processing.`,
      time: 'Just now',
      read: false,
      type: 'transfer',
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handle quick calculator submit from dashboard
  const handleQuickTransferFromDashboard = (amount: number, from: string, to: string) => {
    setPrefilledSendAmount(amount);
    setPrefilledFromCode(from);
    setPrefilledToCode(to);
    setActiveTab('new_transfer');
  };

  // Switch Role Helper (Dev switcher / administrative tool)
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'agent') {
      setActiveTab('agent_dashboard');
    } else if (newRole === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Logout implementation
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setActiveAuthView('login');
  };

  // Route Role-Guards
  const isUser = currentRole === 'user';
  const isAgent = currentRole === 'agent';
  const isAdmin = currentRole === 'admin';

  // 1. Render Unauthenticated Auth Barrier if not logged in
  if (!isAuthenticated) {
    if (activeAuthView === 'signup') {
      return (
        <SignupPage
          onSignup={(token, user) => {
            setIsAuthenticated(true);
            if (user) {
              const role = user.role.toLowerCase();
              const mappedRole = (role === 'customer' || role === 'user') ? 'user' : (role === 'agent' ? 'agent' : 'admin');
              setCurrentRole(mappedRole);
              setActiveTab(mappedRole === 'user' ? 'dashboard' : (mappedRole === 'agent' ? 'agent_dashboard' : 'admin_dashboard'));
            }
            setActiveAuthView(null);
          }}
          onNavigateToLogin={() => setActiveAuthView('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={(token, user) => {
          setIsAuthenticated(true);
          if (user) {
            const role = user.role.toLowerCase();
            const mappedRole = (role === 'customer' || role === 'user') ? 'user' : (role === 'agent' ? 'agent' : 'admin');
            setCurrentRole(mappedRole);
            setActiveTab(mappedRole === 'user' ? 'dashboard' : (mappedRole === 'agent' ? 'agent_dashboard' : 'admin_dashboard'));
          }
          setActiveAuthView(null);
        }}
        onNavigateToSignup={() => setActiveAuthView('signup')}
      />
    );
  }

  // 2. Render Full Main Application Layout
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentRole={currentRole}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar Header */}
        <Header
          notifications={notifications}
          onNewTransferClick={() => setActiveTab('new_transfer')}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeAuthView={activeAuthView}
          onAuthViewChange={setActiveAuthView}
        />

        {/* Dynamic Protected Router */}
        <main className="flex-1 p-2 md:p-6 pb-12 overflow-y-auto">
          
          {/* USER DASHBOARD - Protected for Customer Only */}
          {activeTab === 'dashboard' && isUser && (
            <UserDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
              onNewTransferWithData={handleQuickTransferFromDashboard}
              onNavigateToTransactions={() => setActiveTab('transactions')}
            />
          )}

          {/* NEW TRANSFER - Open dynamically to active roles */}
          {activeTab === 'new_transfer' && (
            <NewTransferPage
              prefilledSendAmount={prefilledSendAmount}
              prefilledToCode={prefilledToCode}
              onTransferCompleted={handleTransferCompleted}
              onCancel={() => setActiveTab(isUser ? 'dashboard' : (isAgent ? 'agent_dashboard' : 'admin_dashboard'))}
            />
          )}

          {/* TRANSACTIONS - Open dynamically to active roles */}
          {activeTab === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
              onNewTransferClick={() => setActiveTab('new_transfer')}
            />
          )}

          {/* CARDS - Protected for Customers & Admins (Blocked for Agents) */}
          {activeTab === 'cards' && (isUser || isAdmin) && <SavedCardsPage />}

          {/* AGENT DASHBOARD - Protected for Agent Only */}
          {activeTab === 'agent_dashboard' && isAgent && (
            <AgentDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
            />
          )}

          {/* ADMIN DASHBOARD - Protected for Admin/Super_Admin Only */}
          {activeTab === 'admin_dashboard' && isAdmin && (
            <AdminDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
            />
          )}

          {/* SETTINGS - Open to all active roles */}
          {activeTab === 'settings' && <SettingsPage />}

          {/* Fallback Role-Guard Warning (Renders on direct unassigned route access) */}
          {((activeTab === 'dashboard' && !isUser) ||
            (activeTab === 'agent_dashboard' && !isAgent) ||
            (activeTab === 'admin_dashboard' && !isAdmin) ||
            (activeTab === 'cards' && isAgent)) && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
              <p className="text-xs text-slate-500 mb-4">You do not have the required role to view this workspace.</p>
              <button 
                onClick={() => setActiveTab(isUser ? 'dashboard' : (isAgent ? 'agent_dashboard' : 'admin_dashboard'))}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-2xl cursor-pointer"
              >
                Go to Main Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Side Drawer for Transaction Details & Timeline */}
      <TransactionDrawer
        transaction={selectedTxForDrawer}
        onClose={() => setSelectedTxForDrawer(null)}
        onRepeatTransfer={(tx) => {
          setSelectedTxForDrawer(null);
          setPrefilledSendAmount(tx.sendAmount);
          setPrefilledFromCode(tx.sendCurrency);
          setPrefilledToCode(tx.receiveCurrency);
          setActiveTab('new_transfer');
        }}
      />

    </div>
  );
}