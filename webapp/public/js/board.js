/* global $, Chart */
const CHARTLENGTH = 20;
const UPDATEINTERVAL = 5 * 1000;

function pretifyNum(n) {
  return `${n < 10 ? '0' : ''}${n}`;
}

function pretifyTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${pretifyNum(h)}:${pretifyNum(m)}:${pretifyNum(s)}`;
}

function pretifyTimeShort(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${pretifyNum(h)}:${pretifyNum(m)}`;
}

function pretifyDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${pretifyNum(d)}/${pretifyNum(m)}`;
}

function arrAverage(arr) {
  let x = 0;
  arr.forEach((n) => x += n);
  return x / arr.length;
}

const chartElement = document.getElementById('myChart').getContext('2d');
const labels = [];
const data = {
  labels,
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
    backgroundColor: 'rgba(75, 192, 225, 0.1)',
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
  let dataArr = [cpu, ram, reqs];

  addChartData(targetChart, time, dataArr);
  if (targetChart.data.labels.length >= CHARTLENGTH) {
    removeChartData(chart);
  }

  targetChart.update('none');
}

function addProject(name, info) {

  const color = info.status === 'Online' ? 'green' : 'red';

  const updateTime = pretifyTimeShort(new Date(info.lastUpdate));
  const updateDate = pretifyDate(new Date(info.lastUpdate));

  const responseTime = arrAverage(avgResTimes[name]);
  const responseTimePrint = Number.isNaN(responseTime) ? '-' : responseTime;

  $('#project-status-table tr:last')
  .after(`<tr id="status-project-${name}">
            <td>${name}</td>
            <td>${info.nOfRequests}</td>
            <td>${info.nOfErrors}</td>
            <td class="${color}">${info.status}</td>
            <td>${updateTime} ${updateDate}</td>
            <td>${info.nOfLogins}</td>
            <td>${info.nOfAccounts}</td>
            <td>${responseTimePrint}</td>
          </tr>`);

  $('#page')
    .append(`<div class="container" id="logs-project-${name}">
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

function updateProject(name, newInfo) {
  const color = newInfo.status === 'Online' ? 'green' : 'red';

  const updateTime = pretifyTimeShort(new Date(newInfo.lastUpdate));
  const updateDate = pretifyDate(new Date(newInfo.lastUpdate));

  const responseTime = arrAverage(avgResTimes[name]);
  const responseTimePrint = Number.isNaN(responseTime) ? '-' : responseTime;

  $(`#status-project-${name}`)
    .html(`<td>${name}</td>
           <td>${newInfo.nOfRequests}</td>
           <td>${newInfo.nOfErrors}</td>
           <td class="${color}">${newInfo.status}</td>
           <td>${updateTime} ${updateDate}</td>
           <td>${newInfo.nOfLogins}</td>
           <td>${newInfo.nOfAccounts}</td>
           <td>${responseTimePrint}`);

  $(`#logs-project-${name}`)
    .html(`<h3>${name}</h3>
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

const projects = [];
const avgResTimes = {};

function updatePage() {
  $.ajax({ url: 'http://localhost:3000/api/projects', success: (res) => {
    let cpuUsage = 0;
    let memoryUsage = 0;
    let requests = 0;

    for (let project in res) {
      if (res.hasOwnProperty(project)) {
        if (res[project].responseTimes.length > 0) {
          avgResTimes[project].push(arrAverage(res[project].responseTimes));
        }

        cpuUsage += (res[project].cpuUsage);
        memoryUsage += (res[project].memoryUsage);
        requests += (res[project].nOfRequests);

        if (projects.includes(project)) {
          updateProject(project, res[project]);
        } else {
          avgResTimes[project] = [];
          projects.push(project);
          addProject(project, res[project]);
        }
      }
    }

    showIncomingChartData(chart, pretifyTime(new Date()), cpuUsage, memoryUsage, requests);
  }, error: (err) => {
    console.error(err);
  }});
}

$(document).ready(() => {
  updatePage();
  setInterval(() => {
    updatePage();
  }, UPDATEINTERVAL);
});
