import { Router } from 'express';

import appointmentsRouter from './room.routes';

const routes = Router();

routes.use('/rooms', appointmentsRouter);

export default routes;
