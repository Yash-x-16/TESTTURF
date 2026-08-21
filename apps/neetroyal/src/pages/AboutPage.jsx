import React from 'react';
import { 
  Shield, 
  Zap, 
  Target, 
  Brain, 
  Flame, 
  Swords, 
  ArrowLeft, 
  Award, 
  Activity, 
  Cpu, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

export default function AboutPage({ onBack, onGetStarted }) {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 overflow-x-hidden p-4 sm:p-6 md:p-8 font-mono transition-colors duration-300">
      
      {/* HEADER / NAVIGATION */}
      <header className="max-w-7xl mx-auto flex items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-950">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-bold uppercase">
            WHITE PAPER & SPECS
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto py-10 space-y-16">
        
        {/* HERO INTRO */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            THE NEETROYAL ARCHITECTURE
          </div>

          <p className="text-xl sm:text-4xl font-black font-sans uppercase text-slate-900 dark:text-white leading-tight">
            GAMIFIED HIGH-STAKES EXAM MASTERY
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-mono">
            NEETROYAL replaces traditional high-pressure test prep with competitive battle-royale mechanics, turning repetitive question practice into an addictive 1v1 survival game backed by dynamic RAG AI telemetry.
          </p>
        </div>

        {/* CORE PILLARS GRID */}
        <section className="grid md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
              <Swords className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
              1v1 PvP Matchmaking
            </h3>
            <p className="text-slate-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
              Face peer aspirants in high-speed 7-second time-attack duels. Correct answers trigger damage to opponent HP while wrong answers drain your own shield based on question difficulty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
              <Cpu className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
              RAG AI Telemetry
            </h3>
            <p className="text-slate-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
              Our Retrieval-Augmented Generation pipeline continuously logs every error, mapping knowledge gaps in Physics, Chemistry, and Biology to auto-generate personalized diagnostic paths.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
              <Flame className="w-6 h-6 text-orange-500 fill-current" />
            </div>
            <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
              Anti-Burnout Mechanics
            </h3>
            <p className="text-slate-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
              Short micro-burst sessions prevent study fatigue, replacing mind-numbing multi-hour paper mocks with rewarding XP multipliers, win streaks, and ELO rank progressions.
            </p>
          </div>

        </section>

        {/* SYSTEM COMPARISON TABLE */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-6">
          <div className="border-b border-slate-200 dark:border-emerald-950 pb-4">
            <p className="text-2xl font-black font-sans uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-red-400" />
              THE NEETROYAL ADVANTAGE
            </p>
            <p className="text-xs text-slate-500 dark:text-emerald-600 font-mono">
              Traditional Coaching Mocks vs. NEETROYAL Gamified Telemetry
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-emerald-900 text-slate-500 dark:text-emerald-600">
                  <th className="py-3 px-4 uppercase font-bold">Feature</th>
                  <th className="py-3 px-4 uppercase font-bold text-slate-400 dark:text-zinc-500">Traditional Mocks</th>
                  <th className="py-3 px-4 uppercase font-bold text-emerald-600 dark:text-emerald-400">NEETROYAL Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="py-4 px-4 font-bold">Feedback Delay</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-zinc-500">24-48 Hours</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">&lt;100ms Real-Time RAG Analysis</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Engagement Engine</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-zinc-500">High Stress Paper Tests</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">1v1 Real-Time HP Battle Duels</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Error Analytics</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-zinc-500">Generic Answer Keys</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">Heatmaps & Weak Topic Diagnostics</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Motivation System</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-zinc-500">Static Rank Lists</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">Win Streaks, XP Multipliers & Division Tiers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <div className="p-8 rounded-2xl bg-emerald-600 dark:bg-emerald-950/80 border border-emerald-500 text-white dark:text-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black font-sans uppercase">
              READY TO ENTER THE ARENA?
            </h3>
            <p className="text-xs font-mono text-emerald-100 dark:text-emerald-500">
              Join thousands of NEET aspirants competing live in real-time battles.
            </p>
          </div>

          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl bg-white dark:bg-emerald-400 text-emerald-900 dark:text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            ENTER ARENA NOW
          </button>
        </div>

      </main>

    </div>
  );
}