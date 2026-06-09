import { Car, CalendarDays, Zap, Eye } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change?.isPositive;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changePrefix = isPositive ? '+' : '';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value?.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor}`}>
              {changePrefix}{change.value}%
            </p>
          )}
        </div>
        <Icon size={20} className="text-slate-300" />
      </div>
    </div>
  );
};

const MetricCards = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total Vehicle"
        value={metrics.totalVehicle}
        change={metrics.changes.totalVehicle}
        icon={Car}
      />
      <MetricCard
        title="Avg Count/Day"
        value={metrics.avgCountPerDay}
        change={metrics.changes.avgCountPerDay}
        icon={CalendarDays}
      />
      <MetricCard
        title="Peak Count"
        value={metrics.peakCount}
        change={metrics.changes.peakCount}
        icon={Zap}
      />
      <MetricCard
        title="Estimated Impression"
        value={metrics.estimatedImpression}
        change={metrics.changes.estimatedImpression}
        icon={Eye}
      />
    </div>
  );
};

export default MetricCards;
