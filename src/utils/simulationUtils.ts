import { v4 as uuidv4 } from 'uuid';
import {
  VENTILATOR_TEMP_RANGES,
  DEFIBRILLATOR_TEMP_RANGES,
  PRESSURE_RANGES,
  OXYGEN_RANGES,
  BATTERY_RANGES,
  ECG_RANGES,
  HEALING_DURATION
} from './constants';
import { 
  MetricValue, 
  VentilatorData, 
  DefibrillatorData, 
  DiagnosticMessage 
} from '../types';

// Helper function to get a random value within a range
export const getRandomValue = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Helper function to gradually change a value (for realistic transitions)
export const getGradualChange = (
  currentValue: number, 
  targetValue: number, 
  step: number = 0.1
): number => {
  if (Math.abs(currentValue - targetValue) < step) {
    return targetValue;
  }
  
  return currentValue + (targetValue > currentValue ? step : -step);
};

// Determine metric status based on value and ranges
export const determineStatus = (
  value: number,
  normalRange: { min: number; max: number },
  warningRange: { min: number; max: number },
  criticalRange: { min: number; max: number }
): 'normal' | 'auto-fix' | 'alert' | 'emergency' => {
  if (value >= normalRange.min && value <= normalRange.max) {
    return 'normal';
  } else if (
    (value >= warningRange.min && value <= warningRange.max) ||
    (value >= criticalRange.min && value <= normalRange.min)
  ) {
    return Math.random() > 0.3 ? 'auto-fix' : 'alert';
  } else {
    return 'emergency';
  }
};

// Initialize random ventilator data
export const initializeVentilatorData = (): VentilatorData => {
  const tempValue = getRandomValue(
    VENTILATOR_TEMP_RANGES.normal.min,
    VENTILATOR_TEMP_RANGES.normal.max
  );
  
  const pressureValue = getRandomValue(
    PRESSURE_RANGES.normal.min,
    PRESSURE_RANGES.normal.max
  );
  
  const oxygenValue = getRandomValue(
    OXYGEN_RANGES.normal.min,
    OXYGEN_RANGES.normal.max
  );

  return {
    temperature: {
      value: tempValue,
      status: 'normal',
      timestamp: Date.now()
    },
    pressure: {
      value: pressureValue,
      status: 'normal',
      timestamp: Date.now()
    },
    oxygenLevel: {
      value: oxygenValue,
      status: 'normal',
      timestamp: Date.now()
    },
    firmwareStatus: Math.random() > 0.9 ? 'unresponsive' : 'responsive'
  };
};

// Initialize random defibrillator data
export const initializeDefibrillatorData = (): DefibrillatorData => {
  const batteryValue = getRandomValue(
    BATTERY_RANGES.normal.min,
    BATTERY_RANGES.normal.max
  );
  
  const ecgValue = getRandomValue(
    ECG_RANGES.normal.min,
    ECG_RANGES.normal.max
  );
  
  const tempValue = getRandomValue(
    DEFIBRILLATOR_TEMP_RANGES.normal.min,
    DEFIBRILLATOR_TEMP_RANGES.normal.max
  );

  return {
    batteryVoltage: {
      value: batteryValue,
      status: 'normal',
      timestamp: Date.now()
    },
    ecgSignal: {
      value: ecgValue,
      status: 'normal',
      timestamp: Date.now()
    },
    temperature: {
      value: tempValue,
      status: 'normal',
      timestamp: Date.now()
    },
    capacitorReadiness: Math.random() > 0.9 ? 'not-ready' : 'ready'
  };
};

