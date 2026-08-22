import React, { useState, useEffect } from 'react';
import { Shield, Zap, Flame, Trophy, AlertTriangle, ArrowUpRight, Target, CheckCircle2, Calendar, Swords, Crosshair, BookOpen, X, Sparkles } from 'lucide-react';
import { HTTP_BASE_URL } from '../config.js';

const generateHeatmapData = () => {
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 25) : 0;
    days.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  return days;
};

const HEATMAP_DATA = generateHeatmapData();

const getIntensityClass = (count) => {
  if (count === 0) return 'bg-slate-200 dark:bg-zinc-950 border-slate-300 dark:border-zinc-900';
  if (count < 5) return 'bg-emerald-200 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-900/60';
  if (count < 12) return 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600';
  if (count < 18) return 'bg-emerald-500 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-400';
  return 'bg-emerald-600 dark:bg-emerald-400 border-emerald-700 dark:border-emerald-300 shadow-sm shadow-emerald-500/50';
};

export default function DashboardPage({ onStartBattle, currentUser, token }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(currentUser || null);

  // Fetch real profile from HTTP backend
  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    fetch(`${HTTP_BASE_URL}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfileData(data.profile);
        }
      })
      .catch((err) => console.error('Error loading profile:', err));
  }, [token]);

  const weakTopics = [
    { id: 1, subject: 'PHYSICS', topic: 'Electrostatics & Current Electricity', accuracy: 38, errors: 42, priority: 'HIGH' },
    { id: 2, subject: 'CHEMISTRY', topic: 'Chemical Thermodynamics & Bonding', accuracy: 45, errors: 31, priority: 'HIGH' },
    { id: 3, subject: 'BIOLOGY', topic: 'Cell Biology & Plant Physiology', accuracy: 52, errors: 24, priority: 'MEDIUM' },
  ];

  const totalQuestionsThisYear = HEATMAP_DATA.reduce((acc, d) => acc + d.count, 0);

  const handleLaunchMode = (mode) => {
    if (mode === '1v1') {
      setIsModeModalOpen(false);
      onStartBattle();
    }
  };

  const points = profileData?.points ?? 0;
  const matchesWon = profileData?.matchesWon ?? 0;
  const matchesPlayed = profileData?.matchesPlayed ?? 0;
  const winRate = matchesPlayed > 0 ? ((matchesWon / matchesPlayed) * 100).toFixed(1) : '75.0';
  const rank = profileData?.rank ? `#${profileData.rank}` : 'GOLD II';

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 overflow-x-hidden p-4 sm:p-6 md:p-8 font-mono transition-colors duration-300">
      
      {/* GAME MODE SELECTION MODAL POPUP */}
      {isModeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-950 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xl font-black font-sans uppercase tracking-tight text-slate-900 dark:text-white">
                  SELECT GAME MODE
                </p>
              </div>
              <button
                onClick={() => setIsModeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-emerald-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Game Modes Grid */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* 1. 1v1 Battle Duel (ACTIVE) */}
              <div
                onClick={() => handleLaunchMode('1v1')}
                className="group relative p-5 rounded-xl bg-slate-50 dark:bg-black border border-emerald-500/60 hover:border-emerald-500 cursor-pointer transition-all flex items-center justify-between shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                    <Swords className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black font-sans uppercase text-slate-900 dark:text-emerald-300">
                        1v1 ARENA DUEL
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-emerald-600 font-mono mt-0.5">
                      Fast 15-sec per question NEET battle with +4 / -1 scoring against live aspirants.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              {/* 2. Survival Battle Royale (COMING SOON) */}
              <div className="relative p-5 rounded-xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 opacity-75 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-xl">
                    <Crosshair className="w-6 h-6 text-slate-500 dark:text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black font-sans uppercase text-slate-400 dark:text-slate-500">
                        SURVIVAL ROYALE
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                        COMING SOON
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-zinc-600 font-mono mt-0.5">
                      100-aspirant knock-out lobby with dynamic storm zones.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 rounded-xl">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-black font-sans tracking-wider text-slate-900 dark:text-emerald-400">
              {profileData?.name || 'Dashboard'}
            </span>
            <span className="block text-[10px] font-mono text-slate-500 dark:text-emerald-600 tracking-widest uppercase">
              ASPIRANT DIAGNOSTIC HUB • {profileData?.username ? `@${profileData.username}` : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* Start Match Button */}
        <button
          onClick={() => setIsModeModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Swords className="w-4 h-4 fill-current" />
          <span>Start 1v1 Match</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-8 space-y-8">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-orange-500 dark:text-orange-400 font-bold uppercase tracking-wider font-mono">Total Points</p>
              <p className="text-3xl font-black font-sans text-slate-900 dark:text-slate-200">{points} PTS</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-600 font-mono">NEET Exam Scoring</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <Flame className="w-7 h-7 text-orange-500 dark:text-orange-400 fill-current" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-yellow-500 dark:text-yellow-400 font-bold uppercase tracking-wider font-mono">Win Rate</p>
              <p className="text-3xl font-black font-sans text-slate-900 dark:text-slate-200">{winRate}%</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-600 font-mono">{matchesWon} Won / {matchesPlayed} Played</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <Trophy className="w-7 h-7 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-red-500 dark:text-red-500 font-bold uppercase tracking-wider font-mono">Battle Rank</p>
              <p className="text-3xl font-black font-sans text-slate-900 dark:text-slate-200">{rank}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-600 font-mono">Top Aspirants</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <Target className="w-7 h-7 text-red-600 dark:text-red-500" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-emerald-700 dark:text-emerald-600 font-bold uppercase tracking-wider font-mono">Questions Solved</p>
              <p className="text-3xl font-black font-sans text-slate-900 dark:text-slate-200">{totalQuestionsThisYear}</p>
              <p className="text-[10px] text-slate-500 dark:text-emerald-600 font-mono">Across 365 days</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <CheckCircle2 className="w-7 h-7 text-emerald-700 dark:text-emerald-500" />
            </div>
          </div>

        </div>

        {/* ACTIVITY HEATMAP */}
        <section className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xl font-black font-sans uppercase tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-200">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                QUESTION ACTIVITY HEATMAP
              </p>
              <p className="text-xs text-slate-500 dark:text-emerald-600 font-mono">
                {totalQuestionsThisYear} NEET questions completed in the last year
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-emerald-600">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-900"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-900/60"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400"></span>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pt-2 pb-2">
            <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max">
              {HEATMAP_DATA.map((day, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 cursor-pointer ${getIntensityClass(day.count)}`}
                />
              ))}
            </div>
          </div>

          <div className="h-5 font-mono text-xs text-emerald-700 dark:text-emerald-400">
            {hoveredDay ? (
              <span><strong>{hoveredDay.count} questions</strong> on {hoveredDay.date}</span>
            ) : (
              <span className="text-slate-400 dark:text-emerald-700">Hover over a square to view details</span>
            )}
          </div>
        </section>

        {/* WEAK TOPICS SECTION */}
        <section className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-950 pb-4">
            <div>
              <p className="text-xl font-black font-sans uppercase tracking-tight text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-600" />
                WEAK TOPIC DIAGNOSTICS
              </p>
              <p className="text-xs text-slate-500 dark:text-emerald-600 font-mono">
                Identified via AI error tracking and 1v1 battle telemetry
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-bold">
              3 ACTION ITEMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weakTopics.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900/40 space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-emerald-900 text-slate-700 dark:text-emerald-400 text-[10px] font-bold">
                      {item.subject}
                    </span>
                    <span className="text-[10px] font-black text-red-600 dark:text-red-600 bg-slate-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                      {item.priority} PRIORITY
                    </span>
                  </div>
                  <h3 className="text-sm font-black font-sans text-slate-900 dark:text-emerald-300">{item.topic}</h3>
                </div>

                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-emerald-600">Accuracy</span>
                    <span className="text-emerald-700 dark:text-emerald-400">{item.accuracy}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-black rounded-full overflow-hidden border border-slate-300 dark:border-emerald-950">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-700">{item.errors} wrong answers recorded</p>
                </div>

                {/* Quick Match Action Button */}
                <button
                  onClick={onStartBattle}
                  className="w-full py-2.5 px-4 rounded-lg bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-300 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-yellow-500" />
                  <span>Quick Match (1v1)</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            ))}
          </div>
        </section>
            
      </main>

    </div>
  );
}