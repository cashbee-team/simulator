/**
 * Copyright (C) Cashbee SAS - All Rights Reserved
 *
 * This source code is protected under international copyright law.  All rights
 * reserved and protected by the copyright holders.
 */

import Alpine from 'alpinejs';
import { BarController, BarElement, CategoryScale, Chart, Colors as ChartColors, LinearScale } from 'chart.js';
import { BackgroundColors, Colors, DefaultColor } from './colors.js';
import { DEFAULT_MAIN_PRODUCT } from './constants.js';

Chart.register(ChartColors, BarController, BarElement, LinearScale, CategoryScale);

const canvas = document.getElementById('chart');
const chart = new Chart(canvas, {
  type: 'bar',
  data: {
    labels: [DEFAULT_MAIN_PRODUCT, 'Investi'],
    datasets: [
      {
        data: [0, 0],
        barThickness: 30,
        backgroundColor: [
          Colors[DEFAULT_MAIN_PRODUCT] || DefaultColor,
          '#a8a8b2',
        ],
      },
      {
        data: [0, undefined],
        barThickness: 30,
        backgroundColor: [
          Colors[DEFAULT_MAIN_PRODUCT] || DefaultColor,
          '#a8a8b2',
        ],
      },
    ],
  },
  options: {
    hover: { mode: null },
    indexAxis: 'y',
    scales: {
      x: {
        display: false,
        stacked: true,
      },
      y: {
        border: { display: false },
        grid: { display: false },
        beginAtZero: true,
        stacked: true,
      },
    },
    plugins: {
      legend: { display: false },
    },
  },
});

Alpine.store('chart', {
  setBase(base) {
    chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] = base;
    chart.data.datasets[1].data[chart.data.datasets[0].data.length - 1] = undefined;
  },
  setBar(index, kind, best, worst) {
    chart.data.labels[index] = kind;
    chart.data.datasets[0].backgroundColor[index] = BackgroundColors[kind] || DefaultColor;
    chart.data.datasets[1].backgroundColor[index] = Colors[kind] || DefaultColor;
    if (worst) {
      chart.data.datasets[1].data[index] = best;
    } else {
      chart.data.datasets[0].data[index] = best;
      chart.data.datasets[1].data[index] = best;
    }
    chart.data.datasets[0].data[index] = worst;
    console.log(chart.data.datasets);
    chart.update();
  },
  setMain(kind, best, worst) {
    this.setBar(0, kind, best, worst)
  },
  setSecond(kind, best, worst) {
    if (chart.data.datasets[0].data.length < 3) this.insertSecond();
    this.setBar(1, kind, best, worst)
  },
  insertSecond() {
    chart.data.labels.splice(1, 0, '');
    chart.data.datasets[0].backgroundColor.splice(1, 0, '');
    chart.data.datasets[0].data.splice(1, 0, 0);
    chart.data.datasets[1].backgroundColor.splice(1, 0, '');
    chart.data.datasets[1].data.splice(1, 0, 0);
  },
  unsetSecond() {
    chart.data.labels.splice(1, 1);
    chart.data.datasets[0].backgroundColor.splice(1, 1);
    chart.data.datasets[0].data.splice(1, 1);
    chart.data.datasets[1].backgroundColor.splice(1, 1);
    chart.data.datasets[1].data.splice(1, 1);
    chart.update();
  },
});
