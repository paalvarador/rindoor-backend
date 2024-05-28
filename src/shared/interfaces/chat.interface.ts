export interface IUser {
  userId: string;
  userName: string;
  socketId: string;
}

export interface IRoom {
  name: string;
  host: IUser;
  users: IUser[];
}

export interface IMessage {
  user: IUser;
  timeSent: string;
  message: string;
  roomName: string;
}

export interface IServerToClientEvents {
  chat: (e: IMessage) => void;
}

export interface IClientToServerEvents {
  chat: (e: IMessage) => void;
  join_room: (e: { user: IUser; roomName: string }) => void;
}
