import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Battery, Thermometer, Zap } from 'lucide-react';
import { DefibrillatorData } from '../types';
import GaugeChart from './metrics/GaugeChart';
import StatusIndicator from './metrics/StatusIndicator';
import StatusBadge from './ui/StatusBadge';
import ECGVisualizer from './metrics/ECGVisualizer';
import { 
  DEFIBRILLATOR_TEMP_RANGES,
  BATTERY_RANGES
} from '../utils/constants';

interface DefibrillatorCardProps {
  data: DefibrillatorData;
}

const DefibrillatorCard: React.FC<DefibrillatorCardProps> = ({ data }) => {
  // Determine card status - use the most severe status
  const getCardStatus = (): 'normal' | 'auto-fix' | 'alert' | 'emergency' => {
    if (data.batteryVoltage.status === 'emergency' || 
        data.ecgSignal.status === 'emergency' || 
        data.temperature.status === 'emergency') {
      return 'emergency';
    } else if (data.batteryVoltage.status === 'alert' || 
              data.ecgSignal.status === 'alert' || 
              data.temperature.status === 'alert' ||
              data.capacitorReadiness === 'not-ready') {
      return 'alert';
    } else if (data.batteryVoltage.status === 'auto-fix' || 
              data.ecgSignal.status === 'auto-fix' || 
              data.temperature.status === 'auto-fix') {
      return 'auto-fix';
    } else {
      return 'normal';
    }
  };
  
  const cardStatus = getCardStatus();
  
  // Animate card border based on status
  const { boxShadow } = useSpring({
    boxShadow: 
      cardStatus === 'emergency' ? '0 0 0 2px #F56565, 0 4px 12px rgba(245, 101, 101, 0.4)' :
      cardStatus === 'alert' ? '0 0 0 2px #ED8936, 0 4px 12px rgba(237, 137, 54, 0.2)' :
      cardStatus === 'auto-fix' ? '0 0 0 2px #ECC94B, 0 4px 12px rgba(236, 201, 75, 0.2)' :
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1)',
    config: { tension: 180, friction: 12 }
  });

  return (
    <animated.div
      style={{ boxShadow }}
      className="bg-white rounded-xl p-5 w-full transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Zap size={24} className="text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Defibrillator</h2>
        </div>
        <StatusBadge status={cardStatus} />
      </div>
      
      <div className="space-y-6">
        {/* Battery Voltage */}
        <GaugeChart
          value={data.batteryVoltage.value}
          min={BATTERY_RANGES.critical.min}
          max={BATTERY_RANGES.normal.max}
          status={data.batteryVoltage.status}
          label="Battery Voltage"
          unit="V"
          icon={<Battery size={16} />}
          healing={data.batteryVoltage.status === 'auto-fix'}
        />
        
        {/* ECG Signal */}
        <ECGVisualizer 
          value={data.ecgSignal.value}
          status={data.ecgSignal.status}
        />
        
        {/* Temperature */}
        <GaugeChart
          value={data.temperature.value}
          min={DEFIBRILLATOR_TEMP_RANGES.normal.min}
          max={DEFIBRILLATOR_TEMP_RANGES.critical.max}
          status={data.temperature.status}
          label="Device Temperature"
          unit="°C"
          icon={<Thermometer size={16} />}
          healing={data.temperature.status === 'auto-fix'}
        />
        
        {/* Capacitor Readiness */}
        <StatusIndicator
          status={data.capacitorReadiness}
          label="Capacitor Readiness"
        />
      </div>
    </animated.div>
  );
};

export default DefibrillatorCard;