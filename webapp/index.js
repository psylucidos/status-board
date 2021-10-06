const Koa = require('koa');
const serve = require('koa-static');
const bouncer = require('koa-bouncer');
const path = require('path');

const app = new Koa();
const api = require('./api');

app.use(serve(path.join(__dirname, '/public/')));
app
  .use(bouncer.middleware())
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3000);

console.log('listening on port 3000'); // eslint-disable-line
