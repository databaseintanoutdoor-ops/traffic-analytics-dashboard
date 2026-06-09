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

const HourOfDayChart = ({ data, title, color, unit }) => {
  const chartData = {
    labels: data.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: title,
        data: data.map(d => d.avgVolume || d.avgSpeed),
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
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
          label: (context) => {
            const value = context.parsed.y;
            return unit ? `${value.toFixed(1)} ${unit}` : value.toLocaleString();
          },
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
          maxTicksLimit: 12,
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
          callback: (value) => unit ? `${value} ${unit}` : value.toLocaleString(),
        },
      },
    },
  };

  return (
    <ChartContainer title={title} icon={Clock}>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default HourOfDayChart;
