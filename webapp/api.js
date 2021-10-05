
const Router = require('@koa/router');
const router = new Router();

router.prefix('/api');

router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'hello world';
})

module.exports = router;
