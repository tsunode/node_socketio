import 'express-async-errors';

import App from './app';

const app = new App();

app.server.listen(3333, () => {
  console.log('Server started on port 3333!');
});
