
let chartElement = document.getElementById('myChart').getContext('2d');
const labels = ['1', '2', '3', '4', '5', '6', '7'];
const data = {
  labels: labels,
  datasets: [{
    label: 'CPU',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 120)',
    tension: 0.1
  }, {
    label: 'RAM',
    data: [65, 34, 80, 81, 98, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.3
  }, {
    label: 'Requests',
    data: [67, 21, 55, 77, 98, 40, 32],
    fill: false,
    borderColor: 'rgb(75, 192, 220)',
    tension: 0.3
  }]
};

let chart = new Chart(chartElement, {
  type: 'line',
  data: data,
});
