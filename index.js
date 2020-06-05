'use strict';

const os = require('os');
const batteryLevel = require('battery-level');
const isCharging = require('is-charging');
const taskList = require('tasklist');
const psNode = require('ps-node');
const osUtils = require('os-utils');

const btnEnd = document.querySelector('#endTask');
const nameProcEnd = document.querySelector('#nameProcEnd');
const textPercent = document.querySelector('#tePeCent');
const textBattery = document.querySelector('#textBateBar');
const procBar = document.querySelector('#procBar');
const batteryBar = document.querySelector('#bateBar');
const table = document.querySelector('table');
const CPUBar = document.querySelector('#CPUBar');
const textCuBar = document.querySelector('#textCuBar');

let isProcChart = false;
let isCPUChart = false;

let killProcess = [];

function createTableTask() {
  taskList({ verbose: true })
    .then((arrTask) => {
      for (const task of arrTask) {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `id${task.pid}`);
        tr.innerHTML += `<td>${task.pid}</td>`
        tr.innerHTML += `<td>${task.imageName}</td>`;
        tr.innerHTML += `<td>${task.memUsage}</td>`;
        tr.innerHTML += `<td>${task.status}</td>`;
        tr.innerHTML += `<td>${task.cpuTime}</td>`;

        tr.addEventListener('click', () => {
          nameProcEnd.textContent = task.imageName;
          console.log(arrTask.find((task) => {
            if (task.imageName === nameProcEnd.textContent) {
              killProcess.push(task);
            }
          }))
        })
        table.appendChild(tr);
      }
    })
    .catch(err => { console.log(err) });
}

function getPercentCpu() {
  osUtils.cpuUsage(function (v) {
    CPUBar.value = v * 100;
    textCuBar.textContent = `CPU Utilization : ${(v * 100).toFixed(2)} %`
    if (isCPUChart) {
      drawChart(v * 100, 100);
    }
  });
}

function drawChart(stat, total) {
  Plotly.plot('chart', [{
    y: [stat],
    mode: 'lines',
    line: { color: 'green' }
  }]);

  let cnt = 0;
  Plotly.extendTraces('chart', { y: [[stat]] }, [0]);
  cnt++;
  if (cnt > total) {
    Plotly.relayout('chart', {
      yaxis: {
        range: [
          0,
          total
        ],
        showgrid: false,
        showline: true,
        showticklabels: false,
        zeroline: true
      }
    });
  }
}

setInterval(() => {
  getPercentCpu();
  const freeMemory = (os.freemem() / 10 ** 6).toFixed(2);
  const totalMemory = (os.totalmem() / 10 ** 6).toFixed(2);
  const using = (totalMemory - freeMemory).toFixed(2);

  if (isProcChart) {
    drawChart(using, totalMemory);
  }


  procBar.value = (using / totalMemory).toFixed(2) * 100;
  textPercent.innerText = `Use/Total : ${using}/${totalMemory} (Mb)`

  let isChar = false;
  isCharging().then(result => {
    isChar = result
    return batteryLevel();
  }).then(level => {
    batteryBar.value = (level * 100);

    textBattery.innerText = `Battery : ${level * 100}% (is charging : ${isChar})`
  }).catch(err => { console.log(err) });
}, 1000);

btnEnd.addEventListener('click', (e) => {
  e.preventDefault();
  try {
    for (const proc of killProcess) {
      psNode.kill(proc.pid, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(`Process with pid ${button.textContent} has been killed!`);
        }
      });
      document.querySelector(`#id${proc.pid}`).style.display = "none";
    }
    killProcess = [];
    createTableTask();
  } catch (error) {
    console.log(error)
  }
})
createTableTask();


document.querySelector('#proc').addEventListener('click', (e) => {
  e.preventDefault();
  isCPUChart = false;
  isProcChart = true;
});
document.querySelector('#CPU').addEventListener('click', (e) => {
  e.preventDefault();
  isCPUChart = true;
  isProcChart = false;
})



