import { Router, Response, Request } from 'express';

const roomsRouter = Router();

roomsRouter.get('/', (request: Request, response: Response) => {
  const { io } = request;

  io.emit('event_name', { ok: true });

  return response.json({ ok: true });
});

export default roomsRouter;
