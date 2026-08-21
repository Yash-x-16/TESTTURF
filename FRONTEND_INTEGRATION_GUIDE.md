# 🎮 Frontend Integration Guide (TESTTURF 1v1 MCQ Battle)

This guide walks you through connecting your frontend (React / Next.js / Vite) with the TESTTURF backend.

---

## 💡 Quick Overview: WebSocket vs HTTP for Questions

| Feature | WebSocket (Real-Time 1v1 Battle) | HTTP (Practice / Profile) |
| :--- | :--- | :--- |
| **Where questions come from** | **WebSocket (`question` event)** | **HTTP (`/api/v1/questions/random`)** |
| **Why?** | Pushed simultaneously to both players at the start of each 15s round. Prevents cheating / answer inspection. | For solo offline practice and past match review. |
| **Scoring** | **NEET Exam Rules**: `+4` (Correct), `-1` (Wrong), `0` (Timeout) | N/A |

---

## 📋 1. Question JSON Schema

Questions sent to the frontend during 1v1 battles contain the question text, subject, difficulty, and an array of 4 options (the `correctAnswer` is kept on the server to prevent cheating):

```json
{
  "id": "q1",
  "questionText": "Which organelle is known as the 'Powerhouse of the Cell'?",
  "options": [
    "Ribosome",
    "Mitochondria",
    "Endoplasmic Reticulum",
    "Golgi apparatus"
  ],
  "subject": "Biology",
  "topic": "Cell Biology",
  "difficulty": "EASY"
}
```

---

## ⚡ 2. WebSocket Protocol (Code100x Style)

Connect to the WebSocket server with the JWT token in the URL:
```js
const token = localStorage.getItem("token");
const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
```

### Messages Flow

```text
[Frontend]                     [WebSocket Backend]
    |                                   |
    |---- { type: "init_game" } ------->| (User clicks "Start Match")
    |<--- { type: "waiting..." } -------| (If waiting for opponent)
    |                                   |
    |<--- { type: "game_started" } -----| (Opponent found!)
    |                                   |
    |<--- { type: "question" } ---------| (Question 1 pushed with 4 options)
    |                                   |
    |---- { type: "submit_answer" } --->| (User clicks option index 0, 1, 2, or 3)
    |<--- { type: "answer_accepted" }---| (Ack: +4 or -1 score)
    |                                   |
    |<--- { type: "question_result" } --| (Review: correct answer + explanation)
    |<--- { type: "score_update" } -----| (Live scores updated)
    |                                   |
    |          ... Rounds Repeat ...    |
    |                                   |
    |<--- { type: "game_over" } --------| (Final scores + winner announcement)
```

---

## 💻 3. Simple React Hook (`useBattle.ts`)

```tsx
import { useEffect, useRef, useState, useCallback } from "react";

export function useBattle(token: string | null) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"IDLE" | "WAITING" | "PLAYING" | "REVIEW" | "GAME_OVER">("IDLE");
  
  const [opponent, setOpponent] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<any>(null);
  const [scores, setScores] = useState<{ [userId: string]: number }>({});
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);

      switch (type) {
        case "waiting_for_opponent":
          setStatus("WAITING");
          break;

        case "game_started":
          setOpponent(payload.opponent);
          setStatus("PLAYING");
          break;

        case "question":
          setCurrentQuestion(payload);
          setSelectedOption(null);
          setRoundResult(null);
          setStatus("PLAYING");
          break;

        case "answer_accepted":
          setSelectedOption(payload.selectedOption);
          break;

        case "question_result":
          setRoundResult(payload);
          setStatus("REVIEW");
          break;

        case "score_update":
          setScores(payload.scores);
          break;

        case "game_over":
          setGameOver(payload);
          setStatus("GAME_OVER");
          break;

        case "leaderboard_update":
          setLeaderboard(payload.leaderboard);
          break;
      }
    };

    return () => ws.close();
  }, [token]);

  const startMatch = useCallback(() => {
    socketRef.current?.send(JSON.stringify({ type: "init_game" }));
  }, []);

  const submitAnswer = useCallback((questionId: string, optionIndex: number) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "submit_answer",
        payload: { questionId, selectedOption: optionIndex },
      })
    );
  }, []);

  return {
    status,
    opponent,
    currentQuestion,
    selectedOption,
    roundResult,
    scores,
    leaderboard,
    gameOver,
    startMatch,
    submitAnswer,
  };
}
```

