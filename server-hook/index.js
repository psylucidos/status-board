const axios = require('axios');

const config = {
  target: '',
  projectName: '',
  interval: 60,
};

const info = {
  nOfRequests: 0,
  nOfErrors: 0,
  status: 'Online',
  nOfLogins: 0,
  nOfAccounts: 0,
  logs: '',
  errorLogs: '',
  interval: 60,
  responseTimes: [],
};

async function request(responseTime) {
  info.nOfRequests += 1;
  info.responseTimes.push(responseTime);
}

async function setStatus(status) {
  info.status = String(status);
}

async function login() {
  info.nOfLogins += 1;
}

async function setAccounts(nOfAccounts) {
  if (!Number.isNaN(nOfAccounts)) {
    throw new Error('Number of accounts provided is not a number!');
  }
  info.nOfAccounts = nOfAccounts;
}

async function log(msg) {
  info.logs += msg;
  console.log(msg); // eslint-disable-line
}

async function logErr(err) {
  info.nOfErrors += 1;
  info.errorLogs += `${err.stack}'\n`;
  console.error(err); // eslint-disable-line
}

async function init(newConfig) {
  config.target = newConfig.target;
  config.projectName = newConfig.projectName;
  config.interval = newConfig.interval;

  if (!config.target) {
    Promise.reject(new Error('No target server specified!'));
  } else if (!config.target.includes('http://')) {
    Promise.reject(new Error('Target server not http, please use \'http://\' prefix!'));
  } else if (config.target[config.target.length - 1] === '/') {
    Promise.reject(new Error('Target server cannot end with \'/\'!'));
  } else if (!config.projectName) {
    Promise.reject(new Error('No project name provided!'));
  } else if (!config.interval) {
    Promise.reject(new Error('No refresh interval provided!'));
  }

  let prevCPUUsage = { user: 0, system: 0 };

  try {
    let cpuUsage = process.cpuUsage(prevCPUUsage);
    prevCPUUsage = cpuUsage;

    info.cpuUsage = cpuUsage.user / 100000;
    info.memoryUsage = process.memoryUsage().heapUsed / 1000 / 1000;

    const response = await axios.post(`${config.target}/update/${config.projectName}`, info);

    if (response.status !== 200) {
      Promise.reject(new Error(`Invalid target response of code ${response.status}`));
    }
  } catch (err) {
    Promise.reject(new Error(`Error connecting to target: ${err}`));
  }

  setInterval(() => {
    info.cpuUsage = prevCPUUsage.user / 100000;
    info.memoryUsage = process.memoryUsage().heapUsed / 1000 / 1000;
    axios
      .post(`${config.target}/update/${config.projectName}`, info)
      .catch((err) => {
        console.error(err);
      });

    info.nOfRequests = 0;
    info.responseTimes = [];
    let cpuUsage = process.cpuUsage(prevCPUUsage);
    prevCPUUsage = cpuUsage;
  }, config.interval * 1000);
  Promise.resolve();
}

module.exports = {
  init,
  request,
  setStatus,
  login,
  setAccounts,
  log,
  logErr,
};
