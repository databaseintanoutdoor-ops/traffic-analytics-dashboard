import { format, parseISO, differenceInDays, addDays, getDay } from 'date-fns';

export const DEFAULT_VEHICLE_BREAKDOWN = {
  motorcycle: 58.09,
  car: 41.33,
  truck: 0.52,
  bus: 0.06
};

// Hourly M-curve traffic pattern (percentage of daily peak)
const HOURLY_PATTERN = {
  '0': 0.08, '1': 0.06, '2': 0.05, '3': 0.05, '4': 0.06, '5': 0.10,
  '6': 0.35, '7': 0.75, '8': 0.90, '9': 0.85, '10': 0.65, '11': 0.60,
  '12': 0.65, '13': 0.60, '14': 0.55, '15': 0.60, '16': 0.75, '17': 0.95,
  '18': 0.90, '19': 0.70, '20': 0.50, '21': 0.40, '22': 0.25, '23': 0.15
};

// Saturday: quieter mornings, busier afternoon through evening
const SATURDAY_HOURLY_MODIFIER = {
  '0': 0.90, '1': 0.85, '2': 0.80, '3': 0.80, '4': 0.85, '5': 0.88,
  '6': 0.55, '7': 0.50, '8': 0.48, '9': 0.50, '10': 0.55, '11': 0.60,
  '12': 0.85, '13': 0.95, '14': 1.10, '15': 1.15, '16': 1.25, '17': 1.30,
  '18': 1.25, '19': 1.20, '20': 1.15, '21': 1.10, '22': 1.00, '23': 0.92
};

const getHourlyPatternForDay = (dayOfWeek) => {
  if (dayOfWeek !== 6) return HOURLY_PATTERN;

  const pattern = {};
  for (const [hour, value] of Object.entries(HOURLY_PATTERN)) {
    pattern[hour] = value * SATURDAY_HOURLY_MODIFIER[hour];
  }
  return pattern;
};

// Monday, Friday, Saturday: 10-15% above other days
const getDayOfWeekVolumeFactor = (dayOfWeek) => {
  const peakDays = [1, 5, 6]; // Monday, Friday, Saturday

  if (peakDays.includes(dayOfWeek)) {
    return 1.10 + Math.random() * 0.05;
  }

  if (dayOfWeek === 0) {
    return 0.95 + Math.random() * 0.04;
  }

  return 0.90 + Math.random() * 0.04;
};

// Speed brackets based on traffic volume percentage
const getSpeedFromVolume = (volumePercentage) => {
  const random = Math.random();
  if (volumePercentage > 0.80) {
    // Heavy congestion: 20-30 km/h
    return 20 + random * 10;
  } else if (volumePercentage > 0.60) {
    // Moderate traffic: 30-45 km/h
    return 30 + random * 15;
  } else if (volumePercentage > 0.30) {
    // Light traffic: 45-55 km/h
    return 45 + random * 10;
  } else {
    // Empty roads: 50-65 km/h
    return 50 + random * 15;
  }
};

// Generate random number within range with slight variation
const randomInRange = (min, max, variance = 0.1) => {
  const minNum = Number(min);
  const maxNum = Number(max);
  const base = minNum + Math.random() * (maxNum - minNum);
  const variation = base * variance * (Math.random() - 0.5);
  return Math.round(base + variation);
};

// Split total count into vehicle types with exact sum
const splitIntoVehicleTypes = (totalCount, vehicleBreakdown) => {
  let remaining = totalCount;

  const motorcycle = Math.round(totalCount * (vehicleBreakdown.motorcycle / 100));
  remaining -= motorcycle;

  const car = Math.round(totalCount * (vehicleBreakdown.car / 100));
  remaining -= car;

  const truck = Math.round(totalCount * (vehicleBreakdown.truck / 100));
  remaining -= truck;

  const bus = remaining;

  return { motorcycle, car, truck, bus };
};

// Generate hourly data for a single day
const generateHourlyData = (dailyVolume, dayOfWeek, vehicleBreakdown) => {
  const hourlyData = [];
  let totalGenerated = 0;
  
  const hourlyPattern = getHourlyPatternForDay(dayOfWeek);

  // Calculate hourly targets based on M-curve pattern
  const hourlyTargets = Object.entries(hourlyPattern).map(([hour, pattern]) => ({
    hour: parseInt(hour),
    target: dailyVolume * pattern
  }));
  
  // Normalize to ensure exact daily total
  const totalTarget = hourlyTargets.reduce((sum, h) => sum + h.target, 0);
  hourlyTargets.forEach(h => {
    h.target = (h.target / totalTarget) * dailyVolume;
  });
  
  // Generate hourly data
  hourlyTargets.forEach(({ hour, target }) => {
    const volume = Math.round(target + (Math.random() - 0.5) * target * 0.1);
    const volumePercentage = volume / (dailyVolume / 24);
    const speed = getSpeedFromVolume(volumePercentage);
    
    hourlyData.push({
      hour,
      volume,
      speed: Math.round(speed * 10) / 10,
      vehicleTypes: splitIntoVehicleTypes(volume, vehicleBreakdown)
    });
    
    totalGenerated += volume;
  });
  
  // Adjust for rounding errors
  const diff = dailyVolume - totalGenerated;
  if (diff !== 0) {
    const maxHourIndex = hourlyData.reduce((maxIdx, h, idx, arr) => 
      h.volume > arr[maxIdx].volume ? idx : maxIdx, 0);
    hourlyData[maxHourIndex].volume += diff;
  }
  
  return hourlyData;
};

