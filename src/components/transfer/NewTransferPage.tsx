import React, { useState } from 'react';
import { Currency, Recipient, Transaction } from '../../types';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';
import { Send, CheckCircle2, CreditCard, User, Globe, ArrowRight, ShieldCheck, Zap, Lock, Clock, FileText, Download, ChevronRight } from 'lucide-react';

interface NewTransferPageProps {
  prefilledSendAmount?: number;
  prefilledToCode?: string;
  onTransferCompleted: (newTx: Transaction) => void;
  onCancel: () => void;
}

export const NewTransferPage: React.FC<NewTransferPageProps> = ({
  prefilledSendAmount = 1000,
  prefilledToCode = 'EUR',
  onTransferCompleted,
  onCancel,
}) => {
  const getUrlParam = (param: string): string | null => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Amount, 2: Payment, 3: Review, 4: Confirmation

  // Step 1: Amount state (USD only)
  const [sendAmount, setSendAmount] = useState<number>(() => {
    const urlAmount = getUrlParam('amount');
    return urlAmount ? Number(urlAmount) : prefilledSendAmount;
  });

  // Always tied to USD
  const fromCurrency: Currency = SUPPORTED_CURRENCIES.find((c) => c.code === 'USD') || SUPPORTED_CURRENCIES[0];

  const [toCurrency, setToCurrency] = useState<Currency>(
    SUPPORTED_CURRENCIES.find((c) => c.code === prefilledToCode) || SUPPORTED_CURRENCIES[1]
  );

  const [recipientName] = useState(() => {
    const urlEmail = getUrlParam('email');
    if (urlEmail) {
      return urlEmail.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
    }
    return 'Sophie Laurent';
  });

  const [phoneNumber] = useState('+33 6 12 34 56 78');
  const [country] = useState('France');
  const [bankName] = useState('BNP Paribas');
  const [accountNumber] = useState('FR76 3000 4012 3456 7890 123');

  // Step 2: Payment Details State
  const [cardHolder, setCardHolder] = useState('Alex Morgan');
  const [cardNumber, setCardNumber] = useState('');
  const [cardError, setCardError] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Final Generated Transaction Result
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dynamic calculations
  const feeUSD = 1.50;
  const liveExchangeRate = (1 / fromCurrency.rateToUSD) * toCurrency.rateToUSD;
  const netSendAmount = Math.max(0, sendAmount - feeUSD);
  const recipientAmount = netSendAmount * liveExchangeRate;
  const totalPayable = sendAmount;

  // Real-time Mastercard validation prefix checker
  const checkIsMastercard = (num: string): boolean => {
    if (num.length === 0) return true;
    const firstChar = num.charAt(0);
    
    // Mastercards must start with 5 or 2
    if (firstChar !== '5' && firstChar !== '2') {
      return false;
    }
    
    // If starts with 5, the second digit must be 1-5
    if (firstChar === '5' && num.length >= 2) {
      const secondChar = parseInt(num.charAt(1), 10);
      return secondChar >= 1 && secondChar <= 5;
    }
    
    // If starts with 2, bin range must be 2221-2720
    if (firstChar === '2') {
      if (num.length >= 4) {
        const prefix4 = parseInt(num.substring(0, 4), 10);
        return prefix4 >= 2221 && prefix4 <= 2720;
      }
      if (num.length >= 2) {
        const prefix2 = parseInt(num.substring(0, 2), 10);
        return prefix2 >= 22 && prefix2 <= 27;
      }
    }
    return true;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\s+/g, '');
    
    if (rawVal.length > 16) return; // Limit to 16 numeric digits
    if (rawVal && !/^\d+$/.test(rawVal)) return; // Allow only digits

    // Format with spaces every 4 characters
    const formattedVal = rawVal.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedVal);

    if (rawVal.length > 0) {
      const isValidMastercard = checkIsMastercard(rawVal);
      if (!isValidMastercard) {
        setCardError('Only current Mastercards are supported.');
      } else {
        setCardError('');
      }
    } else {
      setCardError('');
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardError || !cardNumber) return;
    setCurrentStep(3);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedReference = `WX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cardUsed = `Mastercard •••• ${cardNumber.slice(-4)}`;

      const createdTx: Transaction = {
        id: `tx-${Date.now()}`,
        reference: generatedReference,
        senderName: 'Alex Morgan',
        recipient: {
          id: `rec-${Date.now()}`,
          name: recipientName,
          email: `${recipientName.toLowerCase().replace(' ', '.')}@email.com`,
          phone: phoneNumber,
          country: country,
          countryCode: 'FR',
          bankName: bankName,
          accountNumber: accountNumber,
        },
        sendAmount: sendAmount,
        sendCurrency: fromCurrency.code,
        receiveAmount: recipientAmount,
        receiveCurrency: toCurrency.code,
        exchangeRate: liveExchangeRate,
        fee: feeUSD,
        status: 'processing',
        date: new Date().toISOString(),
        paymentMethod: cardUsed,
        purpose: 'International Family Transfer',
        timeline: [
          { id: '1', title: 'Transfer Initiated', description: `Payment of $${sendAmount.toFixed(2)} confirmed from ${cardUsed}`, timestamp: 'Just now', status: 'done', icon: 'send' },
          { id: '2', title: 'Compliance & AML Verification', description: 'Automated global sanctions screening passed', timestamp: 'Just now', status: 'done', icon: 'shield' },
          { id: '3', title: 'Processing Payout', description: `Converting at 1 ${fromCurrency.code} = ${liveExchangeRate.toFixed(4)} ${toCurrency.code}`, timestamp: 'In progress', status: 'active', icon: 'refresh' },
          { id: '4', title: 'Money Landed', description: `Awaiting payout deposit into ${bankName}`, timestamp: 'Est. 2 mins', status: 'upcoming', icon: 'check' },
        ],
      };

      setCompletedTx(createdTx);
      setIsSubmitting(false);
      setCurrentStep(4);
      onTransferCompleted(createdTx);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-6 lg:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Instant Bank & Wallet Gateway
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Secure Payment Gateway</h1>
          <p className="text-xs text-blue-200/80 max-w-md">
            Guaranteed FX rates, zero hidden bank margins, and real-time transaction receipts.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-64 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono text-blue-200 font-semibold">Guaranteed FX Rate</p>
            <p className="text-xs font-bold text-white font-mono">1 USD = {liveExchangeRate.toFixed(4)} {toCurrency.code}</p>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        {[
          { step: 1, label: 'Amount' },
          { step: 2, label: 'Payment' },
          { step: 3, label: 'Review' },
          { step: 4, label: 'Confirmation' },
        ].map((s) => (
          <div
            key={s.step}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentStep === s.step
                ? 'bg-blue-600 text-white shadow-md'
                : currentStep > s.step
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-400 bg-slate-50'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                currentStep === s.step
                  ? 'bg-white text-blue-700 font-black'
                  : currentStep > s.step
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > s.step ? '✓' : s.step}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main form section */}
        <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          
          {/* STEP 1: Amount Details (Locked to USD) */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Step 1: Specify Amount
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Send Amount (USD)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-2xl border border-slate-200">
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(Number(e.target.value) || 0)}
                      required
                      min={10}
                      className="w-full bg-transparent font-mono font-bold text-lg text-slate-900 focus:outline-none"
                    />
                    <span className="bg-slate-200 text-slate-800 rounded-xl px-3 py-1 text-xs font-bold font-mono">
                      🇺🇸 USD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recipient Receives
                  </label>
                  <div className="flex items-center gap-2 bg-blue-50/80 p-3 rounded-2xl border border-blue-200">
                    <span className="w-full font-mono font-bold text-lg text-blue-900">
                      {toCurrency.symbol} {recipientAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                    <select
                      value={toCurrency.code}
                      onChange={(e) => {
                        const found = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                        if (found) setToCurrency(found);
                      }}
                      className="bg-white border border-blue-300 rounded-xl px-2 py-1 text-xs font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-3 px-5 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendAmount <= 0}
                  className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-opacity"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Card Payment Details */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Step 2: Mastercard Payment details
              </h2>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mastercard Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="5111 2222 3333 4444"
                    required
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 shadow-xs font-mono transition-colors ${
                      cardError 
                        ? 'border-red-400 focus:ring-red-500 text-red-900' 
                        : 'border-slate-200 focus:ring-blue-600 text-slate-900'
                    }`}
                  />
                  {cardError && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">{cardError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      CVV Code
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength={4}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-5 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!!cardError || !cardNumber}
                  className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-opacity"
                >
                  <span>Review Transfer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Step 3: Review & Authorize
              </h2>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Recipient Name:</span>
                  <span className="font-bold text-slate-900">{recipientName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Destination:</span>
                  <span className="font-bold text-slate-900">{country}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Bank / Wallet:</span>
                  <span className="font-bold text-slate-900">{bankName} ({accountNumber})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Payment Source:</span>
                  <span className="font-bold text-slate-900">
                    Mastercard •••• {cardNumber.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Guaranteed FX Rate Locked</p>
                  <p className="text-[11px] text-emerald-700">1 USD = {liveExchangeRate.toFixed(4)} {toCurrency.code} (Rate locked for 15 minutes)</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-5 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer"
                >
                  ← Edit Payment
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="py-4 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send ${sendAmount.toFixed(2)} USD Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Screen */}
          {currentStep === 4 && completedTx && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Transfer Submitted & Processing
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
                  ${completedTx.sendAmount.toFixed(2)} USD
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: <span className="font-mono font-bold text-blue-600">{completedTx.reference}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-900">{completedTx.recipient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Receives:</span>
                  <span className="font-bold text-emerald-600">
                    {completedTx.receiveAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {completedTx.receiveCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Card:</span>
                  <span className="font-bold text-slate-900">{completedTx.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Arrival:</span>
                  <span className="font-bold text-blue-600">Within 2 Minutes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Receipt downloaded for ${completedTx.reference}`)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" /> Download PDF Receipt
                </button>
                <button
                  onClick={onCancel}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer w-full sm:w-auto justify-center"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Transfer Summary Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-sm tracking-tight text-white">Transfer Summary</h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
              Real-time Quote
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Transfer Amount:</span>
              <span className="font-bold text-white">${sendAmount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WeXTransfer Fee:</span>
              <span className="font-bold text-emerald-400">${feeUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Exchange Rate:</span>
              <span className="font-bold text-blue-300">1 USD = {liveExchangeRate.toFixed(4)} {toCurrency.code}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-sm">
              <span className="text-slate-300 font-bold font-sans">Total Payable:</span>
              <span className="font-bold text-white">${totalPayable.toFixed(2)} USD</span>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl flex justify-between items-center text-xs mt-2">
              <span className="text-blue-200 font-sans font-bold">Recipient Receives:</span>
              <span className="font-bold text-emerald-300 text-base">
                {toCurrency.symbol} {recipientAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Speed: Delivered in ~2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Guarantee: 100% money-back coverage</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};