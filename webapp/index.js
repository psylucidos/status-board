const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();
const api = require('./api');

app.use(serve(path.join(__dirname, '/public/')));
app
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3000);

console.log('listening on port 3000');
