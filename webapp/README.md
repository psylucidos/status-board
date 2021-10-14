## Status-Board webapp & api
A simple webapp and api that recieves project data and displays it neatly on a webapp.
### API
#### Example Usage
```javascript
axios
  .post(`http://example.com:3000/api/update/testProject`, {
    nOfRequests: 4,
    nOfErrors: 0,
    nOfLogins: 1,
    nOfAccounts: 1,
    status: 'Online',
    logs: 'Listening on port 8080',
    errorLogs: '',
    interval: 60,
    cpuUsage: 21,
    memoryUsage: 6,
    responseTimes: [23, 54, 24, 12],
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
```
#### POST /api/update/:project
*Post Body*: `{
  nOfRequests: Number,
  nOfErrors: Number,
  nOfLogins: Number,
  nOfAccounts: Number,
  status: String,
  logs: String,
  errorLogs: String,
  interval: Number,
  cpuUsage: Number,
  memoryUsage: Number,
  responseTimes: Number[],
}`

Route records project status and info. If there is no update after the set project interval, the project status will be set to offline.
#### GET /api/projects
*Response Body*: `{
  exampleProject: {
    nOfRequests: Number,
    nOfErrors: Number,
    nOfLogins: Number,
    nOfAccounts: Number,
    status: String,
    logs: String,
    errorLogs: String,
    interval: Number,
    cpuUsage: Number,
    memoryUsage: Number,
    responseTimes: Number[],
  },
  ...
}`

Route returns all projects and their statuses/info.
