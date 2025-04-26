// Temperature ranges (in Celsius)
export const VENTILATOR_TEMP_RANGES = {
  normal: { min: 20, max: 38 },
  warning: { min: 38, max: 40 },
  critical: { min: 40, max: 50 }
};

export const DEFIBRILLATOR_TEMP_RANGES = {
  normal: { min: 20, max: 40 },
  warning: { min: 40, max: 45 },
  critical: { min: 45, max: 55 }
};

// Pressure ranges (in cmH₂O)
export const PRESSURE_RANGES = {
  normal: { min: 5, max: 35 },
  warning: { min: 35, max: 40 },
  critical: { min: 40, max: 50 }
};

// Oxygen level ranges (in %)
export const OXYGEN_RANGES = {
  critical: { min: 0, max: 85 },
  warning: { min: 85, max: 90 },
  normal: { min: 90, max: 100 }
};

// Battery voltage ranges (in V)
export const BATTERY_RANGES = {
  critical: { min: 0, max: 10 },
  warning: { min: 10, max: 11 },
  normal: { min: 11, max: 14 }
};

// ECG signal ranges (in mV)
export const ECG_RANGES = {
  normal: { min: -1, max: 1 },
  warning: { min: -1.5, max: 1.5 },
  critical: { min: -2, max: 2 }
};

// Color schemes
export const COLORS = {
  normal: '#48BB78',   // Green
  autoFix: '#ECC94B',  // Yellow
  alert: '#ED8936',    // Orange
  emergency: '#F56565', // Red
  primary: '#4299E1',  // Blue
  secondary: '#4FD1C5', // Teal
  background: '#F7FAFC',
  card: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096'
};

// Update interval in milliseconds
export const UPDATE_INTERVAL = 6000; // 6 seconds

// Self-healing duration in milliseconds
export const HEALING_DURATION = 30000; // 30 seconds