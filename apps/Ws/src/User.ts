import { WebSocket } from "ws";
import { AuthUser } from "./auth.js";

export class User {
  public socket: WebSocket;
  public id: string;
  public username: string;
  public email: string;
  public name: string;
  public points: number;
  public avatar?: string | null;

  constructor(socket: WebSocket, authUser: AuthUser) {
    this.socket = socket;
    this.id = authUser.id;
    this.username = authUser.username;
    this.email = authUser.email;
    this.name = authUser.name;
    this.points = authUser.points;
    this.avatar = authUser.avatar;
  }

  public send(payload: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }
}
