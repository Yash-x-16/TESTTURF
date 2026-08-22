import React, { useState, useEffect, useRef } from 'react';
import { Shield, Flame, Trophy, Clock, CheckCircle2, XCircle, ArrowRight, Loader2, Swords, AlertCircle, Sparkles } from 'lucide-react';
import { WS_BASE_URL } from '../config.js';

export default function QuizArena({ onReturnToHub, token, currentUser }) {
  const wsRef = useRef(null);
  
  // Matchmaking & Game States
  const [matchStatus, setMatchStatus] = useState('CONNECTING'); // 'CONNECTING' | 'WAITING' | 'PLAYING' | 'REVIEW' | 'GAME_OVER' | 'ERROR'
  const [errorMsg, setErrorMsg] = useState('');
  
  // Game telemetry
  const [gameId, setGameId] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scores, setScores] = useState({});
  const [userHp, setUserHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [streak, setStreak] = useState(0);
  const [gameOverData, setGameOverData] = useState(null);

  const myId = currentUser?.id;

  // Initialize WebSocket Connection & Matchmaking
  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setErrorMsg('No authentication token found. Please login first.');
      setMatchStatus('ERROR');
      return;
    }

    const wsUrl = `${WS_BASE_URL}?token=${encodeURIComponent(authToken)}`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log('⚡ Connected to 1v1 Battle WebSocket Server');
      setMatchStatus('WAITING');
      // Request matchmaking
      socket.send(JSON.stringify({ type: 'init_game' }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, payload } = message;

        switch (type) {
          case 'waiting_for_opponent':
            setMatchStatus('WAITING');
            break;

          case 'game_started':
            setGameId(payload.gameId);
            setOpponent(payload.opponent);
            setTotalQuestions(payload.totalQuestions || 5);
            setUserHp(100);
            setOpponentHp(100);
            setScores({});
            setStreak(0);
            setMatchStatus('PLAYING');
            break;

          case 'question':
            // Renders the live question sent by the WebSocket backend
            setCurrentQuestion(payload.question);
            setQuestionIndex(payload.questionIndex || 1);
            setTotalQuestions(payload.totalQuestions || 5);
            setSelectedOption(null);
            setIsAnswered(false);
            setRoundResult(null);
            setTimeLeft(payload.timeLimit || 15);
            setMatchStatus('PLAYING');
            break;

          case 'answer_accepted':
            setSelectedOption(payload.selectedOption);
            setIsAnswered(true);
            break;

          case 'question_result':
            setRoundResult(payload);
            setMatchStatus('REVIEW');

            // Update HP and streak based on NEET answer result
            const isUserP1 = payload.player1.id === myId;
            const myResult = isUserP1 ? payload.player1 : payload.player2;
            const oppResult = isUserP1 ? payload.player2 : payload.player1;

            if (myResult?.isCorrect) {
              setStreak((prev) => prev + 1);
              setOpponentHp((prev) => Math.max(0, prev - 25));
            } else {
              setStreak(0);
              setUserHp((prev) => Math.max(0, prev - 20));
            }

            if (oppResult?.isCorrect) {
              setUserHp((prev) => Math.max(0, prev - 25));
            }
            break;

          case 'score_update':
            setScores(payload.scores || {});
            break;

          case 'game_over':
            setGameOverData(payload);
            setMatchStatus('GAME_OVER');
            break;

          case 'opponent_disconnected':
            setGameOverData({
              winnerId: myId,
              isDraw: false,
              message: payload.message || 'Opponent disconnected. You win by default!'
            });
            setMatchStatus('GAME_OVER');
            break;

          case 'error':
            setErrorMsg(payload?.message || 'WebSocket Error occurred');
            break;
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setErrorMsg('Failed to connect to battle server at ws://localhost:8080');
    };

    socket.onclose = (e) => {
      console.log('WebSocket connection closed', e);
      if (e.code === 4001) {
        setErrorMsg('Authentication expired or unauthorized. Please re-login.');
      }
    };

    return () => {
      socket.close();
    };
  }, [token]);

  // Round Timer Countdown Effect
  useEffect(() => {
    if (matchStatus !== 'PLAYING' || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matchStatus, currentQuestion]);

  // Submit Answer to WebSocket Backend
  const handleSelectOption = (optionIndex) => {
    if (isAnswered || matchStatus !== 'PLAYING' || !currentQuestion) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'submit_answer',
          payload: {
            questionId: currentQuestion.id,
            selectedOption: optionIndex,
          },
        })
      );
    }
  };

  // 1. Error Screen
  if (matchStatus === 'ERROR' || errorMsg) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 flex flex-col items-center justify-center p-6 font-mono">
        <div className="p-8 max-w-md w-full bg-white dark:bg-zinc-950 border border-red-500/40 rounded-2xl shadow-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold font-sans text-red-500 uppercase">CONNECTION ERROR</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">{errorMsg}</p>
          <button
            onClick={onReturnToHub}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer"
          >
            RETURN TO HUB
          </button>
        </div>
      </div>
    );
  }

  // 2. Matchmaking Radar Screen
  if (matchStatus === 'CONNECTING' || matchStatus === 'WAITING') {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 flex flex-col items-center justify-center p-6 font-mono">
        <div className="relative flex flex-col items-center space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-slate-300 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin"></div>
            <Swords className="w-12 h-12 text-emerald-600 dark:text-emerald-400 absolute animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              SEARCHING FOR OPPONENT...
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-600 font-mono">
              SKILL-BASED 1v1 NEET MATCHMAKING • NEET BATTLE ARENA
            </p>
          </div>

          <div className="px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500/40 text-xs text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>WAITING FOR ASPIRANT IN QUEUE...</span>
          </div>

          <button
            onClick={onReturnToHub}
            className="mt-6 px-6 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900/60 text-slate-600 dark:text-emerald-600 hover:text-slate-900 dark:hover:text-emerald-400 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Cancel Matchmaking
          </button>
        </div>
      </div>
    );
  }

  // 3. Match Complete / Game Over Screen
  if (matchStatus === 'GAME_OVER') {
    const isWinner = gameOverData?.winnerId === myId;
    const isDraw = gameOverData?.isDraw;
    const userFinalScore = (scores && myId && scores[myId]) !== undefined ? scores[myId] : 0;
    const oppFinalScore = (scores && opponent?.id && scores[opponent.id]) !== undefined ? scores[opponent.id] : 0;

    return (
      <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 flex flex-col items-center justify-center p-6 font-mono">
        <div className="p-8 max-w-lg w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900/80 rounded-2xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <Trophy className={`w-20 h-20 mx-auto ${isWinner ? 'text-yellow-400 animate-bounce' : 'text-slate-400'}`} />
          
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase">
              {isWinner ? '🎉 VICTORY!' : isDraw ? '🤝 DRAW' : '💔 DEFEAT'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-600">
              {isWinner
                ? 'Excellent performance! NEET rating points awarded (+4 scoring).'
                : isDraw
                ? 'Intense duel! Both aspirants scored equally.'
                : 'Good effort! Review incorrect answers to master the concepts.'}
            </p>
          </div>

          {/* Final Scoreboard */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-emerald-950 font-mono">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">You</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{userFinalScore} pts</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{opponent?.name || 'Opponent'}</span>
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{oppFinalScore} pts</p>
            </div>
          </div>

          <button
            onClick={onReturnToHub}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider text-xs shadow-lg"
          >
            RETURN TO HUB
          </button>
        </div>
      </div>
    );
  }

  // 4. Live 1v1 Battle Arena Screen
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 overflow-x-hidden p-4 sm:p-6 md:p-8 font-mono transition-colors duration-300">
      
      {/* ARENA TOP BAR */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-950">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-sans tracking-wider text-slate-900 dark:text-emerald-400 flex items-center gap-2">
            Quiz Arena 
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-black border border-emerald-300 dark:border-emerald-800">
              1v1 LIVE MATCH
            </span>
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900 shadow-sm dark:shadow-none font-mono">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className={`text-xl font-black ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
          </span>
        </div>
      </header>

      {/* BATTLE GRID */}
      <main className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: QUESTION & OPTIONS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Question Tag Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-sm dark:shadow-none font-mono transition-colors">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                {currentQuestion?.subject || 'NEET'}
              </span>
              <span className="text-sm font-bold text-slate-600 dark:text-emerald-300">
                {currentQuestion?.topic || 'Standard Curriculum'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-black">
              <Flame className="w-4 h-4 fill-current text-orange-400" />
              <span>{currentQuestion?.difficulty || 'MEDIUM'}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-4 transition-colors">
            <p className="text-xs font-mono text-slate-500 dark:text-emerald-600 uppercase tracking-widest">
              QUESTION {questionIndex} OF {totalQuestions}
            </p>
            <p className="text-base sm:text-xl font-black font-sans leading-relaxed text-slate-900 dark:text-slate-200">
              {currentQuestion?.questionText || 'Loading question...'}
            </p>
          </div>

          {/* 4 Options Grid (0: A, 1: B, 2: C, 3: D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion?.options?.map((optText, index) => {
              const optLabel = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedOption === index;
              const isCorrectAnswer = roundResult?.correctAnswer === index;
              const isWrongSelection = roundResult && isSelected && !isCorrectAnswer;

              let btnStyle = "bg-white dark:bg-black border-slate-200 dark:border-emerald-900/60 text-slate-900 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-500";
              
              if (isSelected && !roundResult) {
                btnStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 dark:border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold shadow-md";
              }

              if (roundResult) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold shadow-lg ring-2 ring-emerald-500";
                } else if (isWrongSelection) {
                  btnStyle = "bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-300 font-bold";
                } else {
                  btnStyle = "bg-white dark:bg-black border-slate-100 dark:border-zinc-900 text-slate-400 dark:text-zinc-600 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={isAnswered || matchStatus === 'REVIEW'}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer font-mono shadow-sm dark:shadow-none ${btnStyle}`}
                >
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-900 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-emerald-400">
                    {optLabel}
                  </span>
                  <span className="text-sm font-medium pt-0.5 leading-snug">
                    {optText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Round Review & NEET Scoring Feedback */}
          {matchStatus === 'REVIEW' && roundResult && (
            <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-500/40 shadow-lg dark:shadow-none space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                <div className="flex items-center gap-2">
                  {selectedOption === roundResult.correctAnswer ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" /> CORRECT! (+4 POINTS)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase">
                      <XCircle className="w-4 h-4" /> {selectedOption === null ? 'TIMED OUT (0 POINTS)' : 'INCORRECT (-1 POINT)'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-emerald-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  NEXT QUESTION INCOMING...
                </div>
              </div>

              {roundResult.explanation && (
                <p className="text-xs text-slate-600 dark:text-emerald-400 leading-relaxed font-mono">
                  <strong className="text-slate-900 dark:text-emerald-300">Explanation:</strong> {roundResult.explanation}
                </p>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DUEL STATUS & LIVE SCORES */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-emerald-900/60 shadow-lg dark:shadow-none space-y-6 transition-colors">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-emerald-400 tracking-widest uppercase pb-3 border-b border-slate-200 dark:border-emerald-950">
              1v1 LIVE DUEL
            </h3>

            {/* Health / Score Bars */}
            <div className="space-y-5 font-mono">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800 dark:text-slate-200">YOU ({currentUser?.name || 'Aspirant'})</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    {(scores && myId && scores[myId]) !== undefined ? scores[myId] : 0} PTS
                  </span>
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
                  <span className="text-slate-500 dark:text-slate-300">{opponent?.name || 'Opponent'}</span>
                  <span className="text-slate-600 dark:text-emerald-600 font-black">
                    {(scores && opponent?.id && scores[opponent.id]) !== undefined ? scores[opponent.id] : 0} PTS
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-emerald-900">
                  <div
                    className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                    style={{ width: `${opponentHp}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Streak Multiplier */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-emerald-900 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-500 dark:text-orange-400 font-bold">CURRENT STREAK</span>
              <span className="text-lg font-black text-slate-900 dark:text-emerald-400">x{streak} 🔥</span>
            </div>

            {/* NEET Rule Badge */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3 font-mono">
              <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400 shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-slate-200 leading-tight">
                NEET Marking: <strong>+4</strong> for Correct, <strong>-1</strong> for Wrong, <strong>0</strong> for Timeout.
              </p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}