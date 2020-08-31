import * as IoSocket from 'socket.io';

class RoomSocket {
  private io: IoSocket.Server;

  private socket: IoSocket.Socket;

  constructor(io: IoSocket.Server, socket: IoSocket.Socket) {
    this.io = io;
    this.socket = socket;
  }

  public events() {
    this.socket.on('message', (msg: string) => {
      this.io.emit('message', msg);
    });

    this.socket.on('other', () => {
      this.io.emit('Teste');
    });
  }
}

export default RoomSocket;
