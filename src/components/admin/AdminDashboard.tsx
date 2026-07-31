import React, { useState } from 'react';
import { Transaction } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ADMIN_MONTHLY_DATA, COUNTRY_DISTRIBUTION } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Cpu, DollarSign, TrendingUp, Users, ShieldCheck, ArrowUpRight, Activity, Zap, CheckCircle2, Link, Copy, Check } from 'lucide-react';

interface AdminDashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Helper to construct link
  const generateInitiationLink = (email: string, amount?: number, currency?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://platform.com';
    const params = new URLSearchParams();
    params.append('email', email);
    if (amount) params.append('amount', amount.toString());
    if (currency) params.append('currency', currency);
    return `${baseUrl}/initiate-transaction?${params.toString()}`;
  };

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const amount = amountInput ? parseFloat(amountInput) : undefined;
    const link = generateInitiationLink(emailInput, amount, 'USD');
    setGeneratedLink(link);
    setCopied(false);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Platform Super Admin Mode
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Performance & Revenue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stripe-inspired executive analytics & multi-gateway health status
          </p>
        </div>
      </div>

      {/* Top Stripe-style Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume YTD</span>
            <span className="p-2 rounded-2xl bg-blue-50 text-blue-600 font-bold">$</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-3">$14.8M</h3>
          <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +28.4% YoY Growth
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Platform Revenue</span>
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">$</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-3">$247.5K</h3>
          <p className="text-xs text-slate-500 mt-1">From transparent $1.50 fees</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</span>
            <span className="p-2 rounded-2xl bg-purple-50 text-purple-600 font-bold"><Users className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-3">2,410,920</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">+1,200 new accounts today</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Agents</span>
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-600 font-bold"><ShieldCheck className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono mt-3">48 Desks</h3>
          <p className="text-xs text-slate-500 mt-1">Across 180+ countries</p>
        </div>
      </div>

      {/* Transaction Link Generator */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
            <Link className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Generate Transaction Link</h2>
            <p className="text-xs text-slate-400">Assign a secure checkout or payment initiation URL directly to a customer email.</p>
          </div>
        </div>
        
        <form onSubmit={handleGenerateLink} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              required
              placeholder="Enter customer email (e.g., customer@example.com)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div className="w-full md:w-48">
            <input
              type="number"
              placeholder="Amount (USD) - Optional"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 transition-colors rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Generate Link
          </button>
        </form>

        {generatedLink && (
          <div className="flex items-center justify-between gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 mt-3 animate-fadeIn">
            <div className="overflow-hidden flex-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Generated Initiation URL</p>
              <p className="text-xs font-mono text-blue-400 truncate mt-0.5">{generatedLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50 flex items-center gap-1.5 text-xs whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Charts Grid: Monthly Volume & Country Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Volume Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Monthly Transfer Volume Trends</h2>
              <p className="text-xs text-slate-500">Gross transfer volume in USD millions</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              2026 Live Telemetry
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_MONTHLY_DATA}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${(Number(value) / 1000000).toFixed(2)}M USD`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', color: '#FFF', border: 'none' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#volumeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Country Share</h2>
            <p className="text-xs text-slate-500">Top payout corridor distribution</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COUNTRY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COUNTRY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-semibold">
            {COUNTRY_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono text-slate-900 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Latest System Transfers Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Latest Global Transfers Audit</h2>
            <p className="text-xs text-slate-500">Real-time ledger entries across all gateways</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Reference</th>
                <th className="pb-3 px-3">Sender ➔ Recipient</th>
                <th className="pb-3 px-3">Corridor</th>
                <th className="pb-3 px-3 text-right">Amount</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.map((tx) => {
                const senderEmail = (tx as any).senderEmail || `${tx.senderName.toLowerCase().replace(/\s+/g, '')}@example.com`;
                
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <td className="py-4 px-3 font-mono font-bold text-blue-600">{tx.reference}</td>
                    <td className="py-4 px-3">
                      <p className="font-bold text-slate-900">{tx.senderName} ➔ {tx.recipient.name}</p>
                      <p className="text-[10px] text-slate-400">{tx.paymentMethod}</p>
                    </td>
                    <td className="py-4 px-3 font-semibold text-slate-700">
                      {tx.sendCurrency} ➔ {tx.receiveCurrency} ({tx.recipient.country})
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-slate-900">
                      ${tx.sendAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td className="py-4 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          const link = generateInitiationLink(senderEmail, tx.sendAmount, tx.sendCurrency);
                          navigator.clipboard.writeText(link);
                          setCopiedTxId(tx.id);
                          setTimeout(() => setCopiedTxId(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors text-[10px] font-bold"
                        title={`Copy initiation link for ${senderEmail}`}
                      >
                        {copiedTxId === tx.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Link className="w-3 h-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};