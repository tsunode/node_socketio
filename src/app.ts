import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import io from 'socket.io';
import { createServer, Server } from 'http';
import cors from 'cors';

import routes from './routes';
import AppError from './errors/AppError';
import RoomSocket from './socket/roomSocket';

class App {
  public app: express.Application;

  public server: Server;

  private socketIo: io.Server;

  private connectedUsers: { [key: string]: string };

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socketIo = io(this.server);

    this.socket();

    this.middlewares();
    this.routes();
    this.errors();

    this.connectedUsers = {};
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use((request: Request, response: Response, next: NextFunction) => {
      request.io = this.socketIo;
      request.connetctedUsers = this.connectedUsers;

      next();
    });
  }

  private routes(): void {
    this.app.use(routes);
  }

  private socket(): void {
    this.socketIo.on('connection', socket => {
      const { user_id } = socket.handshake.query;

      this.connectedUsers[user_id] = socket.id;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const roomSocket = new RoomSocket(this.socketIo, socket);

      roomSocket.events();

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
      });
    });
  }

  private errors(): void {
    this.app.use(
      (
        error: Error,
        request: Request,
        response: Response,
        _next: NextFunction,
      ) => {
        if (error instanceof AppError) {
          return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
          });
        }

        console.error(error);

        return response.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }
}

export default App;
