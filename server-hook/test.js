const hook = require('./index');

hook.setStatus('Online');

hook.init({ // initialise hook
  target: 'http://localhost:3000/api',
  projectName: 'test',
  interval: 60,
});

hook.log('inshallah');

hook.logErr(new Error("dog"));
