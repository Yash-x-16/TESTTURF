import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ChevronLeft } from 'lucide-react';
import BorderGlow from '../component/BorderGlow';

export default function AuthPage({ onLoginSuccess, onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 flex flex-col justify-between items-center p-4 sm:p-6 font-mono transition-colors duration-300 overflow-x-hidden">
      
      {/* TOP HEADER WITH BACK BUTTON */}
      <header className="w-full max-w-7xl flex justify-between items-center py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </header>

      {/* AUTHENTICATION CARD WITH BORDER GLOW */}
      <main className="w-full max-w-md my-auto py-8">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="16 185 129"
          backgroundColor="#000000"
          borderRadius={24}
          glowRadius={35}
          glowIntensity={0.8}
          coneSpread={20}
          animated={true}
          colors={['#10b981', '#059669', '#047857']}
        >
          <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-black rounded-3xl overflow-hidden border border-slate-200 dark:border-transparent shadow-xl dark:shadow-none">
            
            {/* Title & Subtitle */}
            <div className="space-y-2 text-center">
              <span className="text-2xl sm:text-3xl font-bold font-sans uppercase tracking-tight text-emerald-500/80 dark:text-emerald-400">
                {isSignUp ? 'CREATE ASPIRANT ID' : 'ENTER THE ARENA'}
              </span>
              <p className="text-xs font-mono text-slate-900 dark:text-slate-200">
                {isSignUp
                  ? 'Join 1,800+ aspirants in gamified 1v1 NEET battles.'
                  : 'Enter your credentials to access your diagnostic dashboard.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-mono text-slate-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    Aspirant Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-200 dark:text-slate-200 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-slate-900 dark:text-emerald-300 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-emerald-800/60"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-slate-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-900 dark:text-slate-200 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="neetroyal@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-slate-900 dark:text-emerald-300 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-slate-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-900 dark:text-slate-200 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-slate-900 dark:text-emerald-300 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'INITIALIZE PROFILE' : 'ACCESS DASHBOARD'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="pt-2 text-center border-t border-slate-200 dark:border-emerald-950 text-xs font-mono">
              <span className="text-slate-900 dark:text-emerald-600">
                {isSignUp ? 'Already registered?' : "Don't have an ID yet?"}{' '}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-bold uppercase transition-colors cursor-pointer ml-1 underline underline-offset-4"
              >
                {isSignUp ? 'LOG IN' : 'SIGN UP'}
              </button>
            </div>

          </div>
        </BorderGlow>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] font-mono text-slate-400 dark:text-emerald-700">
        © 2026 NEETROYAL • Project Hail Mary
      </footer>

    </div>
  );
}