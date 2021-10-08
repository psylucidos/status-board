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
};

async function request() {
  info.nOfRequests += 1;
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

async function setIncome(income) {
  if (!Number.isNaN(income)) {
    throw new Error('Income provided is not a number!');
  }
  info.income = income;
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

  try {
    const response = await axios.post(`${config.target}/update/${config.projectName}`, info);

    if (response.status !== 200) {
      Promise.reject(new Error(`Invalid target response of code ${response.status}`));
    }
  } catch (err) {
    Promise.reject(new Error(`Error connecting to target: ${err}`));
  }

  setInterval(() => {
    axios
      .post(`${config.target}/update/${config.projectName}`, info)
      .catch((err) => {
        console.error(err);
      });
  }, config.interval * 1000);
  Promise.resolve();
}

module.exports = {
  init,
  request,
  setStatus,
  login,
  setAccounts,
  setIncome,
  log,
  logErr,
};
