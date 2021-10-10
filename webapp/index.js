const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();
const api = require('./api');

app
  .use(serve(path.join(__dirname, '/public/')))
  .use(api.middleware());

app.listen(3000);

console.log('listening on port 3000'); // eslint-disable-line
