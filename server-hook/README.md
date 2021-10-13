## Server-hook
A simple script that posts project data to an API.
### Functions
#### .init(config)
**config**: `{
  target: 'http://exampleapi.com/api',
  projectName: 'testProject',
  interval: '60' // in seconds
}`
Function establishes a connection with the webapp api and updates api at a set interval.
#### .request(responseTime)
**responseTime**: `Number // in seconds`
Records incidence of server request along with reponse time.
#### .setStatus(status)
**status**: `String // either 'Online'/'Offline' or other`
Records project production status.
#### .login()
Records user or API key login.
#### .setAccounts(accounts)
**accounts**: `Number`
Records number of user accounts.
#### .log(msg)
**msg**: `String`
Records logged message and displays through console.log.
#### .errLog(err)
**err**: `Error`
Records logged error message and displays through console.error.
