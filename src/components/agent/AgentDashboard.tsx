import React, { useState } from 'react';
import { Transaction } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { INITIAL_AGENTS } from '../../data/mockData';
import { ShieldCheck, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, RefreshCw, UserCheck, Search, Filter } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Payout & Compliance Desk
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Agent Workspace: {currentAgent.name}
          </h1>
          <p className="text-xs text-indigo-200/80">
            Region: <span className="font-bold text-white">{currentAgent.region}</span> • Rating: <span className="text-amber-300 font-bold">★ {currentAgent.rating}</span>
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-mono text-indigo-200">Today's Volume</p>
            <p className="text-xl font-mono font-bold text-white">${currentAgent.totalVolumeUSD.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-[10px] uppercase font-mono text-indigo-200">Processed</p>
            <p className="text-xl font-mono font-bold text-emerald-400">{currentAgent.transfersProcessedToday}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transfers Today</span>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-2">{currentAgent.transfersProcessedToday}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">+18% higher than average</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Volume</span>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-2">${currentAgent.totalVolumeUSD.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-1">SEPA & Instant Rails</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Queue</span>
          <h3 className="text-2xl font-black text-amber-600 font-mono mt-2">{pendingApprovals.length}</h3>
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

      {/* Pending Compliance Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Agent Compliance Approval Queue</h2>
            <p className="text-xs text-slate-500">Inspect pending transfers and authorize immediate payout</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'queue' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Action Queue ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All Transfers
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Reference</th>
                <th className="pb-3 px-3">Sender ➔ Recipient</th>
                <th className="pb-3 px-3 text-right">Amount Sent</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-right">Quick Agent Actions</th>
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
                  <td className="py-4 px-3">
                    <p className="font-bold text-slate-900">{tx.senderName} ➔ {tx.recipient.name}</p>
                    <p className="text-[10px] text-slate-400">{tx.recipient.country} • {tx.recipient.bankName || 'Mobile Wallet'}</p>
                  </td>
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
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payout
                        </button>
                        <button
                          onClick={(e) => handleFlag(tx.id, e)}
                          className="py-1.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] rounded-xl border border-rose-200 cursor-pointer"
                        >
                          Flag AML
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
      </div>

    </div>
  );
};
