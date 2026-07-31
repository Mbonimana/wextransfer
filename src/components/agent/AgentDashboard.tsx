import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { INITIAL_AGENTS } from '../../data/mockData';
import { API_BASE_URL } from '../../config/api';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AgentDashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const currentAgent = INITIAL_AGENTS[0];
  const [localTxList, setLocalTxList] = useState<Transaction[]>(transactions);
  const [activeTab, setActiveTab] = useState<'queue' | 'all'>('queue');

  // Dynamic API State
  const [metrics, setMetrics] = useState<{
    totalTransfersCreated: number;
    completed: number;
    pending: number;
    paymentLinksGenerated: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamically resolve authenticated Agent's name from cached session
  const [agentName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          return JSON.parse(cached).fullName;
        } catch (e) {
          console.error('Failed to parse cached agent details inside dashboard', e);
        }
      }
    }
    return currentAgent.name; // Fallback default
  });

  // Safe data mapping adapter for Agent Transactions
  const parseBackendTransaction = (tx: any): Transaction => {
    const reference = tx.reference || `WX-${tx.id.substring(0, 8).toUpperCase()}`;
    return {
      id: tx.id,
      reference,
      senderName: tx.details?.senderName || 'Agent Morgan',
      exchangeRate: tx.exchangeRate || 0.92,
      fee: tx.fee || 0,
      recipient: {
        id: tx.recipient?.id || `rec-${Date.now()}`,
        name: tx.recipient?.name || tx.details?.recipientName || 'Sophie Laurent',
        email: tx.recipient?.email || `${(tx.recipient?.name || 'Sophie').toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: tx.recipient?.phone || '+33 6 12 34 56 78',
        country: tx.recipient?.country || tx.details?.country || 'France',
        bankName: tx.recipient?.bankName || tx.details?.bankName || 'BNP Paribas',
        accountNumber: tx.recipient?.accountNumber || 'FR76 3000 4012 3456 7890 123',
        countryCode: 'FR'
      },
      sendAmount: tx.amount,
      sendCurrency: tx.currency || 'USD',
      receiveAmount: tx.receiveAmount || tx.amount * 0.92,
      receiveCurrency: tx.receiveCurrency || 'EUR',
      status: (tx.status?.toLowerCase() as any) || 'processing',
      date: tx.createdAt || tx.date,
      paymentMethod: tx.paymentMethod || `Mastercard •••• ${tx.details?.cardLastFourDigits || '4444'}`,
      purpose: tx.purpose || 'International Family Transfer',
      timeline: tx.timeline || []
    };
  };

  useEffect(() => {
    const fetchAgentData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Authorization token not found.');

        // 1. Fetch dashboard metrics
        const metricsRes = await fetch(`${API_BASE_URL}/agent/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const metricsData = await metricsRes.json();

        // 2. Fetch agent managed transactions
        const txRes = await fetch(`${API_BASE_URL}/agent/transactions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const txData = await txRes.json();

        if (metricsRes.ok && metricsData.success) {
          setMetrics(metricsData);
        }
        if (txRes.ok && txData.success) {
          const mappedTxs = txData.data.map(parseBackendTransaction);
          setLocalTxList(mappedTxs);
        } else {
          setLocalTxList(transactions);
        }
      } catch (err: any) {
        setApiError(err.message || 'Failed to sync with the backend server.');
        setLocalTxList(transactions); // Graceful fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentData();
  }, [transactions]);

  const pendingApprovals = localTxList.filter((t) => t.status === 'pending' || t.status === 'processing');

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalTxList(
      localTxList.map((t) =>
        t.id === id ? { ...t, status: 'completed' as const } : t
      )
    );
  };

  const handleFlag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalTxList(
      localTxList.map((t) =>
        t.id === id ? { ...t, status: 'compliance_flagged' as const } : t
      )
    );
  };

  // Resolve metrics dynamically
  const displayTotalVolume = currentAgent.totalVolumeUSD;
  const displayProcessedCount = metrics ? metrics.completed : currentAgent.transfersProcessedToday;
  const displayPendingCount = pendingApprovals.length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Payout & Compliance Desk
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Agent Workspace: {agentName}
          </h1>
          <p className="text-xs text-indigo-200/80">
            Region: <span className="font-bold text-white">{currentAgent.region}</span> • Rating: <span className="text-amber-300 font-bold">★ {currentAgent.rating}</span>
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-mono text-indigo-200">Today's Volume</p>
            <p className="text-xl font-mono font-bold text-white">${displayTotalVolume.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-[10px] uppercase font-mono text-indigo-200">Processed</p>
            {isLoading ? (
              <div className="h-6 w-10 bg-white/20 animate-pulse rounded-md" />
            ) : (
              <p className="text-xl font-mono font-bold text-emerald-400">{displayProcessedCount}</p>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transfers Today</span>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-100 animate-pulse mt-2 rounded-md" />
          ) : (
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-2">{displayProcessedCount}</h3>
          )}
          <p className="text-xs text-emerald-600 font-medium mt-1">+18% higher than average</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Volume</span>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-2">${displayTotalVolume.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-1">SEPA & Instant Rails</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Queue</span>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-100 animate-pulse mt-2 rounded-md" />
          ) : (
            <h3 className="text-2xl font-black text-amber-600 font-mono mt-2">{displayPendingCount}</h3>
          )}
          <p className="text-xs text-amber-600 font-medium mt-1">Requires Agent Action</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Agent Status</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-bold text-slate-900">Active Duty</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Auto-routing enabled</p>
        </div>
      </div>

      {/* Connection Notice banner */}
      {apiError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium rounded-2xl">
          <span className="font-bold">Notice:</span> {apiError} Loading historical mock timeline queue instead.
        </div>
      )}

      {/* Pending Compliance Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Transactions</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                activeTab === 'queue' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Action Queue ({displayPendingCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All Transfers
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Reference</th>
                  <th className="pb-3 px-3 text-right">Amount Sent</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(activeTab === 'queue' ? pendingApprovals : localTxList).map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <td className="py-4 px-3 font-mono font-bold text-blue-600">{tx.reference}</td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-slate-900">
                      ${tx.sendAmount.toFixed(2)} {tx.sendCurrency}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td className="py-4 px-3 text-right">
                      {tx.status === 'pending' || tx.status === 'processing' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleApprove(tx.id, e)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1 border-none"
                          >
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};