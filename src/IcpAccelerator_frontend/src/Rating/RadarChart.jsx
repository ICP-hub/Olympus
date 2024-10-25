import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart,
  RadarController,
  LineElement,
  Filler,
  Legend,
  RadialLinearScale,
} from 'chart.js';

Chart.register(
  RadarController,
  LineElement,
  Filler,

  Legend,
  RadialLinearScale
);

const RadarChart = () => {
  const data = {
    labels: [
      'Team',
      'Problem ',
      'Value prop',
      'Product',
      'Market',
      'Business',
      'Scale',
      'Exit',
    ],
    datasets: [
      {
        label: 'Startup Evaluation',
        data: [8, 7, 8, 9, 8, 8, 7, 9],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        // Hides the scale numbers (ticks)
        ticks: {
          display: false,
        },
        // Keeps the angle lines visible
        angleLines: {
          display: true,
        },
        // Adjusts the point label font size
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // This hides the legend (label and box)
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
