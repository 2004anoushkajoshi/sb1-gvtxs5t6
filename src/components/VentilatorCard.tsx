import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Thermometer, Gauge, Droplet, Activity } from 'lucide-react';
import { VentilatorData } from '../types';
import GaugeChart from './metrics/GaugeChart';
import StatusIndicator from './metrics/StatusIndicator';
import StatusBadge from './ui/StatusBadge';
import { 
  VENTILATOR_TEMP_RANGES,
  PRESSURE_RANGES, 
  OXYGEN_RANGES
} from '../utils/constants';

interface VentilatorCardProps {
  data: VentilatorData;
}

const VentilatorCard: React.FC<VentilatorCardProps> = ({ data }) => {
  // Determine card status - use the most severe status
  const getCardStatus = (): 'normal' | 'auto-fix' | 'alert' | 'emergency' => {
    if (data.temperature.status === 'emergency' || 
        data.pressure.status === 'emergency' || 
        data.oxygenLevel.status === 'emergency') {
      return 'emergency';
    } else if (data.temperature.status === 'alert' || 
              data.pressure.status === 'alert' || 
              data.oxygenLevel.status === 'alert' ||
              data.firmwareStatus === 'unresponsive') {
      return 'alert';
    } else if (data.temperature.status === 'auto-fix' || 
              data.pressure.status === 'auto-fix' || 
              data.oxygenLevel.status === 'auto-fix') {
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
          <Activity size={24} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Ventilator</h2>
        </div>
        <StatusBadge status={cardStatus} />
      </div>
      
      <div className="space-y-6">
        {/* Temperature */}
        <GaugeChart
          value={data.temperature.value}
          min={VENTILATOR_TEMP_RANGES.normal.min}
          max={VENTILATOR_TEMP_RANGES.critical.max}
          status={data.temperature.status}
          label="Temperature"
          unit="°C"
          icon={<Thermometer size={16} />}
          healing={data.temperature.status === 'auto-fix'}
        />
        
        {/* Pressure */}
        <GaugeChart
          value={data.pressure.value}
          min={PRESSURE_RANGES.normal.min}
          max={PRESSURE_RANGES.critical.max}
          status={data.pressure.status}
          label="Pressure"
          unit="cmH₂O"
          icon={<Gauge size={16} />}
          healing={data.pressure.status === 'auto-fix'}
        />
        
        {/* Oxygen Level */}
        <GaugeChart
          value={data.oxygenLevel.value}
          min={OXYGEN_RANGES.critical.min}
          max={OXYGEN_RANGES.normal.max}
          status={data.oxygenLevel.status}
          label="Oxygen Level"
          unit="%"
          icon={<Droplet size={16} />}
          healing={data.oxygenLevel.status === 'auto-fix'}
        />
        
        {/* Firmware Status */}
        <StatusIndicator
          status={data.firmwareStatus}
          label="Firmware Status"
        />
      </div>
    </animated.div>
  );
};

export default VentilatorCard;