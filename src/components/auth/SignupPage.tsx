import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Globe, CreditCard, Send } from 'lucide-react';

interface SignupPageProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@wextransfer.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-8 font-sans selection:bg-[#2563EB] selection:text-white">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[720px] bg-white">
        
        {/* Left Side: Sleek Interface Brand & Illustration Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#172554] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center border border-white/20 shadow-md">
              <span className="text-white font-black text-xl font-mono">W</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                WeXTransfer
              </span>
              <p className="text-[11px] text-blue-200/80 font-medium">Create Member Account</p>
            </div>
          </div>

          {/* Abstract Floating Cards & Info */}
          <div className="my-8 relative z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl transform -rotate-2 hover:rotate-0 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-blue-200">Virtual Multi-Currency Account</span>
                <span className="text-xs font-bold text-emerald-300">Instant</span>
              </div>
              <p className="text-2xl font-mono font-bold text-white">$24,850.00 <span className="text-sm font-normal text-blue-200">USD</span></p>
              <p className="text-xs text-blue-200/80 mt-1">Instant FX conversion across 35 major currencies</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl transform rotate-2 hover:rotate-0 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Zero Hidden Fees</p>
                  <p className="text-[11px] text-blue-200/80">Real mid-market rates locked 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-blue-200/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> FCA Regulated & Bank-Grade
            </span>
            <span className="font-mono text-[11px]">2.4M Users</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-lg">W</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">WeXTransfer</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h2>
              <p className="text-slate-500 text-sm">Start sending money internationally in under 2 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-13 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-4 transition-all outline-none text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex.morgan@company.com"
                    className="w-full h-13 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-4 transition-all outline-none text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-13 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-4 transition-all outline-none text-slate-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-13 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-4 transition-all outline-none text-slate-900 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  defaultChecked
                  className="w-5 h-5 rounded-lg accent-[#2563EB] border-slate-300 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                  I agree to the <a href="#terms" className="text-[#2563EB] font-bold hover:underline">Terms of Service</a> & <a href="#privacy" className="text-[#2563EB] font-bold hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4 text-base"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-[#2563EB] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

