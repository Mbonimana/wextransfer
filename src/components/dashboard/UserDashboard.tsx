import React, { useState, useEffect } from 'react';
import { Transaction, Currency } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';
import { API_BASE_URL } from '../../config/api';
import { ArrowUpRight, ArrowRight, ShieldCheck, Zap, Send, ChevronRight, Inbox, Sparkles, Clock } from 'lucide-react';

interface UserDashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onNewTransferWithData?: (sendAmount: number, sendCurrency: string, receiveCurrency: string) => void;
  onNavigateToTransactions: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  transactions,
  onSelectTransaction,
  onNewTransferWithData,
  onNavigateToTransactions,
}) => {
  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcFrom, setCalcFrom] = useState<Currency>(SUPPORTED_CURRENCIES[0]); // USD
  const [calcTo, setCalcTo] = useState<Currency>(SUPPORTED_CURRENCIES[1]); // EUR

  // Local user resolution from cached session
  const [userName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          return JSON.parse(cached).fullName.split(' ')[0];
        } catch (e) {
          console.error(e);
        }
      }
    }
    return 'Alex';
  });

  // Dynamic API State
  const [liveMetrics, setLiveMetrics] = useState<{
    totalSent: number;
    completedTransfers: number;
    pendingTransfers: number;
    refundedTransfers: number;
    recentTransfers: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load backend metrics on mount
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Session token not found.');

        const response = await fetch(`${API_BASE_URL}/customer/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch dashboard metrics.');
        }

        setLiveMetrics(data);
      } catch (err: any) {
        setApiError(err.message || 'Failed to connect to the backend server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Updated adapter mapping function as requested (with recipient properties removed)
  const parseBackendTransaction = (tx: any): any => {
    const reference = tx.reference || `WX-${tx.id.substring(0, 8).toUpperCase()}`;
    return {
      id: tx.id,
      reference,
      sendAmount: tx.amount,
      sendCurrency: tx.currency || 'USD',
      receiveAmount: tx.receiveAmount || tx.amount * 0.92, 
      receiveCurrency: tx.receiveCurrency || 'EUR',
      status: tx.status?.toLowerCase() as any, 
      date: tx.createdAt || tx.date,
    };
  };

  // Calculator logic
  const fromRate = calcFrom.rateToUSD;
  const toRate = calcTo.rateToUSD;
  const feeUSD = 1.50;
  const netSendAmount = Math.max(0, calcAmount - feeUSD);
  const netConverted = (netSendAmount / fromRate) * toRate;
  const liveRate = (1 / fromRate) * toRate;

  // KPIs
  const totalVolumeUSD = liveMetrics ? liveMetrics.totalSent : transactions.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.sendAmount, 0);
  const completedCount = liveMetrics ? liveMetrics.completedTransfers : transactions.filter((t) => t.status === 'completed').length;
  const pendingCount = liveMetrics ? liveMetrics.pendingTransfers : transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length;
  const refundedCount = liveMetrics ? liveMetrics.refundedTransfers : transactions.filter((t) => t.status === 'refunded').length;
  
  const displayTransactions = liveMetrics 
    ? liveMetrics.recentTransfers.map(parseBackendTransaction)
    : transactions.slice(0, 5);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold backdrop-blur-md mb-2 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Verified Premium Account
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Good day, {userName} 👋</h1>
          <p className="text-sm text-blue-200/80 max-w-lg">
            Guaranteed mid-market FX rates locked for your international transfers today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNewTransferWithData && onNewTransferWithData(calcAmount, calcFrom.code, calcTo.code)}
            className="py-3 px-6 bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Send Money Now</span>
          </button>
        </div>
      </div>

      {/* API Connection Warning (Non-blocking) */}
      {apiError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium rounded-2xl">
          <span className="font-bold">Notice:</span> {apiError} Displaying local mock session records instead.
        </div>
      )}

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Volume Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                ${totalVolumeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            )}
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
            </p>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{completedCount}</h3>
            )}
            <p className="text-xs text-slate-500 mt-1">Successful global deliveries</p>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{pendingCount}</h3>
            )}
            <p className="text-xs text-amber-600 font-medium mt-1">In transit via instant gateway</p>
          </div>
        </div>

        {/* Refunded Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refunded</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              ↺
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{refundedCount}</h3>
            )}
            <p className="text-xs text-slate-500 mt-1">Returned to card source</p>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Instant FX Exchange Calculator Widget */}
        <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Instant Currency Calculator</h2>
              <p className="text-xs text-slate-500">Guaranteed real-time mid-market rates</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Guaranteed FX
            </span>
          </div>

          <div className="space-y-4">
            {/* You Send Input */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">You Send</span>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-2xl font-black font-mono text-slate-900 focus:outline-none"
                  min={1}
                />
                <select
                  value={calcFrom.code}
                  onChange={(e) => {
                    const found = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                    if (found) setCalcFrom(found);
                  }}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 shadow-xs cursor-pointer focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mid Breakdown */}
            <div className="px-3 py-2 space-y-1.5 text-xs text-slate-500 font-medium">
              <div className="flex items-center justify-between">
                <span>Transfer Fee:</span>
                <span className="font-bold text-emerald-600">$1.50 USD (Transparent)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Guaranteed Exchange Rate:</span>
                <span className="font-bold text-slate-800 font-mono">
                  1 {calcFrom.code} = {liveRate.toFixed(4)} {calcTo.code}
                </span>
              </div>
            </div>

            {/* Recipient Gets Output */}
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">Recipient Gets</span>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-black font-mono text-blue-900">
                  {calcTo.symbol} {netConverted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <select
                  value={calcTo.code}
                  onChange={(e) => {
                    const found = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                    if (found) setCalcTo(found);
                  }}
                  className="bg-white border border-blue-300 rounded-xl px-3 py-2 text-sm font-bold text-blue-950 shadow-xs cursor-pointer focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => onNewTransferWithData && onNewTransferWithData(calcAmount, calcFrom.code, calcTo.code)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>Continue with {calcFrom.code} ➔ {calcTo.code}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Banner / Security Assurance */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 lg:p-8 rounded-3xl text-white space-y-4 shadow-xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Why WeXTransfer?</h3>
            <div className="space-y-3 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Save up to 8x compared to traditional high-street banks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Instant delivery to 180+ countries & mobile wallets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Protected by FCA regulation & 256-Bit SSL encryption</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-900">Exchange Rate Guarantee</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Rates are locked for 15 minutes during payout setup.</p>
            </div>
            <span className="text-lg">🔒</span>
          </div>
        </div>

      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Transfers</h2>
            <p className="text-xs text-slate-500">Click any row to view live timeline and details</p>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            <span>View All ({transactions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
            <div className="h-10 w-full bg-slate-50 animate-pulse rounded-xl" />
          </div>
        ) : displayTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No transactions recorded yet</p>
            <p className="text-xs text-slate-400">Make your first international transfer in under 2 minutes!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Reference</th>
                  <th className="pb-3 px-3 text-right">Amount Sent</th>
                  <th className="pb-3 px-3 text-right">Recipient Gets</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayTransactions.map((tx: any) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="py-4 px-3 font-mono font-bold text-blue-600 group-hover:underline">
                      {tx.reference}
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-slate-900">
                      ${tx.sendAmount.toFixed(2)} {tx.sendCurrency}
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-emerald-700">
                      {tx.receiveAmount.toLocaleString()} {tx.receiveCurrency}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td className="py-4 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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