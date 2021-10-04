
let chartElement = document.getElementById('myChart').getContext('2d');
const labels = [];
const data = {
  labels: labels,
  datasets: [{
    label: 'CPU',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 120)',
    tension: 0.3
  }, {
    label: 'RAM',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.3
  }, {
    label: 'Requests',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 220)',
    tension: 0.3
  }]
};

let chart = new Chart(chartElement, {
  type: 'line',
  data: data,
});

function removeData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  chart.update();
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset, i) => {
    dataset.data.push(data[i]);
  });
  chart.update();
}

function showIncomingChartData(time, cpu, ram, reqs) {
  addData(chart, time, [cpu, ram, reqs]);
  if (chart.data.labels.length >= 360) {
    removeData(chart);
  }
}

$(document).ready(function() {
  setInterval(function () {
    let date = new Date();
    let h = date.getHours(),
        m = date.getMinutes();
        s = date.getSeconds();

    let cpu = 30,
        ram = 40,
        reqs = 10;
    showIncomingChartData(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`, cpu, ram, reqs);
  }, 10*1000);
});
