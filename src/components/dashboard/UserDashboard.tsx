import React, { useState } from 'react';
import { Transaction, Currency } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';
import { ArrowUpRight, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, Send, ChevronRight, Inbox, Sparkles, Clock } from 'lucide-react';

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

  // Calculate live FX output
  const fromRate = calcFrom.rateToUSD;
  const toRate = calcTo.rateToUSD;
  const rawConverted = (calcAmount / fromRate) * toRate;
  const feeUSD = 1.50;
  const netSendAmount = Math.max(0, calcAmount - feeUSD);
  const netConverted = (netSendAmount / fromRate) * toRate;
  const liveRate = (1 / fromRate) * toRate;

  // KPI Calculations
  const completedCount = transactions.filter((t) => t.status === 'completed').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length;
  const refundedCount = transactions.filter((t) => t.status === 'refunded').length;
  const totalVolumeUSD = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.sendAmount, 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold backdrop-blur-md mb-2 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Verified Premium Account
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Good day, Alex 👋</h1>
          <p className="text-sm text-blue-200/80 max-w-lg">
            Guaranteed mid-market FX rates locked for your international transfers today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNewTransferWithData && onNewTransferWithData(calcAmount, calcFrom.code, calcTo.code)}
            className="py-3 px-6 bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Send Money Now</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Transfers Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ${totalVolumeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
            </p>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{completedCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Successful global deliveries</p>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">In transit via instant gateway</p>
          </div>
        </div>

        {/* Refunded Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refunded</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              ↺
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{refundedCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Returned to card source</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Live Rate Calculator + Fast Actions */}
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
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({transactions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
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
                  <th className="pb-3 px-3">Recipient</th>
                  <th className="pb-3 px-3">Country</th>
                  <th className="pb-3 px-3 text-right">Amount Sent</th>
                  <th className="pb-3 px-3 text-right">Recipient Gets</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="py-4 px-3 font-mono font-bold text-blue-600 group-hover:underline">
                      {tx.reference}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={tx.recipient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={tx.recipient.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{tx.recipient.name}</p>
                          <p className="text-[10px] text-slate-400">{tx.recipient.bankName || tx.recipient.mobileWalletProvider || 'Bank Transfer'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-semibold text-slate-700">
                      {tx.recipient.country}
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
