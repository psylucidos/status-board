/* global $, Chart */
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

function removeData(targetChart) {
  targetChart.data.labels.shift();
  targetChart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  targetChart.update();
}

function addData(targetChart, newLabel, newData) {
  targetChart.data.labels.push(newLabel);
  targetChart.data.datasets.forEach((dataset, i) => {
    dataset.data.push(newData[i]);
  });
  targetChart.update();
}

function showIncomingChartData(targetChart, time, cpu, ram, reqs) {
  addData(targetChart, time, [cpu, ram, reqs]);
  if (targetChart.data.labels.length >= 360) {
    removeData(chart);
  }
}

function addProject(name, info) {
  const color = info.status === 'Online' ? 'green' : 'red';
  $('#project-status-table tr:last')
    .after(`<tr>
            <td>${name}</td>
            <td>${info.nOfRequests}</td>
            <td>${info.nOfErrors}</td>
            <td class="${color}">${info.status}</td>
          </tr>`);

  const income = info.income === '-' ? '-' : `$${info.income}/month`;
  $('#project-usage-table tr:last')
    .after(`<tr>
              <td>${name}</td>
              <td>${info.nOfLogins}</td>
              <td>${info.nOfAccounts}</td>
              <td>${income}</td>
            </tr>`);

  $('#page')
    .append(`<div class="container">
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
  }, 10 * 1000);
});
