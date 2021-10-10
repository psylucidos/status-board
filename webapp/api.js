const Router = require('koa-joi-router');

const router = new Router();
const { Joi } = Router;

router.prefix('/api');

const MAXTIMOUT = 10 * 1000;
const TIMEOUTCHECKINTERVAL = 60 * 1000;
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
      interval: Joi.number(),
      cpuUsage: Joi.number(),
      memoryUsage: Joi.number(),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    console.log(ctx.request.body);
    projects[projectName] = ctx.request.body;
    projects[projectName].lastUpdate = new Date().getTime();
    ctx.status = 200;
  },
});

setInterval(() => {
  for (let project in projects) {
    if (projects.hasOwnProperty(project) &&
        projects[project].status === 'Online') {
      const target = projects[project];
      const minUpdateTime = (new Date().getTime() - (target.interval * 1000));
      if (target.lastUpdate < minUpdateTime + MAXTIMOUT) {
        projects[project].status = 'Offline';
      }
    }
  }
}, TIMEOUTCHECKINTERVAL);

module.exports = router;
