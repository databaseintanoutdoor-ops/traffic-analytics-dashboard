import { Info } from 'lucide-react';

const ChartContainer = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6 print-break-avoid">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={18} className="text-slate-500" />}
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <Info size={16} className="text-slate-400 ml-auto" />
      </div>
      <div className="chart-area relative" style={{ height: '300px' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
