const axios = require('axios');

// hook config defined by .init()
const config = {
  target: '',
  projectName: '',
  interval: 60,
};

// project info posted by server-hook
const info = {
  nOfRequests: 0,
  status: 'Offline',
  nOfLogins: 0,
  nOfAccounts: 0,
  interval: 60,
  responseTimes: [],
};

/* Function used when server receives request */
async function request(responseTime) {
  info.nOfRequests += 1;
  info.responseTimes.push(responseTime);
}

/* Function used to set project status (offline/online) */
async function setStatus(status) {
  info.status = String(status);
}

/* Function used for when a user or api key logs into the webapp */
async function login() {
  info.nOfLogins += 1;
}

/* Function used to set the amount of user accounts on the server */
async function setAccounts(nOfAccounts) {
  if (!Number.isNaN(nOfAccounts)) {
    throw new Error('Number of accounts provided is not a number!');
  }
  info.nOfAccounts = nOfAccounts;
}

/* Function used for logging console output */
async function log(msg) {
  axios
    .post(`${config.target}/add/${config.projectName}/log`, {
      log: msg,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    .catch((err) => {
      console.error(err); // eslint-disable-line
    });
  console.log(msg); // eslint-disable-line
}

/* Function used for logging console error output */
async function logErr(err) {
  axios
    .post(`${config.target}/add/${config.projectName}/error`, {
      error: err.stack,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    .catch((postErr) => {
      console.error(postErr); // eslint-disable-line
    });
  console.error(err); // eslint-disable-line
}

/* Initialisation function for establishing connection with webapp server */
async function init(newConfig) {
  // specify project config
  config.target = newConfig.target;
  config.projectName = newConfig.projectName;
  config.interval = newConfig.interval;

  // handle misconfigurations
  if (!config.target) {
    Promise.reject(new Error('No target server specified!'));
  } else if (!config.target.includes('https://')) {
    Promise.reject(new Error('Specified target server not https, please use \'https://\' prefix!'));
  } else if (config.target[config.target.length - 1] === '/') {
    Promise.reject(new Error('Target server cannot end with \'/\'!'));
  } else if (!config.projectName) {
    Promise.reject(new Error('No project name provided!'));
  } else if (!config.interval) {
    Promise.reject(new Error('No refresh interval provided!'));
  }

  let cpuUsage = process.cpuUsage();

  try {
    info.cpuUsage = cpuUsage.user / 1000 / 1000;
    info.memoryUsage = process.memoryUsage().heapUsed / 1000 / 1000;

    // post project info to webapp api
    const response = await axios.post(`${config.target}/update/${config.projectName}`, info);

    if (response.status !== 200) {
      Promise.reject(new Error(`Invalid target response of code ${response.status}`));
    }
  } catch (err) {
    Promise.reject(new Error(`Error connecting to target: ${err}`));
  }

  // on interval defined by config update webapp api with project info
  setInterval(() => {
    cpuUsage = process.cpuUsage(cpuUsage);
    info.cpuUsage = cpuUsage.user / 1000 / 1000;
    info.memoryUsage = process.memoryUsage().heapUsed / 1000 / 1000;
    axios
      .post(`${config.target}/update/${config.projectName}`, info, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .catch((err) => {
        console.error(err); // eslint-disable-line
      });

    info.nOfRequests = 0;
    info.responseTimes = [];
  }, config.interval * 1000);
  Promise.resolve();
}

// export functions for modular use
module.exports = {
  init,
  request,
  setStatus,
  login,
  setAccounts,
  log,
  logErr,
};
