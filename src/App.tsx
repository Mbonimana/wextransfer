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
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [activeAuthView, setActiveAuthView] = useState<'login' | 'signup' | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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

  // Switch Role Helper
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

  // 1. Render Unauthenticated Auth Views if selected
  if (activeAuthView === 'login') {
    return (
      <LoginPage
        onLogin={() => {
          setActiveAuthView(null);
          setActiveTab('dashboard');
        }}
        onNavigateToSignup={() => setActiveAuthView('signup')}
      />
    );
  }

  if (activeAuthView === 'signup') {
    return (
      <SignupPage
        onSignup={() => {
          setActiveAuthView(null);
          setActiveTab('dashboard');
        }}
        onNavigateToLogin={() => setActiveAuthView('login')}
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
        onLogout={() => setActiveAuthView('login')}
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

        {/* Dynamic View Router */}
        <main className="flex-1 p-2 md:p-6 pb-12 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <UserDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
              onNewTransferWithData={handleQuickTransferFromDashboard}
              onNavigateToTransactions={() => setActiveTab('transactions')}
            />
          )}

          {activeTab === 'new_transfer' && (
            <NewTransferPage
              prefilledSendAmount={prefilledSendAmount}
              prefilledFromCode={prefilledFromCode}
              prefilledToCode={prefilledToCode}
              onTransferCompleted={handleTransferCompleted}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
              onNewTransferClick={() => setActiveTab('new_transfer')}
            />
          )}

          {activeTab === 'cards' && <SavedCardsPage />}

          {activeTab === 'agent_dashboard' && (
            <AgentDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
            />
          )}

          {activeTab === 'admin_dashboard' && (
            <AdminDashboard
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
            />
          )}

          {activeTab === 'settings' && <SettingsPage />}
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
