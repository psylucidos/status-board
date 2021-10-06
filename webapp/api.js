const Router = require('@koa/router');

const router = new Router();

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

router.post('/update/:project', async (ctx) => {
  // validate post data

  ctx.validateBody('nOfRequests')
    .required('Number of requests required')
    .isNumber();

  ctx.validateBody('nOfErrors')
    .required('Number of errors required')
    .isNumber();

  ctx.validateBody('nOfLogins')
    .required('Number of logins required')
    .isNumber();

  ctx.validateBody('nOfAccounts')
    .required('Number of accounts required')
    .isNumber();

  ctx.validateBody('status')
    .required('Project status required')
    .isString();

  ctx.validateBody('logs')
    .required('Project logs required')
    .isString();

  ctx.validateBody('errorLogs')
    .required('Project error logs required')
    .isString();

  const projectName = ctx.params.project;

  projects[projectName] = ctx.vals;

  ctx.status = 200;
});

module.exports = router;
