require('dotenv').config();

const Koa = require('koa');
const serve = require('koa-static');
const cors = require('@koa/cors');
const path = require('path');

const app = new Koa();
const api = require('./api');

app.on('error', (err) => {
  console.error(err);
});

app.use(async (ctx, next) => {
  console.log(ctx.path);
  await next();
})

app
  .use(cors({
    origin: '*',
  }))
  .use(serve(path.join(__dirname, '/public/')))
  .use(api.middleware());

app.listen(process.env.PORT);

console.log(`listening on port ${process.env.PORT}`); // eslint-disable-line
