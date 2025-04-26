import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Wrench } from 'lucide-react';
import { COLORS } from '../../utils/constants';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency';
  label: string;
  unit: string;
  icon?: React.ReactNode;
  healing?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  status,
  label,
  unit,
  icon,
  healing = false
}) => {
  const [prevValue, setPrevValue] = useState(value);
  
  // Calculate the percentage filled (0-100)
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Animated value transition and healing tool animation
  const springs = useSpring({
    displayValue: value,
    gaugePercentage: percentage,
    glowOpacity: healing ? 0.7 : 0,
    toolRotate: healing ? 360 : 0,
    toolScale: healing ? 1 : 0,
    from: { 
      displayValue: prevValue,
      gaugePercentage: ((prevValue - min) / (max - min)) * 100,
      glowOpacity: 0,
      toolRotate: 0,
      toolScale: 0
    },
    config: { tension: 120, friction: 14 }
  });
  
  useEffect(() => {
    setPrevValue(value);
  }, [value]);
  
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return COLORS.normal;
      case 'auto-fix': return COLORS.autoFix;
      case 'alert': return COLORS.alert;
      case 'emergency': return COLORS.emergency;
      default: return COLORS.normal;
    }
  };

  // Format the display value based on the unit type
  const formatValue = (val: number) => {
    return unit === 'mV' ? val.toFixed(2) : val.toFixed(1);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Label */}
      <div className="flex items-center mb-1">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      
      {/* Gauge container */}
      <div className="relative w-full h-10 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Healing glow effect */}
        {healing && (
          <animated.div 
            style={{ 
              opacity: springs.glowOpacity,
              boxShadow: `0 0 10px 3px ${getStatusColor()}`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              pointerEvents: 'none'
            }}
            className="rounded-full"
          />
        )}
        
        {/* Healing tool animation */}
        {healing && (
          <animated.div
            style={{
              position: 'absolute',
              right: '10px',
              top: '-20px',
              transform: springs.toolRotate.to(r => `rotate(${r}deg) scale(${springs.toolScale})`),
              zIndex: 2
            }}
          >
            <Wrench size={16} className="text-yellow-500" />
          </animated.div>
        )}
        
        {/* Gauge fill */}
        <animated.div
          style={{
            width: springs.gaugePercentage.to(p => `${p}%`),
            backgroundColor: getStatusColor(),
            transition: 'background-color 0.3s'
          }}
          className="h-full rounded-full"
        />
      </div>
      
      {/* Value display */}
      <div className="flex justify-between w-full mt-1">
        <span className="text-xs text-gray-500">{formatValue(min)} {unit}</span>
        <animated.span className="text-sm font-bold" style={{ color: getStatusColor() }}>
          {springs.displayValue.to(v => `${formatValue(v)} ${unit}`)}
        </animated.span>
        <span className="text-xs text-gray-500">{formatValue(max)} {unit}</span>
      </div>
    </div>
  );
};

export default GaugeChart;