// Generate complete traffic dataset
export const generateTrafficData = (
  startDate,
  endDate,
  minVolume,
  maxVolume,
  vehicleBreakdown = DEFAULT_VEHICLE_BREAKDOWN
) => {
  const data = [];
  const min = Number(minVolume);
  const max = Number(maxVolume);
  const breakdown = {
    motorcycle: Number(vehicleBreakdown.motorcycle),
    car: Number(vehicleBreakdown.car),
    truck: Number(vehicleBreakdown.truck),
    bus: Number(vehicleBreakdown.bus),
  };
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = differenceInDays(end, start) + 1;
  
  for (let i = 0; i < days; i++) {
    const currentDate = addDays(start, i);
    const dayOfWeek = getDay(currentDate); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const dayFactor = getDayOfWeekVolumeFactor(dayOfWeek);
    const dailyVolume = (randomInRange(min, max) / days) * dayFactor;
    
    const hourlyData = generateHourlyData(Math.round(dailyVolume), dayOfWeek, breakdown);
    
    // Calculate daily aggregates
    const dailyTotal = hourlyData.reduce((sum, h) => sum + h.volume, 0);
    const dailyAvgSpeed = hourlyData.reduce((sum, h) => sum + h.speed, 0) / 24;
    const dailyVehicleTypes = hourlyData.reduce((acc, h) => ({
      motorcycle: acc.motorcycle + h.vehicleTypes.motorcycle,
      car: acc.car + h.vehicleTypes.car,
      truck: acc.truck + h.vehicleTypes.truck,
      bus: acc.bus + h.vehicleTypes.bus
    }), { motorcycle: 0, car: 0, truck: 0, bus: 0 });
    
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      dayOfWeek,
      isWeekend,
      dailyTotal: Math.round(dailyTotal),
      avgSpeed: Math.round(dailyAvgSpeed * 10) / 10,
      hourlyData,
      vehicleTypes: dailyVehicleTypes,
      sessionTime: Math.round(30 + Math.random() * 60) // Random session time 30-90 seconds
    });
  }
  
  return data;
};

// Calculate metrics from generated data
export const calculateMetrics = (data) => {
  const totalVehicle = data.reduce((sum, d) => sum + d.dailyTotal, 0);
  const avgCountPerDay = Math.round(totalVehicle / data.length);
  const peakCount = Math.max(...data.map(d => d.dailyTotal));
  const impressionMultiplier = 1.3 + Math.random() * 0.2;
  const estimatedImpression = Math.round(totalVehicle * impressionMultiplier);
  
  // Generate random percentage changes
  const generateChange = () => {
    const change = (Math.random() - 0.5) * 30;
    return {
      value: change.toFixed(2),
      isPositive: change >= 0
    };
  };
  
  return {
    totalVehicle,
    avgCountPerDay,
    peakCount,
    estimatedImpression,
    changes: {
      totalVehicle: generateChange(),
      avgCountPerDay: generateChange(),
      peakCount: generateChange(),
      estimatedImpression: generateChange()
    }
  };
};

// Aggregate data by day of week
export const aggregateByDayOfWeek = (data) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const aggregated = dayNames.map((day, index) => {
    const dayData = data.filter(d => d.dayOfWeek === index);
    if (dayData.length === 0) {
      return { day, total: 0, average: 0, count: 0 };
    }
    const total = dayData.reduce((sum, d) => sum + d.dailyTotal, 0);
    return {
      day,
      total: Math.round(total),
      average: Math.round(total / dayData.length),
      count: dayData.length
    };
  });
  return aggregated;
};

// Aggregate hourly data across all days
export const aggregateHourlyData = (data) => {
  const hourlyAggregates = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    totalVolume: 0,
    avgSpeed: 0,
    count: 0
  }));
  
  data.forEach(dayData => {
    dayData.hourlyData.forEach(hourData => {
      const agg = hourlyAggregates[hourData.hour];
      agg.totalVolume += hourData.volume;
      agg.avgSpeed += hourData.speed;
      agg.count += 1;
    });
  });
  
  return hourlyAggregates.map(h => ({
    hour: h.hour,
    avgVolume: Math.round(h.totalVolume / h.count),
    avgSpeed: Math.round((h.avgSpeed / h.count) * 10) / 10
  }));
};
