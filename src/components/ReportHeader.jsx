const ReportHeader = ({ location, project, startDate, endDate }) => {
  return (
    <div className="bg-white border-b border-slate-200 p-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{project}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Location:</span>
            <span className="ml-2 text-slate-800 font-medium">{location}</span>
          </div>
          <div>
            <span className="text-slate-500">Date Period:</span>
            <span className="ml-2 text-slate-800 font-medium">{startDate} to {endDate}</span>
          </div>
          <div>
            <span className="text-slate-500">Timezone:</span>
            <span className="ml-2 text-slate-800 font-medium">Asia/Bangkok</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
