import { useRef, useState } from 'react';
import { RefreshCw, Download, ImagePlus, X } from 'lucide-react';
import { DEFAULT_VEHICLE_BREAKDOWN } from '../utils/trafficGenerator';

const VEHICLE_TYPES = [
  { key: 'motorcycle', label: 'Motorcycle %' },
  { key: 'car', label: 'Car %' },
  { key: 'truck', label: 'Truck %' },
  { key: 'bus', label: 'Bus %' },
];

const MAX_IMAGE_SIZE_MB = 5;

const ControlPanel = ({ onGenerate, onExportPDF, isGenerating, reportImage, onImageChange }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    location: 'BSI Zainul Arifin Medan',
    project: 'BSI MEDAN',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    minVolume: 700000,
    maxVolume: 900000,
    vehicleBreakdown: { ...DEFAULT_VEHICLE_BREAKDOWN },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleBreakdownChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      vehicleBreakdown: {
        ...prev.vehicleBreakdown,
        [key]: Number(value),
      },
    }));
  };

  const breakdownTotal = Object.values(formData.vehicleBreakdown).reduce((sum, value) => sum + value, 0);
  const isBreakdownValid = Math.abs(breakdownTotal - 100) < 0.01;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Hanya file gambar yang diperbolehkan (JPG, PNG, WEBP, dll).');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      window.alert(`Ukuran gambar maksimal ${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = () => {
    if (!isBreakdownValid) return;
    onGenerate(formData);
  };

  return (
    <div className="no-print bg-slate-50 border-b border-slate-200 p-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Min Volume</label>
            <input
              type="number"
              name="minVolume"
              value={formData.minVolume}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Max Volume</label>
            <input
              type="number"
              name="maxVolume"
              value={formData.maxVolume}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Types by Zone (%)</h3>
            <span className={`text-sm font-medium ${isBreakdownValid ? 'text-green-600' : 'text-red-600'}`}>
              Total: {breakdownTotal.toFixed(2)}%
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VEHICLE_TYPES.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.vehicleBreakdown[key]}
                  onChange={(e) => handleBreakdownChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            ))}
          </div>
          {!isBreakdownValid && (
            <p className="text-sm text-red-600 mt-2">Total persentase harus sama dengan 100%.</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Foto Lokasi (untuk PDF)</h3>
          <div className="flex flex-wrap items-start gap-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="report-image-upload"
              />
              <label
                htmlFor="report-image-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-sm"
              >
                <ImagePlus size={16} />
                Upload Foto
              </label>
              <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP. Maks. {MAX_IMAGE_SIZE_MB} MB.</p>
            </div>
            {reportImage && (
              <div className="relative">
                <img
                  src={reportImage}
                  alt="Preview"
                  className="h-20 w-auto max-w-[160px] rounded-md border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Hapus foto"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !isBreakdownValid}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            Generate Report
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
