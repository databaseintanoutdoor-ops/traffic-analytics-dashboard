import { Table } from 'lucide-react';

const VehicleTypeTable = ({ data }) => {
  // Aggregate vehicle types across all days
  const totalVehicleTypes = data.reduce((acc, day) => ({
    motorcycle: acc.motorcycle + day.vehicleTypes.motorcycle,
    car: acc.car + day.vehicleTypes.car,
    truck: acc.truck + day.vehicleTypes.truck,
    bus: acc.bus + day.vehicleTypes.bus,
  }), { motorcycle: 0, car: 0, truck: 0, bus: 0 });

  const total = totalVehicleTypes.motorcycle + totalVehicleTypes.car + 
                totalVehicleTypes.truck + totalVehicleTypes.bus;

  const rows = [
    { type: 'Motorcycle', count: totalVehicleTypes.motorcycle, percentage: ((totalVehicleTypes.motorcycle / total) * 100).toFixed(2) },
    { type: 'Car', count: totalVehicleTypes.car, percentage: ((totalVehicleTypes.car / total) * 100).toFixed(2) },
    { type: 'Truck', count: totalVehicleTypes.truck, percentage: ((totalVehicleTypes.truck / total) * 100).toFixed(2) },
    { type: 'Bus', count: totalVehicleTypes.bus, percentage: ((totalVehicleTypes.bus / total) * 100).toFixed(2) },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6 print-break-avoid">
      <div className="flex items-center gap-2 mb-4">
        <Table size={18} className="text-slate-500" />
        <h3 className="text-base font-semibold text-slate-800">Types by Zone</h3>
        <div className="ml-auto text-sm text-slate-500">Zone 1</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Vehicle Type</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Count</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm text-slate-800">{row.type}</td>
                <td className="py-3 px-4 text-sm text-slate-800 text-right">{row.count.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-slate-800 text-right">{row.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTypeTable;
