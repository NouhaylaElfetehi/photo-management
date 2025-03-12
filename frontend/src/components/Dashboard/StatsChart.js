// frontend/src/components/Dashboard/StatsChart.js
import React from 'react';

import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const StatsChart = ({ stats }) => {
  const barData = {
    labels: ['Photos', 'Albums', 'Espace utilisé'],
    datasets: [
      {
        label: 'Statistiques',
        data: [stats.photos, stats.albums, stats.storageUsed],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Espace utilisé', 'Espace libre'],
    datasets: [
      {
        data: [stats.storageUsed, stats.storageTotal - stats.storageUsed],
        backgroundColor: ['#f44336', '#9e9e9e'],
      },
    ],
  };

  return (
    <div className="stats-chart">
      <h3>Statistiques générales</h3>
      <div className="charts">
        <div className="chart bar-chart">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart doughnut-chart">
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