// Self-healing logic for ventilator
export const healVentilator = (data: VentilatorData): VentilatorData => {
  const now = Date.now();
  const newData = { ...data };
  
  // Handle temperature healing
  if (data.temperature.status === 'auto-fix') {
    const elapsed = now - data.temperature.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetTemp = getRandomValue(
      VENTILATOR_TEMP_RANGES.normal.min + 2,
      VENTILATOR_TEMP_RANGES.normal.max - 2
    );
    
    newData.temperature = {
      value: data.temperature.value + (targetTemp - data.temperature.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.temperature.timestamp
    };
  }
  
  // Handle pressure healing
  if (data.pressure.status === 'auto-fix') {
    const elapsed = now - data.pressure.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetPressure = getRandomValue(
      PRESSURE_RANGES.normal.min + 5,
      PRESSURE_RANGES.normal.max - 5
    );
    
    newData.pressure = {
      value: data.pressure.value + (targetPressure - data.pressure.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.pressure.timestamp
    };
  }
  
  // Handle oxygen level healing
  if (data.oxygenLevel.status === 'auto-fix') {
    const elapsed = now - data.oxygenLevel.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetOxygen = getRandomValue(
      OXYGEN_RANGES.normal.min + 2,
      OXYGEN_RANGES.normal.max - 2
    );
    
    newData.oxygenLevel = {
      value: data.oxygenLevel.value + (targetOxygen - data.oxygenLevel.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.oxygenLevel.timestamp
    };
  }
  
  return newData;
};

// Self-healing logic for defibrillator
export const healDefibrillator = (data: DefibrillatorData): DefibrillatorData => {
  const now = Date.now();
  const newData = { ...data };
  
  // Handle battery voltage healing
  if (data.batteryVoltage.status === 'auto-fix') {
    const elapsed = now - data.batteryVoltage.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetVoltage = getRandomValue(
      BATTERY_RANGES.normal.min + 0.5,
      BATTERY_RANGES.normal.max - 0.5
    );
    
    newData.batteryVoltage = {
      value: data.batteryVoltage.value + (targetVoltage - data.batteryVoltage.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.batteryVoltage.timestamp
    };
  }
  
  // Handle ECG signal healing
  if (data.ecgSignal.status === 'auto-fix') {
    const elapsed = now - data.ecgSignal.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetECG = getRandomValue(
      ECG_RANGES.normal.min + 0.2,
      ECG_RANGES.normal.max - 0.2
    );
    
    newData.ecgSignal = {
      value: data.ecgSignal.value + (targetECG - data.ecgSignal.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.ecgSignal.timestamp
    };
  }
  
  // Handle temperature healing
  if (data.temperature.status === 'auto-fix') {
    const elapsed = now - data.temperature.timestamp;
    const progress = Math.min(1, elapsed / HEALING_DURATION);
    
    // Gradually move toward normal range
    const targetTemp = getRandomValue(
      DEFIBRILLATOR_TEMP_RANGES.normal.min + 2,
      DEFIBRILLATOR_TEMP_RANGES.normal.max - 2
    );
    
    newData.temperature = {
      value: data.temperature.value + (targetTemp - data.temperature.value) * progress,
      status: progress >= 1 ? 'normal' : 'auto-fix',
      timestamp: progress >= 1 ? now : data.temperature.timestamp
    };
  }
  
  return newData;
};

// Simulate ventilator data changes
export const simulateVentilatorChanges = (data: VentilatorData): VentilatorData => {
  // Apply self-healing if needed
  const healedData = healVentilator(data);
  
  // Create random fluctuations
  const newTemp = healedData.temperature.status === 'auto-fix' 
    ? healedData.temperature.value 
    : healedData.temperature.value + getRandomValue(-1, 1);
  
  const newPressure = healedData.pressure.status === 'auto-fix'
    ? healedData.pressure.value
    : healedData.pressure.value + getRandomValue(-2, 2);
  
  const newOxygen = healedData.oxygenLevel.status === 'auto-fix'
    ? healedData.oxygenLevel.value
    : healedData.oxygenLevel.value + getRandomValue(-1, 1);
  
  // Determine status for each metric
  const tempStatus = determineStatus(
    newTemp,
    VENTILATOR_TEMP_RANGES.normal,
    VENTILATOR_TEMP_RANGES.warning,
    VENTILATOR_TEMP_RANGES.critical
  );
  
  const pressureStatus = determineStatus(
    newPressure,
    PRESSURE_RANGES.normal,
    PRESSURE_RANGES.warning,
    PRESSURE_RANGES.critical
  );
  
  const oxygenStatus = determineStatus(
    newOxygen,
    OXYGEN_RANGES.normal,
    OXYGEN_RANGES.warning,
    OXYGEN_RANGES.critical
  );
  
  // Update timestamps for metrics that changed status
  const now = Date.now();
  
  return {
    temperature: {
      value: newTemp,
      status: tempStatus,
      timestamp: tempStatus !== healedData.temperature.status ? now : healedData.temperature.timestamp
    },
    pressure: {
      value: newPressure,
      status: pressureStatus,
      timestamp: pressureStatus !== healedData.pressure.status ? now : healedData.pressure.timestamp
    },
    oxygenLevel: {
      value: newOxygen,
      status: oxygenStatus,
      timestamp: oxygenStatus !== healedData.oxygenLevel.status ? now : healedData.oxygenLevel.timestamp
    },
    firmwareStatus: Math.random() > 0.95 ? (healedData.firmwareStatus === 'responsive' ? 'unresponsive' : 'responsive') : healedData.firmwareStatus
  };
};

// Simulate defibrillator data changes
export const simulateDefibrillatorChanges = (data: DefibrillatorData): DefibrillatorData => {
  // Apply self-healing if needed
  const healedData = healDefibrillator(data);
  
  // Create random fluctuations
  const newVoltage = healedData.batteryVoltage.status === 'auto-fix'
    ? healedData.batteryVoltage.value
    : healedData.batteryVoltage.value + getRandomValue(-0.2, 0.2);
  
  const newECG = healedData.ecgSignal.status === 'auto-fix'
    ? healedData.ecgSignal.value
    : healedData.ecgSignal.value + getRandomValue(-0.3, 0.3);
  
  const newTemp = healedData.temperature.status === 'auto-fix'
    ? healedData.temperature.value
    : healedData.temperature.value + getRandomValue(-1, 1);
  
  // Determine status for each metric
  const voltageStatus = determineStatus(
    newVoltage,
    BATTERY_RANGES.normal,
    BATTERY_RANGES.warning,
    BATTERY_RANGES.critical
  );
  
  const ecgStatus = determineStatus(
    Math.abs(newECG),
    ECG_RANGES.normal,
    ECG_RANGES.warning,
    ECG_RANGES.critical
  );
  
  const tempStatus = determineStatus(
    newTemp,
    DEFIBRILLATOR_TEMP_RANGES.normal,
    DEFIBRILLATOR_TEMP_RANGES.warning,
    DEFIBRILLATOR_TEMP_RANGES.critical
  );
  
  // Update timestamps for metrics that changed status
  const now = Date.now();
  
  return {
    batteryVoltage: {
      value: newVoltage,
      status: voltageStatus,
      timestamp: voltageStatus !== healedData.batteryVoltage.status ? now : healedData.batteryVoltage.timestamp
    },
    ecgSignal: {
      value: newECG,
      status: ecgStatus,
      timestamp: ecgStatus !== healedData.ecgSignal.status ? now : healedData.ecgSignal.timestamp
    },
    temperature: {
      value: newTemp,
      status: tempStatus,
      timestamp: tempStatus !== healedData.temperature.status ? now : healedData.temperature.timestamp
    },
    capacitorReadiness: Math.random() > 0.95 ? (healedData.capacitorReadiness === 'ready' ? 'not-ready' : 'ready') : healedData.capacitorReadiness
  };
};

// Generate diagnostic messages based on device data
export const generateDiagnosticMessages = (
  ventilatorData: VentilatorData,
  defibrillatorData: DefibrillatorData,
  previousMessages: DiagnosticMessage[] = []
): DiagnosticMessage[] => {
  const newMessages: DiagnosticMessage[] = [];
  const now = Date.now();
  
  // Check ventilator metrics
  if (ventilatorData.temperature.status !== 'normal') {
    const message = getStatusMessage('ventilator', 'temperature', ventilatorData.temperature.status, ventilatorData.temperature.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'ventilator',
      metric: 'temperature',
      message,
      status: ventilatorData.temperature.status
    });
  }
  
  if (ventilatorData.pressure.status !== 'normal') {
    const message = getStatusMessage('ventilator', 'pressure', ventilatorData.pressure.status, ventilatorData.pressure.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'ventilator',
      metric: 'pressure',
      message,
      status: ventilatorData.pressure.status
    });
  }
  
  if (ventilatorData.oxygenLevel.status !== 'normal') {
    const message = getStatusMessage('ventilator', 'oxygenLevel', ventilatorData.oxygenLevel.status, ventilatorData.oxygenLevel.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'ventilator',
      metric: 'oxygenLevel',
      message,
      status: ventilatorData.oxygenLevel.status
    });
  }
  
  if (ventilatorData.firmwareStatus === 'unresponsive') {
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'ventilator',
      metric: 'firmware',
      message: 'Ventilator firmware is unresponsive. System attempting to restart service.',
      status: 'alert'
    });
  }
  
  // Check defibrillator metrics
  if (defibrillatorData.batteryVoltage.status !== 'normal') {
    const message = getStatusMessage('defibrillator', 'batteryVoltage', defibrillatorData.batteryVoltage.status, defibrillatorData.batteryVoltage.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'defibrillator',
      metric: 'batteryVoltage',
      message,
      status: defibrillatorData.batteryVoltage.status
    });
  }
  
  if (defibrillatorData.ecgSignal.status !== 'normal') {
    const message = getStatusMessage('defibrillator', 'ecgSignal', defibrillatorData.ecgSignal.status, defibrillatorData.ecgSignal.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'defibrillator',
      metric: 'ecgSignal',
      message,
      status: defibrillatorData.ecgSignal.status
    });
  }
  
  if (defibrillatorData.temperature.status !== 'normal') {
    const message = getStatusMessage('defibrillator', 'temperature', defibrillatorData.temperature.status, defibrillatorData.temperature.value);
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'defibrillator',
      metric: 'temperature',
      message,
      status: defibrillatorData.temperature.status
    });
  }
  
  if (defibrillatorData.capacitorReadiness === 'not-ready') {
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: 'defibrillator',
      metric: 'capacitor',
      message: 'Defibrillator capacitor is not ready. System charging capacitor bank.',
      status: 'alert'
    });
  }
  
  // Add normal status messages occasionally
  if (Math.random() > 0.7) {
    newMessages.push({
      id: uuidv4(),
      timestamp: now,
      device: Math.random() > 0.5 ? 'ventilator' : 'defibrillator',
      metric: 'system',
      message: 'All systems operating within normal parameters.',
      status: 'normal'
    });
  }
  
  // Combine with previous messages, keeping only the latest 20
  return [...newMessages, ...previousMessages].slice(0, 20);
};

