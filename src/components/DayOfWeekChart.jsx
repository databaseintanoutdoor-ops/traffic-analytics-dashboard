import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartContainer from './ChartContainer';
import { Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DayOfWeekChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        type: 'bar',
        label: 'Total',
        data: data.map(d => d.total),
        backgroundColor: 'rgba(71, 85, 105, 0.7)',
        borderColor: 'rgb(71, 85, 105)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Average',
        data: data.map(d => d.average),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 11,
          },
          color: '#64748b',
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(51, 65, 85, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
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
    <ChartContainer title="Vehicle Totals and Average by Day of Week" icon={Calendar}>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default DayOfWeekChart;
