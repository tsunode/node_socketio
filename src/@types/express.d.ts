declare namespace Express {
  export interface Request {
    io: import('socket.io').Server;
    connetctedUsers: { [key: string]: string };
  }
}
