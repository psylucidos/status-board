## Status-Board webapp & api
A simple webapp and api that recieves project data and displays it neatly on a webapp.
### API
#### POST /api/update/:project
*post body*: `{
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
*Response body*: `{
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
