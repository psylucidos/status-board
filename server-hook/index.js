const axios = require('axios');

var config = {
  target: '',
  interval: 60,
};

async function init(newConfig) {
  config = newConfig;

  if (!config.target) {
    throw "No target server specified!";
  } else if(!config.target.includes('http://')) {
    throw "Target server not http, please use 'http://' prefix!";
  } else if (!config.interval) {
    throw "No refresh interval provided!";
  }

  try {
    const response = await axios.get(`${config.target}/ping`);

    if (response.status !== 200) {
      throw `Invalid target response of code ${response.status}`;
    }
  } catch (err) {
    throw `Error connecting to target: ${err}`;
  }

  setInterval(function () {
    console.log('hello');
  }, config.interval * 1000);
}

module.exports = { init };
