export interface MetricValue {
  value: number;
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency';
  timestamp: number;
}

export interface VentilatorData {
  temperature: MetricValue;
  pressure: MetricValue;
  oxygenLevel: MetricValue;
  firmwareStatus: 'responsive' | 'unresponsive';
}

export interface DefibrillatorData {
  batteryVoltage: MetricValue;
  ecgSignal: MetricValue;
  temperature: MetricValue;
  capacitorReadiness: 'ready' | 'not-ready';
}

export interface DiagnosticMessage {
  id: string;
  timestamp: number;
  device: 'ventilator' | 'defibrillator';
  metric: string;
  message: string;
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency';
}

export type DeviceType = 'ventilator' | 'defibrillator';