## Server-hook
A simple script that posts project data to an API.
### Example Usage
```javascript
// setup server and import hook
const Koa = require('koa');
const hook = require('server-hook');

const app = new Koa();
const api = require('./api');
hook.init({ // initialise hook
  target: 'http://example.com:3000/api',
  projectName: 'test',
  interval: 60,
})

app.on('error', err => {
  hook.errLog(err);
});

app
  .use(async (ctx, next) => {
    // create simple response time recorder
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    hook.request(ms); // update hook
  })
  .use(api.middleware());

app.listen(8080);
hook.setStatus('Online');
hook.log('Listening on 8080');
```
### Functions
#### .init(config)
*config*: `{
  target: 'http://exampleapi.com/api',
  projectName: 'testProject',
  interval: '60' // in seconds
}`

Function establishes a connection with the webapp api and updates api at a set interval.
#### .request(responseTime)
*responseTime*: `Number // in seconds`

Records incidence of server request along with reponse time.
#### .setStatus(status)
*status*: `String // either 'Online'/'Offline' or other`

Records project production status.
#### .login()
Records user or API key login.
#### .setAccounts(accounts)
*accounts*: `Number`

Records number of user accounts.
#### .log(msg)
*msg*: `String`

Records logged message and displays through console.log.
#### .errLog(err)
*err*: `Error`

Records logged error message and displays through console.error.
