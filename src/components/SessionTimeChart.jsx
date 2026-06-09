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
import { Clock } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SessionTimeChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Average Session Time (seconds)',
        data: data.map(d => d.sessionTime),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
        callbacks: {
          label: (context) => `${context.parsed.y}s`,
        },
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
          callback: (value) => `${value}s`,
        },
      },
    },
  };

  return (
    <ChartContainer title="Average Session Time" icon={Clock}>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default SessionTimeChart;
