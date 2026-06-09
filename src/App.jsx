import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ControlPanel from './components/ControlPanel';
import ReportHeader from './components/ReportHeader';
import MetricCards from './components/MetricCard';
import VehicleCountChart from './components/VehicleCountChart';
import DayOfWeekChart from './components/DayOfWeekChart';
import HourOfDayChart from './components/HourOfDayChart';
import SessionTimeChart from './components/SessionTimeChart';
import VehicleTypeTable from './components/VehicleTypeTable';
import { generateTrafficData, calculateMetrics, aggregateByDayOfWeek, aggregateHourlyData } from './utils/trafficGenerator';

function App() {
  const [reportData, setReportData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef(null);

  const handleGenerate = (data) => {
    setIsGenerating(true);
    setFormData(data);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const trafficData = generateTrafficData(
        data.startDate,
        data.endDate,
        data.minVolume,
        data.maxVolume,
        data.vehicleBreakdown
      );
      
      const calculatedMetrics = calculateMetrics(trafficData);
      const dayOfWeekData = aggregateByDayOfWeek(trafficData);
      const hourlyData = aggregateHourlyData(trafficData);
      
      setReportData({
        traffic: trafficData,
        dayOfWeek: dayOfWeekData,
        hourly: hourlyData
      });
      setMetrics(calculatedMetrics);
      setIsGenerating(false);
    }, 500);
  };

  const handleExportPDF = () => {
    if (!reportRef.current) return;
    
    // 1. Target the main dashboard container (exclude the control panel form)
    const element = reportRef.current;

    // 2. High-definition PDF configurations
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Traffic_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 1.0 }, // Maximum quality
      html2canvas: { 
        scale: 3,            // CRITICAL: Increases DPI (3x standard resolution) to fix low-res blur
        useCORS: true,       // Ensures icons from CDN load correctly
        logging: false,
        letterRendering: true // Fixes text distortion and weird character bugs
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css'] } // Prevents charts from splitting horizontally
    };

    // 3. Temporarily optimize UI styling for print layout
    element.classList.add('printing-layout');

    // 4. Run html2pdf execution chain
    html2pdf().set(opt).from(element).save().then(() => {
      // 5. Restore original web layout after PDF download completes
      element.classList.remove('printing-layout');
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <ControlPanel 
        onGenerate={handleGenerate} 
        onExportPDF={handleExportPDF}
        isGenerating={isGenerating}
      />
      
      {reportData && metrics && formData && (
        <div ref={reportRef} className="max-w-7xl mx-auto px-6 pb-12">
          <ReportHeader
            location={formData.location}
            project={formData.project}
            startDate={formData.startDate}
            endDate={formData.endDate}
          />
          
          <MetricCards metrics={metrics} />
          
          <div className="pdf-main-grid">
            <VehicleTypeTable data={reportData.traffic} />
            <DayOfWeekChart data={reportData.dayOfWeek} />
            <VehicleCountChart data={reportData.traffic} />
            <HourOfDayChart
              data={reportData.hourly}
              title="Vehicle counts by Hour of Day"
              color="rgb(71, 85, 105)"
            />
            <SessionTimeChart data={reportData.traffic} />
          </div>
        </div>
      )}
      
      {!reportData && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="text-slate-400 text-lg">
            Click "Generate Report" to create a traffic analytics report
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
