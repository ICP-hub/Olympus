import React, { useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart,
  RadarController,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  RadialLinearScale,
} from 'chart.js';
import { rubric_table_data } from '../components/Utils/jsondata/data/projectRatingsRubrics';

Chart.register(
  RadarController,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  RadialLinearScale
);

// Define tooltip CSS as a constant
const tooltipStyle = {
  position: 'absolute',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px',
  borderRadius: '4px',
  pointerEvents: 'none',
  maxWidth: '200px',
  fontSize: '12px',
};

const descriptionStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
};

const RadarChart = ({ rubricRatingData }) => {
  const descriptions = {};
  rubric_table_data.forEach((item) => {
    descriptions[item.title] = item.desc;
  });

  const labels = rubricRatingData?.map((item) => item.level_name) || [];
  const ratings = rubricRatingData?.map((item) => item.rating) || [];

  const data = {
    labels,
    datasets: [
      {
        label: 'Ratings',
        data: ratings,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: ratings.map(
          (_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`
        ),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: ratings.map(
          (_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`
        ),
      },
    ],
  };

  const options = {
    scales: {
      r: {
        ticks: {
          display: false,
        },
        angleLines: {
          display: true,
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false, // Disable default tooltip
        external: function (context) {
          const tooltip = context.tooltip;
          let tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            Object.assign(tooltipEl.style, tooltipStyle); // Apply tooltip style
            document.body.appendChild(tooltipEl);
          }

          // Hide tooltip if no data
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const levelName = tooltip.dataPoints[0].label;
          const description = descriptions[levelName] || '';
          const rating = tooltip.dataPoints[0].raw;

          // Set tooltip content with line clamp
          tooltipEl.innerHTML = `
            <div><strong>${levelName}</strong></div>
            <div style="${Object.entries(descriptionStyle)
              .map(([key, value]) => `${key}: ${value}`)
              .join(';')}">
              ${description}
            </div>
            <div>Rating: ${rating}</div>
          `;

          // Position tooltip
          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = 1;
          tooltipEl.style.left =
            position.left + window.pageXOffset + tooltip.caretX + 'px';
          tooltipEl.style.top =
            position.top + window.pageYOffset + tooltip.caretY + 'px';
        },
      },
      legend: {
        display: false,
      },
    },
  };

  // Clean up tooltip on component unmount
  useEffect(() => {
    return () => {
      const tooltipEl = document.getElementById('chartjs-tooltip');
      if (tooltipEl) tooltipEl.remove();
    };
  }, []);

  return <Radar data={data} options={options} />;
};

export default RadarChart;
