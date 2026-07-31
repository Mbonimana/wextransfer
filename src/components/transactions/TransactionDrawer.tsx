import React from 'react';
import { Transaction } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { X, Download, RefreshCw, Send, ShieldCheck, CheckCircle2, Clock, AlertCircle, ExternalLink, FileText, Building2, CreditCard } from 'lucide-react';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onRepeatTransfer?: (tx: Transaction) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  onClose,
  onRepeatTransfer,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Transaction Details</span>
              <h2 className="text-xl font-bold font-mono text-slate-900">{transaction.reference}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Status & Amount Highlight */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center space-y-3">
              <StatusBadge status={transaction.status} size="lg" />
              <div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  ${transaction.sendAmount.toFixed(2)} {transaction.sendCurrency}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  Recipient receives: {transaction.receiveAmount.toLocaleString()} {transaction.receiveCurrency}
                </p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Recipient Info</span>
              <div className="flex items-center gap-3">
                <img
                  src={transaction.recipient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={transaction.recipient.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{transaction.recipient.name}</p>
                  <p className="text-xs text-slate-500">{transaction.recipient.country} • {transaction.recipient.phone}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-mono space-y-1 text-slate-600">
                <p><span className="text-slate-400">Bank / Wallet:</span> {transaction.recipient.bankName || transaction.recipient.mobileWalletProvider || 'SEPA Instant'}</p>
                <p className="truncate"><span className="text-slate-400">Account #:</span> {transaction.recipient.accountNumber || 'Pending'}</p>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transfer Timeline</h4>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {transaction.timeline.map((event) => {
                  const isDone = event.status === 'done';
                  const isActive = event.status === 'active';
                  const isFailed = event.status === 'failed';

                  return (
                    <div key={event.id} className="relative flex items-start gap-3 group">
                      {/* Node Icon */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white animate-pulse'
                            : isFailed
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : isActive ? '●' : isFailed ? '!' : '○'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{event.title}</p>
                          <span className="text-[10px] font-mono text-slate-400">{event.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transfer Fee:</span>
                <span className="font-bold text-emerald-600">${transaction.fee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Exchange Rate:</span>
                <span className="font-bold text-blue-700">1 {transaction.sendCurrency} = {transaction.exchangeRate} {transaction.receiveCurrency}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Transfer Purpose:</span>
                <span className="font-bold text-slate-800">{transaction.purpose}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
          <button
            onClick={() => alert(`PDF Receipt generated for ${transaction.reference}`)}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Official PDF Receipt</span>
          </button>

          {onRepeatTransfer && (
            <button
              onClick={() => onRepeatTransfer(transaction)}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Repeat This Transfer</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
