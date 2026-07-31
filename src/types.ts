export type UserRole = 'user' | 'agent' | 'admin' | 'guest';

export type TransferStatus = 'completed' | 'processing' | 'pending' | 'refunded' | 'compliance_flagged';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToUSD: number; // relative to USD
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string; // ISO 2-letter
  bankName?: string;
  accountNumber?: string;
  mobileWalletProvider?: string;
  avatarUrl?: string;
}

export interface SavedCard {
  id: string;
  cardHolder: string;
  cardNumberMasked: string;
  expiry: string;
  cvv?: string;
  brand: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
  bgGradient: string;
  accentColor: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'done' | 'active' | 'upcoming' | 'failed';
  icon: string;
}

export interface Transaction {
  id: string;
  reference: string;
  senderName: string;
  recipient: Recipient;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  status: TransferStatus;
  date: string;
  paymentMethod: string;
  cardLast4?: string;
  purpose: string;
  timeline: TimelineEvent[];
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'transfer' | 'security' | 'system' | 'rate_alert';
}

export interface TransferAgent {
  id: string;
  name: string;
  email: string;
  region: string;
  transfersProcessedToday: number;
  totalVolumeUSD: number;
  status: 'active' | 'busy' | 'offline';
  rating: number;
}
