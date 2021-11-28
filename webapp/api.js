const Router = require('koa-joi-router');

const router = new Router();
const { Joi } = Router;

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
      interval: Joi.number(),
      cpuUsage: Joi.number(),
      memoryUsage: Joi.number(),
      responseTimes: Joi.array().items(Joi.number()),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    projects[projectName] = ctx.request.body;
    projects[projectName].lastUpdate = new Date().getTime();
    ctx.status = 200;
  },
});

setInterval(() => {
  const projectNames = Object.keys(projects);
  for (let i = 0; i < projectNames.length; i += 1) {
    const project = projectNames[i];
    if (projects[project].status === 'Online') {
      const target = projects[project];
      const minUpdateTime = (new Date().getTime() - (target.interval * 1000));
      if (target.lastUpdate < minUpdateTime + process.env.MAXTIMEOUT) {
        projects[project].status = 'Offline';
      } else {
        projects[project].status = 'Online';
      }
    }
  }
}, process.env.CHECKTIMEOUTINTERVAL);

module.exports = router;