---

## 🎨 4. Simple MCQ Battle Screen Component (`Arena.tsx`)

```tsx
import React, { useState, useEffect } from "react";
import { useBattle } from "./useBattle";

export function Arena({ token, currentUserId }: { token: string; currentUserId: string }) {
  const {
    status,
    opponent,
    currentQuestion,
    selectedOption,
    roundResult,
    scores,
    leaderboard,
    gameOver,
    startMatch,
    submitAnswer,
  } = useBattle(token);

  const [timer, setTimer] = useState(15);

  // 15-second countdown timer
  useEffect(() => {
    if (status === "PLAYING") {
      setTimer(15);
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, status]);

  if (status === "IDLE") {
    return (
      <div className="lobby">
        <h1>NEET 1v1 Battle Arena</h1>
        <button onClick={startMatch} className="start-btn">
          ⚔️ Start 1v1 Match
        </button>

        <h3>🏆 Leaderboard</h3>
        <ul>
          {leaderboard.map((u) => (
            <li key={u.id}>#{u.rank} {u.name} - {u.points} pts</li>
          ))}
        </ul>
      </div>
    );
  }

  if (status === "WAITING") {
    return (
      <div className="waiting">
        <h2>🔍 Searching for an opponent...</h2>
        <p>Please wait while we match you with a player.</p>
      </div>
    );
  }

  if (status === "GAME_OVER") {
    const isWinner = gameOver.winnerId === currentUserId;
    return (
      <div className="game-over">
        <h2>{isWinner ? "🎉 YOU WON!" : gameOver.isDraw ? "🤝 DRAW!" : "💔 DEFEAT"}</h2>
        <p>Final Score: {scores[currentUserId] || 0}</p>
        <button onClick={startMatch}>Play Again</button>
      </div>
    );
  }

  const q = currentQuestion?.question;

  return (
    <div className="arena">
      {/* Header with Opponent and Timer */}
      <div className="battle-header">
        <div className="player you">
          <span>You</span>
          <strong>{scores[currentUserId] || 0} pts</strong>
        </div>
        <div className="timer-badge">⏳ {timer}s</div>
        <div className="player opponent">
          <span>{opponent?.name}</span>
          <strong>{scores[opponent?.id] || 0} pts</strong>
        </div>
      </div>

      {/* Question Card */}
      {q && (
        <div className="question-card">
          <span className="subject-tag">{q.subject} • {q.difficulty}</span>
          <p className="question-text">{q.questionText}</p>

          {/* 4 Options */}
          <div className="options-grid">
            {q.options.map((optionText: string, index: number) => {
              const isSelected = selectedOption === index;
              const isCorrect = roundResult?.correctAnswer === index;
              const isWrong = roundResult && isSelected && !isCorrect;

              let btnClass = "option-btn";
              if (isSelected) btnClass += " selected";
              if (roundResult) {
                if (isCorrect) btnClass += " correct"; // Green
                if (isWrong) btnClass += " wrong";     // Red
              }

              return (
                <button
                  key={index}
                  className={btnClass}
                  disabled={selectedOption !== null || status === "REVIEW"}
                  onClick={() => submitAnswer(q.id, index)}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {optionText}
                </button>
              );
            })}
          </div>

          {/* Review Explanation */}
          {status === "REVIEW" && roundResult && (
            <div className="explanation-box">
              <h4>💡 Explanation:</h4>
              <p>{roundResult.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 5. Testing with the Backend

1. Start the backend:
   ```bash
   pnpm dev
   ```
   - HTTP API: `http://localhost:3001`
   - WebSocket: `ws://localhost:8080`
2. Open two browser windows / tabs, log in with two different accounts, and click **"Start 1v1 Match"** on both to test the real-time battle!
