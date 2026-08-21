import { WebSocketServer } from "ws";
import { WS_PORT } from "./config.js";
import { GameManager } from "./GameManager.js";
import { extractAuthUser } from "./auth.js";
import { User } from "./User.js";

const wss = new WebSocketServer({ port: WS_PORT });
const gameManager = new GameManager();

console.log(`⚡ WebSocket 1v1 MCQ Battle Backend running on ws://localhost:${WS_PORT}`);

wss.on("connection", async function connection(ws, req) {
  // 1. Authenticate user from URL query param: ws://localhost:8080?token=<JWT>
  const reqUrl = req.url || "/";
  const urlObj = new URL(reqUrl, `http://${req.headers.host || "localhost"}`);
  const token =
    urlObj.searchParams.get("token") ||
    (typeof req.headers["sec-websocket-protocol"] === "string"
      ? req.headers["sec-websocket-protocol"]
      : null) ||
    (req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null);

  if (!token) {
    console.warn("❌ WS Connection rejected: Missing token");
    ws.send(
      JSON.stringify({
        type: "error",
        payload: { message: "Unauthorized: Missing authentication token '?token=<jwt>'" },
      })
    );
    ws.close(4001, "Missing token");
    return;
  }

  const authUser = await extractAuthUser(token);
  if (!authUser) {
    console.warn("❌ WS Connection rejected: Invalid token");
    ws.send(
      JSON.stringify({
        type: "error",
        payload: { message: "Unauthorized: Invalid or expired token" },
      })
    );
    ws.close(4001, "Invalid token");
    return;
  }

  console.log(`✅ WS User Connected: ${authUser.username} (${authUser.id})`);

  const user = new User(ws, authUser);
  gameManager.addUser(user);

  ws.on("close", () => {
    console.log(`🔌 WS User Disconnected: ${authUser.username}`);
    gameManager.removeUser(ws);
  });

  ws.on("error", (err) => {
    console.error(`WS error for ${authUser.username}:`, err);
  });
});