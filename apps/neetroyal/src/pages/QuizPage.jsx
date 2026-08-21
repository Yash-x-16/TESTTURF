import React, { useState, useEffect } from 'react';
import { Shield, Flame, Trophy, Clock, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

// Expanded 5 Sample Questions
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    subject: "BIOLOGY",
    topic: "Cell Cycle & Division",
    year: "NEET 2023",
    question: "During which phase of mitosis do sister chromatids separate and move toward opposite poles of the spindle?",
    options: [
      { id: "A", text: "Prophase" },
      { id: "B", text: "Metaphase" },
      { id: "C", text: "Anaphase" },
      { id: "D", text: "Telophase" }
    ],
    correctAnswer: "C",
    explanation: "During Anaphase, centromeres split and sister chromatids separate to move toward opposite poles."
  },
  {
    id: 2,
    subject: "PHYSICS",
    topic: "Current Electricity",
    year: "NEET 2022",
    question: "A copper wire of resistance R is stretched to twice its original length. What is its new resistance?",
    options: [
      { id: "A", text: "2R" },
      { id: "B", text: "4R" },
      { id: "C", text: "R / 2" },
      { id: "D", text: "R / 4" }
    ],
    correctAnswer: "B",
    explanation: "Resistance R = ρL/A. When length doubles, volume remains constant, so area becomes A/2. New R' = ρ(2L)/(A/2) = 4R."
  },
  {
    id: 3,
    subject: "CHEMISTRY",
    topic: "Basic Principles (Organic)",
    year: "NEET 2021",
    question: "Which of the following carbocations is most stable?",
    options: [
      { id: "A", text: "Methyl carbocation" },
      { id: "B", text: "Primary carbocation" },
      { id: "C", text: "Secondary carbocation" },
      { id: "D", text: "Tertiary carbocation" }
    ],
    correctAnswer: "D",
    explanation: "Tertiary carbocations are most stable due to maximum hyperconjugation (+H) and inductive (+I) effects from three surrounding alkyl groups."
  },
  {
    id: 4,
    subject: "PHYSICS",
    topic: "Kinematics",
    year: "NEET 2020",
    question: "A particle is projected at an angle of 45° with kinetic energy K. What is the kinetic energy at the highest point?",
    options: [
      { id: "A", text: "K" },
      { id: "B", text: "K / 2" },
      { id: "C", text: "K / 4" },
      { id: "D", text: "Zero" }
    ],
    correctAnswer: "B",
    explanation: "At the highest point, vertical velocity is zero. Horizontal velocity is v*cos(45°) = v/√2. KE = 1/2 m(v/√2)² = K/2."
  },
  {
    id: 5,
    subject: "BIOLOGY",
    topic: "Molecular Inheritance",
    year: "NEET 2023",
    question: "Which enzyme is primarily responsible for the transcription of precursor mRNA (hnRNA) in eukaryotes?",
    options: [
      { id: "A", text: "RNA Polymerase I" },
      { id: "B", text: "RNA Polymerase II" },
      { id: "C", text: "RNA Polymerase III" },
      { id: "D", text: "DNA Polymerase" }
    ],
    correctAnswer: "B",
    explanation: "In eukaryotes, RNA Polymerase II transcribes the precursor of mRNA (hnRNA). Pol I transcribes rRNAs, and Pol III transcribes tRNA."
  }
];

