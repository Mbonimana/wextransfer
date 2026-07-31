import React from 'react';
import { TransferStatus } from '../../types';
import { CheckCircle2, RefreshCw, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: TransferStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  }[size];

  switch (status) {
    case 'completed':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Money Landed</span>
        </span>
      );
    case 'processing':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 ${sizeClasses}`}>
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
          <span>Processing</span>
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'refunded':
      return (
        <span className={`inline-flex items-center rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-600/20 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Refunded</span>
        </span>
      );
    case 'compliance_flagged':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Compliance Review</span>
        </span>
      );
    default:
      return null;
  }
};
