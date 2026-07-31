import React, { useState } from 'react';
import { Transaction, TransferStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Filter, Download, ArrowUpRight, Inbox, RefreshCw, Calendar } from 'lucide-react';

interface TransactionsPageProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onNewTransferClick: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  onSelectTransaction,
  onNewTransferClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | TransferStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = activeFilter === 'all' ? true : tx.status === activeFilter;
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sendCurrency.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 font-sans">
      
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transactions History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of all international money movements
          </p>
        </div>

        <button
          onClick={() => alert('Exporting CSV transaction ledger...')}
          className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Filter Chips & Search Input */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All Transfers' },
            { id: 'completed', label: 'Completed' },
            { id: 'processing', label: 'Processing' },
            { id: 'pending', label: 'Pending' },
            { id: 'refunded', label: 'Refunded' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, recipient..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

      </div>

      {/* Transactions Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Inbox className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-bold text-slate-700">No transactions match your criteria</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your filter status or search keywords, or create a new transfer.
            </p>
            <button
              onClick={onNewTransferClick}
              className="mt-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Create New Transfer</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4 text-right">Amount Sent</th>
                  <th className="py-3.5 px-4 text-right">Recipient Gets</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 group-hover:underline">
                      {tx.reference}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tx.recipient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={tx.recipient.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{tx.recipient.name}</p>
                          <p className="text-[10px] text-slate-400">{tx.recipient.bankName || tx.recipient.mobileWalletProvider}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {tx.recipient.country}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      ${tx.sendAmount.toFixed(2)} {tx.sendCurrency}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-700">
                      {tx.receiveAmount.toLocaleString()} {tx.receiveCurrency}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
