import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Shield, Globe, CreditCard, Send } from 'lucide-react';
import { API_BASE_URL } from '@/src/config/api';

interface LoginPageProps {
  onLogin: (accessToken?: string, user?: { id: string; fullName: string; email: string; role: string }) => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (jsonParseError) {
        throw new Error('The server returned an invalid response. Please verify the backend is active.');
      }

      if (!response.ok || !data.success) {
        // Fallback check: If the backend fails due to prototype mapping issues, 
        // provide a clean, context-sensitive message to the user.
        const friendlyMessage = data.message === 'An unexpected error occurred.'
          ? 'Invalid credentials. Please verify your email and password.'
          : (data.message || 'Authentication failed. Please check your credentials.');
          
        throw new Error(friendlyMessage);
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.accessToken, data.user);
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please check if your server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-8 font-sans selection:bg-[#2563EB] selection:text-white">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[720px] bg-white">
        
        {/* Left Panel: Brand & Illustration */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#172554] p-8 lg:p-14 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
              <span className="text-white font-black text-xl font-mono">W</span>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">
                WeXTransfer
              </span>
              <p className="text-[11px] text-blue-200/80 font-medium tracking-wide">Global Fintech Platform</p>
            </div>
          </div>

          <div className="relative z-10 my-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
              <div className="w-72 h-72 border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-56 h-56 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 border-2 border-white/40 rounded-full flex items-center justify-center relative">
                    <div className="w-24 h-24 bg-white/10 rounded-full animate-pulse flex items-center justify-center">
                      <Globe className="w-12 h-12 text-blue-200" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 -right-6 w-48 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-300">
                <div className="w-10 h-6 bg-yellow-400/80 rounded-sm mb-6 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-slate-900" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-20 h-2 bg-white/40 rounded"></div>
                  <div className="w-6 h-6 border border-white/40 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute bottom-4 -left-8 w-48 h-32 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 bg-blue-400/40 rounded-full flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-4 h-4 bg-white/60 rounded-full"></div>
                </div>
                <div className="mt-10 w-24 h-2 bg-white/30 rounded"></div>
              </div>
            </div>

            <div className="max-w-md">
              <h1 className="text-3xl lg:text-2xl font-bold tracking-tight mb-3 leading-tight text-white">
                Global Transfers<br />Simplified.
              </h1>
            </div>
          </div>

          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" className="stroke-white fill-none">
              <path d="M100 200 Q 300 100 500 200" strokeDasharray="5,5" />
              <path d="M150 500 Q 400 350 600 450" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="lg:col-span-5 bg-white p-8 lg:p-12 flex flex-col justify-center relative">
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-xl">W</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">WeXTransfer</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
              <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
                <span className="font-bold"></span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="mugenzi@gmail.com"
                    className="w-full h-14 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-5 transition-all outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-14 bg-slate-100 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-2xl pl-12 pr-5 transition-all outline-none text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-base"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
              <div className="flex-1 h-[1px] bg-slate-200"></div>
            </div>

            <button
              onClick={onNavigateToSignup}
              className="mt-8 w-full h-14 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center cursor-pointer text-base"
            >
              Create Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};