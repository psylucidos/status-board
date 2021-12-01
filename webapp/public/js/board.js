/* global $, Chart, env */

const data = {
  labels: [],
  datasets: [{
    label: 'CPU',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 255)',
    tension: 0.3,
  }, {
    label: 'RAM',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 225)',
    tension: 0.3,
  }, {
    label: 'Requests',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 195)',
    tension: 0.3,
  }],
};

const chartElement = document.getElementById('usage-chart').getContext('2d');
const chart = new Chart(chartElement, {
  type: 'line',
  data,
});

function removeChartData(targetChart) {
  targetChart.data.labels.shift();
  targetChart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
}

function addChartData(targetChart, newLabel, newData) {
  targetChart.data.labels.push(newLabel);
  targetChart.data.datasets.forEach((dataset, i) => {
    dataset.data.push(newData[i]);
  });
}

function showIncomingChartData(targetChart, time, cpu, ram, reqs) {
  const dataArr = [cpu, ram, reqs];

  addChartData(targetChart, time, dataArr);
  if (targetChart.data.labels.length >= env.CHARTLENGTH) {
    removeChartData(chart);
  }

  targetChart.update('none');
}

const projectNames = [];
const avgResTimes = {};

/* Function converts number into two digit number with leading 0 */
function pretifyNum(n) {
  return `${n < 10 ? '0' : ''}${n}`;
}

/* Function generates pretified time */
function pretifyTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${pretifyNum(h)}:${pretifyNum(m)}:${pretifyNum(s)}`;
}

/* Function generates pretified time of only hours and minutes */
function pretifyTimeShort(date) {
  const h = date.getHours();
  const m = date.getMinutes();

  return `${pretifyNum(h)}:${pretifyNum(m)}`;
}

/* Function generates pretified date */
function pretifyDate(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${pretifyNum(d)}/${pretifyNum(m)}`;
}

/* Function averages contents of numerical array */
function arrAverage(arr) {
  let sum = 0;
  arr.forEach((n) => {
    sum += n;
  });
  return sum / arr.length;
}

function cleanName(name) {
  return name.replace('.', '-');
}

/* Function adds project to board and displays status */
function addProject(name, info) {
  const color = info.status === 'Online' ? 'green' : 'red';

  // create pretified time and date
  const updateTime = pretifyTimeShort(new Date(info.lastUpdate));
  const updateDate = pretifyDate(new Date(info.lastUpdate));

  // print '-' if reponse time is null
  const responseTime = arrAverage(avgResTimes[name]);
  const responseTimePrint = Number.isNaN(responseTime) ? '-' : `${responseTime}ms`;

  $('#project-status-table tr:last')
    .after(`<tr id="status-project-${cleanName(name)}">
              <td>${name}</td>
              <td>${info.nOfRequests}</td>
              <td class="n-of-errors">${info.nOfErrors}</td>
              <td class="${color}">${info.status}</td>
              <td>${updateTime} ${updateDate}</td>
              <td>${info.nOfLogins}</td>
              <td>${info.nOfAccounts}</td>
              <td>${responseTimePrint}</td>
            </tr>`);

  $('#page')
    .append(`<div class="container" id="logs-project-${cleanName(name)}">
              <button onclick="clearErrors('${name}')" class="clear-errors-btn">Clear Errors</button>
              <button onclick="clearLogs('${name}')" class="clear-logs-btn">Clear Logs</button>
              <h3>${name}</h3>
              <hr>
              <div class="child left">
                <h4>Logs</h4>
                <p class="log">${info.logs}</p>
              </div>
              <div class="child right">
                <h4>Errors</h4>
                <p class="log">${info.errorLogs}</p>
            </div>`);
}

/* Function updates project to board and displays status */
function updateProject(name, newInfo) {
  const color = newInfo.status === 'Online' ? 'green' : 'red';

  // create pretified time and date
  const updateTime = pretifyTimeShort(new Date(newInfo.lastUpdate));
  const updateDate = pretifyDate(new Date(newInfo.lastUpdate));

  // print '-' if reponse time is null
  const responseTime = arrAverage(avgResTimes[name]);
  const responseTimePrint = Number.isNaN(responseTime) ? '-' : `${responseTime}ms`;

  $(`#status-project-${cleanName(name)}`)
    .html(`<td>${name}</td>
           <td>${newInfo.nOfRequests}</td>
           <td class="n-of-errors">${newInfo.nOfErrors}</td>
           <td class="${color}">${newInfo.status}</td>
           <td>${updateTime} ${updateDate}</td>
           <td>${newInfo.nOfLogins}</td>
           <td>${newInfo.nOfAccounts}</td>
           <td>${responseTimePrint}</td>`);

  $(`#logs-project-${cleanName(name)}`)
    .html(`<button onclick="clearErrors('${name}')" class="clear-errors-btn">Clear Errors</button>
           <button onclick="clearLogs('${name}')" class="clear-logs-btn">Clear Logs</button>
           <h3>${name}</h3>
           <hr>
           <div class="child left">
             <h4>Logs</h4>
             <p class="log">${newInfo.logs}</p>
           </div>
           <div class="child right">
             <h4>Errors</h4>
             <p class="log">${newInfo.errorLogs}</p>
           </div>`);
}

function clearErrors(name) {
  $.post({
    url: `${env.APIURL}/api/clear/${name}/errors`,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    success: (res) => {
      $(`#logs-project-${cleanName(name)} .right .log`).html("");
      $(`#status-project-${cleanName(name)} .n-of-errors`).html("0");
    }});
}

function clearLogs(name) {
  $.post({
    url: `${env.APIURL}/api/clear/${name}/logs`,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    success: (res) => {
      $(`#logs-project-${cleanName(name)} .left .log`).html("");
    }});
}

/* Function pulls data from api and routes to chart and board */
function updatePage() {
  $.ajax({
    url: `${env.APIURL}/api/projects`,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    success: (res) => {
      // create usage tallies
      let cpuUsage = 0;
      let memoryUsage = 0;
      let requests = 0;

      // loop through every project
      const newProjectNames = Object.keys(res);
      for (let i = 0; i < newProjectNames.length; i += 1) {
        const projectName = newProjectNames[i];

        // if there are response times average and record them
        if (res[projectName].responseTimes.length > 0) {
          avgResTimes[projectName].push(arrAverage(res[projectName].responseTimes));
        }

        // tally usage data
        cpuUsage += (res[projectName].cpuUsage);
        memoryUsage += (res[projectName].memoryUsage);
        requests += (res[projectName].nOfRequests);

        // if project already displayed, update it, otherwise create project
        if (projectNames.includes(projectName)) {
          updateProject(projectName, res[projectName]);
        } else {
          avgResTimes[projectName] = [];
          projectNames.push(projectName);
          addProject(projectName, res[projectName]);
        }
      }

      // display usage data on graph
      showIncomingChartData(chart, pretifyTime(new Date()), cpuUsage, memoryUsage, requests);
    },
    error: (err) => {
      console.error(err); // eslint-disable-line
    },
  });
}

// when page loaded begin update loop
$(document).ready(() => {
  updatePage();
  setInterval(() => {
    updatePage();
  }, env.UPDATEINTERVAL);
});
