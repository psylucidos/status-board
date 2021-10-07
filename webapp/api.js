const Router = require('koa-joi-router');
const router = new Router();
const Joi = Router.Joi;

router.prefix('/api');

const projects = {};

router.get('/', async (ctx) => {
  ctx.status = 200;
  ctx.body = 'hello world';
});

router.get('/projects', async (ctx) => {
  ctx.status = 200;
  ctx.body = projects;
});

router.route({
  method: 'post',
  path: '/update/:project',
  validate: {
    type: 'json',
    body: {
      nOfRequests: Joi.number(),
      nOfErrors: Joi.number(),
      nOfLogins: Joi.number(),
      nOfAccounts: Joi.number(),
      status: Joi.string().allow(null, ''),
      logs: Joi.string().allow(null, ''),
      errorLogs: Joi.string().allow(null, ''),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    console.log(ctx.request.body);
    projects[projectName] = ctx.request.body;
    ctx.status = 200;
  }
});

module.exports = router;
