const ReportHeader = ({ location, project, startDate, endDate, image }) => {
  return (
    <div className="report-header bg-white border-b border-slate-200 p-6 mb-6 print-break-avoid">
      <div className="max-w-7xl mx-auto flex items-start gap-6">
        {image && (
          <div className="report-header__image-wrap shrink-0 w-full max-w-[600px] aspect-[4/3] rounded-md border border-slate-200 overflow-hidden">
            <img
              src={image}
              alt="Site Photo"
              className="report-header__image w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
          <h1 className="text-2xl font-bold text-slate-800">{project}</h1>
          <p className="text-sm text-slate-800">
            <span className="text-slate-500">Location: </span>
            {location}
          </p>
          <p className="text-sm text-slate-800">
            <span className="text-slate-500">Date Period: </span>
            {startDate} to {endDate}
          </p>
          <p className="text-sm text-slate-800">
            <span className="text-slate-500">Timezone: </span>
            Asia/Bangkok
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