// Helper function to generate status messages
const getStatusMessage = (
  device: 'ventilator' | 'defibrillator',
  metric: string,
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency',
  value: number
): string => {
  const deviceName = device.charAt(0).toUpperCase() + device.slice(1);
  
  switch (metric) {
    case 'temperature':
      if (status === 'auto-fix') {
        return `${deviceName} temperature at ${value.toFixed(1)}°C. Activating cooling system.`;
      } else if (status === 'alert') {
        return `${deviceName} temperature alert: ${value.toFixed(1)}°C. Technician assistance needed.`;
      } else {
        return `${deviceName} temperature critical: ${value.toFixed(1)}°C. Emergency protocols engaged.`;
      }
    
    case 'pressure':
      if (status === 'auto-fix') {
        return `Ventilator pressure at ${value.toFixed(1)} cmH₂O. Adjusting regulator.`;
      } else if (status === 'alert') {
        return `Ventilator pressure alert: ${value.toFixed(1)} cmH₂O. Verify patient circuit.`;
      } else {
        return `Ventilator pressure critical: ${value.toFixed(1)} cmH₂O. Emergency shutdown initiated.`;
      }
    
    case 'oxygenLevel':
      if (status === 'auto-fix') {
        return `Oxygen level at ${value.toFixed(1)}%. Optimizing oxygen delivery.`;
      } else if (status === 'alert') {
        return `Oxygen level alert: ${value.toFixed(1)}%. Verify oxygen source.`;
      } else {
        return `Oxygen level critical: ${value.toFixed(1)}%. Emergency backup engaged.`;
      }
    
    case 'batteryVoltage':
      if (status === 'auto-fix') {
        return `Defibrillator battery at ${value.toFixed(1)}V. Activating power saving mode.`;
      } else if (status === 'alert') {
        return `Defibrillator battery alert: ${value.toFixed(1)}V. Connect to external power.`;
      } else {
        return `Defibrillator battery critical: ${value.toFixed(1)}V. Switching to emergency backup.`;
      }
    
    case 'ecgSignal':
      if (status === 'auto-fix') {
        return `ECG signal variation at ${Math.abs(value).toFixed(2)} mV. Recalibrating sensors.`;
      } else if (status === 'alert') {
        return `ECG signal alert: ${Math.abs(value).toFixed(2)} mV. Check electrode placement.`;
      } else {
        return `ECG signal critical: ${Math.abs(value).toFixed(2)} mV. Signal integrity compromised.`;
      }
    
    default:
      return `${deviceName} ${metric} issue detected. Status: ${status}.`;
  }
};