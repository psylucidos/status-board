/* global $, Chart */
const CHARTLENGTH = 10;

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
  $('#project-status-table tr:last')
    .after(`<tr id="status-project-${name}">
              <td>${name}</td>
              <td>${info.nOfRequests}</td>
              <td>${info.nOfErrors}</td>
              <td class="${color}">${info.status}</td>
            </tr>`);

  const income = info.income === '-' ? '-' : `$${info.income}/month`;
  $('#project-usage-table tr:last')
    .after(`<tr id="usage-project-${name}">
              <td>${name}</td>
              <td>${info.nOfLogins}</td>
              <td>${info.nOfAccounts}</td>
              <td>${income}</td>
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
  $(`#status-project-${name}`)
    .html(`<td>${name}</td>
            <td>${newInfo.nOfRequests}</td>
            <td>${newInfo.nOfErrors}</td>
            <td class="${color}">${newInfo.status}</td>`);

  const income = newInfo.income === '-' ? '-' : `$${newInfo.income}/month`;
  $(`#usage-project-${name}`)
    .html(`<td>${name}</td>
           <td>${newInfo.nOfLogins}</td>
           <td>${newInfo.nOfAccounts}</td>
           <td>${income}</td>`);

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

$(document).ready(() => {
  setInterval(() => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const cpu = 30;
    const ram = 40;
    const reqs = 10;
    showIncomingChartData(chart, `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`, cpu, ram, reqs);

    addProject('test', {
      nOfRequests: 10,
      nOfErrors: 3,
      status: 'Online',
      nOfLogins: 4,
      nOfAccounts: 5,
      income: '-',
      logs: '',
      errorLogs: '',
    });

    setTimeout(() => {
      updateProject('test', {
        nOfRequests: 11,
        nOfErrors: 3,
        status: 'Offline',
        nOfLogins: 4,
        nOfAccounts: 5,
        income: '-',
        logs: '',
        errorLogs: 'big error!',
      });
    }, 2 * 1000);
  }, 10 * 1000);
});
