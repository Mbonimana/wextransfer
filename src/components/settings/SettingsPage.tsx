import React, { useState } from 'react';
import { Building2, Landmark, Globe, Bell, Moon, Save, CheckCircle2, ShieldCheck, Sparkles, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  // Form State
  const [companyName, setCompanyName] = useState('WeX Global Tech LLC');
  const [taxId, setTaxId] = useState('US-881920192');
  const [bankName, setBankName] = useState('JPMorgan Chase Bank, N.A.');
  const [swiftCode, setSwiftCode] = useState('CHASUS33XXX');
  const [iban, setIban] = useState('US33 CHAS 0019 2831 9012');
  const [notifyLanded, setNotifyLanded] = useState(true);
  const [notifyRateAlerts, setNotifyRateAlerts] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Banking & Payout Preferences
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Banking Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure settlement accounts, SWIFT/SEPA gateways, and notification triggers
          </p>
        </div>

        <button
          onClick={handleSave}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Banking preferences updated successfully! Changes applied to all gateways.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Company Account */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Company & Entity Account</h2>
              <p className="text-xs text-slate-500">Corporate registration and tax identification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                EIN / Tax Identifier
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payout Bank & SWIFT */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Payout Bank & SWIFT Settings</h2>
              <p className="text-xs text-slate-500">Primary bank account for automated clearing house (ACH) settlements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payout Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                SWIFT / BIC Code
              </label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                IBAN / Account Number
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Modern Notification Toggles */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Notification Triggers</h2>
              <p className="text-xs text-slate-500">Choose real-time updates sent to your phone or email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Money Landed Alerts</p>
                <p className="text-[11px] text-slate-500">Receive instant push notifications when recipient gets money</p>
              </div>
              <input
                type="checkbox"
                checked={notifyLanded}
                onChange={(e) => setNotifyLanded(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Exchange Rate Alerts</p>
                <p className="text-[11px] text-slate-500">Get notified when target FX rates reach 30-day highs</p>
              </div>
              <input
                type="checkbox"
                checked={notifyRateAlerts}
                onChange={(e) => setNotifyRateAlerts(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">Security & Login Alerts</p>
                <p className="text-[11px] text-slate-500">Immediate alert upon new device access or password change</p>
              </div>
              <input
                type="checkbox"
                checked={notifySecurity}
                onChange={(e) => setNotifySecurity(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="py-4 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
