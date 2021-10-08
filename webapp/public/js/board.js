/* global $, Chart */
const CHARTLENGTH = 10;
const UPDATEINTERVAL = 60 * 1000;

function pretifyNum(n) {
  return `${n < 10 ? '0' : ''}${n}`;
}

function pretifyTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${pretifyNum(h)}:${pretifyNum(m)}:${pretifyNum(s)}`;
}

function pretifyDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${pretifyNum(d)}/${pretifyNum(m)}/${pretifyNum(y)}`;
}

const chartElement = document.getElementById('myChart').getContext('2d');
const labels = [];
const data = {
  labels,
  datasets: [{
    label: 'CPU',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 120)',
    tension: 0.3,
  }, {
    label: 'RAM',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.3,
  }, {
    label: 'Requests',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 220)',
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
  targetChart.update();
}

function addChartData(targetChart, newLabel, newData) {
  targetChart.data.labels.push(newLabel);
  targetChart.data.datasets.forEach((dataset, i) => {
    dataset.data.push(newData[i]);
  });
  targetChart.update();
}

function showIncomingChartData(targetChart, time, cpu, ram, reqs) {
  addChartData(targetChart, time, [cpu, ram, reqs]);
  if (targetChart.data.labels.length >= CHARTLENGTH) {
    removeChartData(chart);
  }
}

function addProject(name, info) {
  const color = info.status === 'Online' ? 'green' : 'red';

  const updateTime = pretifyTime(new Date(info.lastUpdate));
  const updateDate = pretifyDate(new Date(info.lastUpdate));

  $('#project-status-table tr:last')
  .after(`<tr id="status-project-${name}">
            <td>${name}</td>
            <td>${info.nOfRequests}</td>
            <td>${info.nOfErrors}</td>
            <td class="${color}">${info.status}</td>
            <td>${updateTime} ${updateDate}</td>
            <td>${info.nOfLogins}</td>
            <td>${info.nOfAccounts}</td>
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

  const updateTime = pretifyTime(new Date(newInfo.lastUpdate));
  const updateDate = pretifyDate(new Date(newInfo.lastUpdate));

  $(`#status-project-${name}`)
    .html(`<td>${name}</td>
           <td>${newInfo.nOfRequests}</td>
           <td>${newInfo.nOfErrors}</td>
           <td class="${color}">${newInfo.status}</td>
           <td>${updateTime} ${updateDate}</td>
           <td>${newInfo.nOfLogins}</td>
           <td>${newInfo.nOfAccounts}</td>`);

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

function updatePage() {
  $.ajax({ url: 'http://localhost:3000/api/projects', success: (res) => {
    console.log(res);
    let cpuUsage = 0;
    let memoryUsage = 0;
    let requests = 0;

    for (let project in res) {
      if (res.hasOwnProperty(project)) {
        cpuUsage = (res[project].cpuUsage);
        memoryUsage = (res[project].memoryUsage);
        requests = (res[project].nOfRequests);
        if (projects.includes(project)) {
          updateProject(project, res[project]);
        } else {
          projects.push(project);
          addProject(project, res[project]);
        }
      }
    }
    console.log(cpuUsage, memoryUsage, requests);
    showIncomingChartData(chart, pretifyTime(new Date()), cpuUsage, memoryUsage, requests);
  }, error: (err) => {
    console.error(err);
  }});
}

$(document).ready(() => {
  updatePage();
  setInterval(() => {
    updatePage();
  }, 10 * 1000);
});
