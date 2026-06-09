import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartContainer from './ChartContainer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VehicleCountChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Vehicle Count',
        data: data.map(d => d.dailyTotal),
        borderColor: 'rgb(71, 85, 105)',
        backgroundColor: 'rgba(71, 85, 105, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(51, 65, 85, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#64748b',
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#64748b',
        },
      },
    },
  };

  return (
    <ChartContainer title="Vehicle Count">
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default VehicleCountChart;