export default function QuizArena({ onReturnToHub }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [userHp, setUserHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [streak, setStreak] = useState(0);

  const q = SAMPLE_QUESTIONS[currentIdx];
  const isMatchOver = currentIdx >= SAMPLE_QUESTIONS.length;

  // Timer Effect
  useEffect(() => {
    if (isAnswered || isMatchOver) return;
    
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isMatchOver]);

  // Auto-Advance Effect
  useEffect(() => {
    if (isAnswered && currentIdx < SAMPLE_QUESTIONS.length - 1) {
      const timeout = setTimeout(() => {
        handleNextQuestion();
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [isAnswered, currentIdx]);

  const handleAnswer = (optionId) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    if (optionId === q.correctAnswer) {
      setOpponentHp((prev) => Math.max(0, prev - 35));
      setStreak((prev) => prev + 1);
    } else {
      setUserHp((prev) => Math.max(0, prev - 25));
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < SAMPLE_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(7);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };
  

  if (isMatchOver) {
    return (
      <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 flex flex-col items-center justify-center font-mono">
        <Trophy className="w-20 h-20 text-yellow-400 mb-6 animate-pulse" />
        <p className="text-4xl font-black font-sans uppercase text-slate-900 dark:text-emerald-400 mb-2">Match Complete</p>
        <p className="text-slate-500 dark:text-emerald-600 mb-8">RAG Telemetry has been recorded to your dashboard.</p>
        
        {/* Updated Button: Uses state callback instead of window.location.reload() */}
        <button
          onClick={onReturnToHub}
          className="px-6 py-3 my-5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
        >
          RETURN TO HUB
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 overflow-x-hidden p-4 sm:p-6 md:p-8 font-mono transition-colors duration-300">
      
      {/* ARENA HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-950">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-sans tracking-wider text-slate-900 dark:text-emerald-400">
            Quiz Arena <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest ml-2 px-2 py-0.5 rounded bg-emerald-100 dark:bg-black border border-emerald-300 dark:border-emerald-800">1v1 MATCH</span>
          </span>
        </div>

        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900 shadow-sm dark:shadow-none font-mono">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className={`text-xl font-black ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
            00:0{timeLeft}s
          </span>
        </div>
      </header>

      {/* BATTLE GRID */}
      <main className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-sm dark:shadow-none font-mono transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                {q.subject}
              </span>
              <span className="text-sm font-bold text-slate-600 dark:text-emerald-300">
                {q.topic}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-black">
              <Flame className="w-4 h-4 fill-current text-orange-400" />
              <span>{q.year}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4 transition-colors">
            <p className="text-xs font-mono text-slate-900 dark:text-emerald-600 uppercase tracking-widest">
              QUESTION {currentIdx + 1} OF {SAMPLE_QUESTIONS.length}
            </p>
            <p className="text-sm sm:text-2xl font-black font-sans leading-relaxed text-slate-900 dark:text-slate-200">
              {q.question}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt) => {
              let btnStyle = "bg-white dark:bg-black border-slate-200 dark:border-emerald-900/60 text-slate-900 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-500";
              
              if (isAnswered) {
                if (opt.id === q.correctAnswer) {
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 dark:border-emerald-400 text-slate-900 dark:text-slate-200 font-bold shadow-lg";
                } else if (opt.id === selectedOption) {
                  btnStyle = "bg-slate-100 dark:bg-black border-slate-400 dark:border-emerald-800 text-slate-300 dark:text-emerald-700 font-bold";
                } else {
                  btnStyle = "bg-white dark:bg-black border-slate-100 dark:border-zinc-900 text-slate-400 dark:text-emerald-800 opacity-50";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer font-mono shadow-sm dark:shadow-none ${btnStyle}`}
                >
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-emerald-400">
                    {opt.id}
                  </span>
                  <span className="text-sm font-medium pt-0.5 leading-snug">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-500/40 shadow-lg dark:shadow-none space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                <div className="flex items-center gap-2">
                  {selectedOption === q.correctAnswer ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" /> CRITICAL HIT! (+35 DMG)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-500 font-bold text-xs uppercase">
                      <XCircle className="w-4 h-4" /> {selectedOption === null ? 'TIME OUT' : 'MISSED TARGET'} (-25 HP)
                    </span>
                  )}
                </div>

                {currentIdx < SAMPLE_QUESTIONS.length - 1 ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-emerald-600">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    AUTO-ADVANCING...
                  </div>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    FINISH MATCH <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-400 leading-relaxed font-mono">
                <strong className="text-slate-900 dark:text-emerald-300">RAG Analysis:</strong> {q.explanation}
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-6 transition-colors">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-emerald-400 tracking-widest uppercase pb-3 border-b border-slate-200 dark:border-emerald-950">
              DUEL STATUS #9042
            </h3>

            <div className="space-y-5 font-mono">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800 dark:text-slate-200">YOU (Aspirant_01)</span>
                  <span className="text-slate-700 dark:text-emerald-400">{userHp}/100 HP</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-emerald-900">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${userHp}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500 dark:text-slate-300">OPPONENT (Rank #14)</span>
                  <span className="text-slate-600 dark:text-emerald-600">{opponentHp}/100 HP</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-emerald-950">
                  <div
                    className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                    style={{ width: `${opponentHp}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-500 dark:text-orange-400 font-bold">CURRENT STREAK</span>
              <span className="text-lg font-black text-slate-900 dark:text-emerald-400">x{streak}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3 font-mono">
              <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400 shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-slate-200 leading-tight">
                Mastery rating updating via live RAG telemetry engine.
              </p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}