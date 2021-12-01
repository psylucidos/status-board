const Router = require('koa-joi-router');

const router = new Router();
const { Joi } = Router;

function pretifyNum(n) {
  return `${n < 10 ? '0' : ''}${n}`;
}

function pretifyTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${pretifyNum(h)}:${pretifyNum(m)}:${pretifyNum(s)}`;
}
function pretifyDate(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${pretifyNum(d)}/${pretifyNum(m)}`;
}

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
      nOfLogins: Joi.number(),
      nOfAccounts: Joi.number(),
      status: Joi.string().allow(null, ''),
      interval: Joi.number(),
      cpuUsage: Joi.number(),
      memoryUsage: Joi.number(),
      responseTimes: Joi.array().items(Joi.number()),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    if (projects[projectName] === undefined) {
      projects[projectName] = {};
    } if (projects[projectName].logs === undefined) {
      projects[projectName].logs = '';
    } if (projects[projectName].errorLogs === undefined) {
      projects[projectName].errorLogs = '';
    } if (projects[projectName].nOfErrors === undefined) {
      projects[projectName].nOfErrors = 0;
    }

    projects[projectName].nOfRequests = ctx.request.body.nOfRequests;
    projects[projectName].nOfLogins = ctx.request.body.nOfLogins;
    projects[projectName].nOfAccounts = ctx.request.body.nOfAccounts;
    projects[projectName].status = ctx.request.body.status;
    projects[projectName].interval = ctx.request.body.interval;
    projects[projectName].cpuUsage = ctx.request.body.cpuUsage;
    projects[projectName].memoryUsage = ctx.request.body.memoryUsage;
    projects[projectName].responseTimes = ctx.request.body.responseTimes;
    projects[projectName].lastUpdate = new Date().getTime();

    ctx.status = 200;
  },
});

router.route({
  method: 'post',
  path: '/add/:project/log',
  validate: {
    type: 'json',
    body: {
      log: Joi.string(),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    const { log } = ctx.request.body;
    const time = new Date();
    projects[projectName].logs += `${pretifyDate(time)} ${pretifyTime(time)} : ${log}\n`;
    ctx.status = 200;
  },
});

router.route({
  method: 'post',
  path: '/add/:project/error',
  validate: {
    type: 'json',
    body: {
      error: Joi.string(),
    },
  },
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    const { error } = ctx.request.body;
    const time = new Date();
    projects[projectName].errorLogs += `${pretifyDate(time)} ${pretifyTime(time)} : ${error}\n`;
    projects[projectName].nOfErrors += 1;
    ctx.status = 200;
  },
});

router.route({
  method: 'post',
  path: '/clear/:project/logs',
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    projects[projectName].logs = '';
    ctx.status = 200;
  },
});

router.route({
  method: 'post',
  path: '/clear/:project/errors',
  handler: async (ctx) => {
    const projectName = ctx.params.project;
    projects[projectName].errorLogs = '';
    projects[projectName].nOfErrors = 0;
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
      if (target.lastUpdate < minUpdateTime - process.env.MAXTIMEOUT) {
        projects[project].status = 'Offline';
      }
    }
  }
}, process.env.CHECKTIMEOUTINTERVAL);

module.exports = router;
