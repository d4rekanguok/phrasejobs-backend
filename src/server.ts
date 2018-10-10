import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';

const app = new Koa();

app.use(helmet());
app.use(cors());
app.use(logger());
app.use(bodyParser());

// error handling
app.use(async (ctx, next) => {
  try { await next(); }
  catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
})

app.on('error', (err, ctx) => {
  // todo: use winston
  console.error(ctx.request.href, err);
})

import router from './routes';

const port = process.env.PORT || 3000;
app.use(router.routes());
app.listen(port);

console.log(`Server running on port ${port}`);