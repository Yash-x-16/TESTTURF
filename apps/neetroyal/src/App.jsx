import { useState, useEffect } from "react";
import Dither from "./component/Dither";
import Specular from "./component/Specular";
import CurvedLoop from "./component/CurvedLoop";
import AnimatedContent from "./component/AnimatedContent";
import AuthPage from "./pages/AuthPage";
import QuizArena from "./pages/QuizPage";
import DashboardPage from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import Footer from "./component/Footer";
import {
  Zap,
  Target,
  Trophy,
  Flame,
  Brain,
  Award,
  Crosshair,
  LayoutDashboard,
  Swords,
  LogOut,
  Sun,
  Moon,
  Crown,
  Medal,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import "./App.css";

export default function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const startMatchmaking = () => {
    setIsMatchmaking(true);
    setTimeout(() => {
      setIsMatchmaking(false);
      setCurrentView("arena");
    }, 2500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("landing");
  };

  if (currentView === "auth" && !isAuthenticated) {
    return (
      <AuthPage
        onBack={() => setCurrentView("landing")}
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentView("dashboard");
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 overflow-x-hidden font-mono transition-colors duration-300">
      
      {/* MATCHMAKING OVERLAY */}
      {isMatchmaking && (
        <div className="fixed inset-0 z-50 bg-slate-100/90 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 font-mono">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-slate-300 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin"></div>
            <Swords className="w-10 h-10 text-emerald-600 dark:text-emerald-400 absolute animate-pulse" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black font-sans tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              SEARCHING FOR OPPONENT...
            </h2>
            <p className="text-xs text-slate-600 dark:text-emerald-600 font-mono">
              SKILL-BASED ELO MATCHMAKING • ARENA #9042
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-500/40 text-xs text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping"></span>
            <span>MATCH FOUND! LOADING TELEMETRY...</span>
          </div>
        </div>
      )}

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* NAVBAR */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-black/80 border-b border-slate-200 dark:border-emerald-900/40 px-6 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <div
              onClick={() =>
                setCurrentView(isAuthenticated ? "dashboard" : "landing")
              }
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <span className="text-xl font-black font-sans tracking-wider text-emerald-600 dark:text-emerald-400">
                NEETROYAL
              </span>
            </div>

            {/* Header Right Group */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-200 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900/60 text-slate-900 dark:text-slate-200 hover:scale-105 transition-all cursor-pointer font-mono"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      currentView === "dashboard"
                        ? "bg-emerald-600 text-white dark:bg-emerald-950 dark:border dark:border-emerald-500/50 dark:text-emerald-400 font-bold"
                        : "bg-slate-200 dark:bg-zinc-950 text-slate-700 dark:text-emerald-600 hover:text-slate-900 dark:hover:text-emerald-400 border border-slate-300 dark:border-emerald-900/40"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="font-mono">DASHBOARD</span>
                  </button>

                  <button
                    onClick={startMatchmaking}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-black tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer font-mono"
                  >
                    <Swords className="w-4 h-4 fill-current" />
                    <span className="font-mono">START 1v1 MATCH</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl bg-slate-200 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900/40 text-slate-600 dark:text-emerald-600 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="hidden md:inline-flex relative items-center justify-center">
                    <Specular
                      as="div"
                      radius={9999}
                      tint="#ffffff"
                      tintOpacity={0.1}
                      blur={0}
                      lineColor="#10b981"
                      baseColor="#064e3b"
                      intensity={1.5}
                      shineSize={20}
                      shineFade={40}
                      thickness={2.0}
                      speed={0.35}
                      followMouse
                      proximity={250}
                      className="relative flex items-center justify-center w-full h-full overflow-visible"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-emerald-950/80 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-400 border border-slate-300 dark:border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-red-700 dark:bg-red-600 animate-pulse"></span>
                        <span className="font-mono">1,840 ASPIRANTS IN MATCHMAKING</span>
                      </div>
                    </Specular>
                  </div>

                  <Specular
                    as="button"
                    radius={12}
                    tint="#ffffff"
                    tintOpacity={0.1}
                    blur={0}
                    lineColor="#10b981"
                    baseColor="#064e3b"
                    intensity={1.5}
                    shineSize={20}
                    shineFade={40}
                    thickness={2.0}
                    speed={0.35}
                    followMouse
                    proximity={250}
                    autoAnimate={false}
                    onClick={() => setCurrentView("auth")}
                    className="relative px-6 py-2.5 text-xs font-mono font-bold tracking-wider text-black dark:text-emerald-400 uppercase active:scale-95 transition-all duration-300 cursor-pointer rounded-xl overflow-visible flex items-center justify-center bg-emerald-600 dark:bg-transparent"
                  >
                    ENTER ARENA
                  </Specular>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* VIEW ROUTING */}
        {currentView === "dashboard" && (
          <DashboardPage onStartBattle={startMatchmaking} />
        )}
        
        {currentView === "arena" && (
          <QuizArena onReturnToHub={() => setCurrentView("dashboard")} />
        )}

        {currentView === "about" && (
          <AboutPage 
            onBack={() => setCurrentView("landing")} 
            onGetStarted={() => setCurrentView(isAuthenticated ? "dashboard" : "auth")} 
          />
        )}

        {currentView === "landing" && (
          <>
            {/* HERO SECTION WITH SCOPED DITHER BACKGROUND */}
            <main className="relative max-w-7xl mx-auto px-6 py-2 lg:py-20 grid lg:grid-cols-12 gap-12 items-center overflow-hidden">
              
              <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
                <Dither
                  waveColor={[0.027, 0.482, 0.094]}
                  disableAnimation={false}
                  enableMouseInteraction={true}
                  colorNum={4}
                  mouseRadius={0.3}
                  waveFrequency={3}
                  waveAmplitude={0.3}
                  waveSpeed={0.05}
                />
              </div>

              {/* Left Column */}
              <div className="relative z-10 lg:col-span-7">
                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  reverse={false}
                  duration={1.2}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1}
                  threshold={0.1}
                  delay={0.1}
                >
                  <div className="space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-xs font-mono tracking-widest ">
                      <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 fill-current" />
                      AI-POWERED GAMIFIED NEET PREP
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight leading-tight text-black dark:text-slate-900 uppercase">
                      <span className="text-5xl sm:text-5xl text-black font-sans tracking-tight leading-tight dark:text-slate-200">
                        DOMINATE NEET THROUGH{" "}
                      </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                        Survival Battles
                      </span>
                    </h1>

                    <p className="text-black dark:text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mt-6 font-mono">
                      Eliminate high-stakes exam burnout. Face off in live
                      duels, analyze real-time error telemetry via our
                      continuous AI RAG engine, and turn knowledge gaps into
                      guaranteed mastery.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-7 font-mono">
                      <button
                        onClick={() =>
                          setCurrentView(isAuthenticated ? "dashboard" : "auth")
                        }
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer font-mono"
                      >
                        <Zap className="w-5 h-5 fill-current text-yellow-400" />
                        <span>Get Started</span>
                      </button>

                      {/* LEARN MORE BUTTON NOW REDIRECTS TO ABOUT PAGE */}
                      <button 
                        onClick={() => setCurrentView("about")}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 font-bold text-sm border border-slate-300 dark:border-emerald-900/60 uppercase tracking-wider transition-all hover:border-emerald-500 cursor-pointer font-mono"
                      >
                        <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span>Learn More</span>
                      </button>
                    </div>

                    <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-emerald-900/40 max-w-lg font-mono">
                      <div>
                        <p className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">
                          &lt;100ms
                        </p>
                        <p className="text-s text-black dark:text-slate-200 font-mono">Battle Latency</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">
                          RAG AI
                        </p>
                        <p className="text-s text-black dark:text-slate-200 font-mono">
                          Telemetry Engine
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400">0%</p>
                        <p className="text-s text-black dark:text-slate-200 font-mono">Exam Burnout</p>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              </div>

              {/* Right Column: Battle HUD Animation */}
              <div className="relative z-10 lg:col-span-5">
                <AnimatedContent
                  distance={60}
                  direction="vertical"
                  reverse={false}
                  duration={1.2}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1}
                  threshold={0.1}
                  delay={0.4}
                >
                  <div className="relative glass-card p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-xl dark:shadow-none backdrop-blur-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-emerald-950 font-mono">
                      <span className="text-s text-slate-200 dark:text-emerald-400 font-bold tracking-widest uppercase">
                        MATCHMAKING ARENA #9042
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                        LIVE DUEL
                      </span>
                    </div>

                    <div className="space-y-4 font-mono">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-200 dark:text-emerald-400">
                            YOU (Aspirant_01)
                          </span>
                          <span className="text-slate-200 dark:text-emerald-400">
                            HP: 100/100 (+120 XP)
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 dark:bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-emerald-950">
                          <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300 dark:text-emerald-700">
                            OPPONENT (Rank #14)
                          </span>
                          <span className="text-slate-300 dark:text-emerald-600">HP: 40/100</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 dark:bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-emerald-950">
                          <div className="h-full bg-red-800 rounded-full w-[40%]"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900/40 space-y-3 font-mono">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-emerald-600">
                        <span>BIOLOGY - CELL CYCLE</span>
                        <span className="text-emerald-600 dark:text-emerald-400">00:06s</span>
                      </div>
                      <p className="text-xs font-black font-sans text-slate-900 dark:text-slate-200">
                        In which phase of mitosis do sister chromatids separate
                        to opposite poles?
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                          <span>A) Anaphase</span>
                          <span className="text-[9px] bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black px-1 rounded">
                            CORRECT
                          </span>
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-black border border-slate-200 dark:border-emerald-950 text-slate-500 dark:text-emerald-700">
                          B) Metaphase
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3 font-mono">
                      <Trophy className="w-5 h-5 text-yellow-400 dark:text-yellow-400 shrink-0" />
                      <p className="text-xs text-slate-700 dark:text-emerald-400">
                        <strong className="text-emerald-800 dark:text-slate-200">
                          RAG Diagnostic:
                        </strong>{" "}
                        Cell Biology mastery increased by +12%.
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </main>

            {/* MARQUEE LOOP */}
            <AnimatedContent
              distance={40}
              direction="vertical"
              reverse={false}
              duration={1}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.6}
            >
              <section className="max-w-auto h-100 mx-auto -mt-39 -mb-10 py-0 w-full relative z-20 overflow-hidden">
                <CurvedLoop
                  marqueeText="Be ✦ Competitive ✦ Hail ✦ Mary ✦ NeetRoyal ✦ "
                  speed={2}
                  curveAmount={250}
                  direction="right"
                  interactive
                  className="custom-text-style text-center mx-5 text-slate-900 dark:text-emerald-400 fill-slate-900 dark:fill-slate-200 transition-colors duration-300"
                />
              </section>
            </AnimatedContent>

            {/* FEATURES GRID */}
            <AnimatedContent
              distance={60}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.15}
              delay={0.2}
            >
              <section className="max-w-7xl mx-auto px-6 py-16 w-full">
                <div className="text-center space-y-3 mb-12">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    ENGINEERED FOR MASTERY
                  </span>
                  <p className="text-2xl sm:text-6xl font-black font-sans uppercase text-slate-900 dark:text-white">
                    THE NEETROYAL ENGINE
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4 transition-all">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
                      <Crosshair className="w-6 h-6 text-red-600 dark:text-red-600" />
                    </div>
                    <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                      1v1 Real-Time Duels
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                      Skill-based matchmaking pits you against peer aspirants.
                      Speed, accuracy, and streak multipliers dictate victory.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4 transition-all">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
                      <Brain className="w-6 h-6 text-pink-400 dark:text-pink-400" />
                    </div>
                    <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                      AI RAG Telemetry
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                      Our Retrieval-Augmented Generation pipeline analyzes every
                      wrong answer, mapping knowledge gaps to generate
                      diagnostic paths.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4 transition-all">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
                      <Award className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                      Gamified Ranks & Leaderboards
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                      Earn XP, unlock tactical badges, and climb global,
                      regional, and subject-wise leaderboards in real time.
                    </p>
                  </div>
                </div>
              </section>
            </AnimatedContent>

            {/* BATTLE ROYALE BENTO GRID SHOWCASE */}
            <AnimatedContent
              distance={60}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.15}
              delay={0.2}
            >
              <section className="max-w-7xl mx-auto px-6 py-12 pb-20 w-full space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    PROGRESSION ARENA
                  </span>
                  <p className="text-2xl sm:text-6xl font-black font-sans uppercase text-slate-900 dark:text-white">
                    BATTLE ROYALE TIERS
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  
                  {/* Bento Tile 1: Rank Badge Tier (Wide) */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                        <Crown className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold uppercase">
                        TOP 1% ASPIRANTS
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                        APEX DOCTOR TIER
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                        Climb through Bronze, Gold, and Master divisions to reach Apex Doctor status. Earn seasonal badges, unique telemetry titles, and exam day priority analysis.
                      </p>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-zinc-950 rounded-xl p-4 border border-slate-200 dark:border-emerald-900/40 flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-500 dark:text-emerald-700">CURRENT SEASON HIGH:</span>
                      <span className="font-bold text-slate-900 dark:text-emerald-400">2,840 ELO MMR</span>
                    </div>
                  </div>

                  {/* Bento Tile 2: Win Streak System */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex flex-col justify-between space-y-6">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
                      <Flame className="w-8 h-8 text-orange-500 fill-current" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                        MULTIPLIERS
                      </span>
                      <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                        HOT STREAK XP
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                        Maintain win streaks to trigger up to 2.5x XP multipliers and accelerate diagnostic level rewards.
                      </p>
                    </div>
                  </div>

                  {/* Bento Tile 3: Live Matchmaking Radar */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex flex-col justify-between space-y-6">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl w-fit">
                      <Sparkles className="w-8 h-8 text-emerald-500" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                        NETWORKING
                      </span>
                      <h3 className="text-xl font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                        GLOBAL LOBBIES
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-600/90 text-sm leading-relaxed font-mono">
                        Face peer aspirants from across India in subject-wise or full-mock NEET survival matches.
                      </p>
                    </div>
                  </div>

                  {/* Bento Tile 4: Diagnostic Health Bar (Tall / Full Width) */}
                  <div className="md:col-span-3 lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black font-sans uppercase text-slate-900 dark:text-slate-200">
                          NEET HP & DAMAGE MECHANICS
                        </h3>
                        <p className="text-emerald-600 dark:text-emerald-600/90 text-xs font-mono">
                          Correct answers inflict damage to your opponent. Mistakes drain your own health bar based on question difficulty.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Medal className="w-6 h-6 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-emerald-400 uppercase tracking-wider">
                        SEASON 2026 LIVE
                      </span>
                    </div>
                  </div>

                </div>
              </section>
            </AnimatedContent>
          </>
        )}

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}