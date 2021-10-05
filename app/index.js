const serve = require('koa-static');
const path = require('path');
const Koa = require('koa');

const app = new Koa();

app.use(serve(path.join(__dirname, '/static/')));

app.listen(3000);

console.log('listening on port 3000');
