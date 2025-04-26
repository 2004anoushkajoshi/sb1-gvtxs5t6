import React from 'react';
import { useSpring, animated } from 'react-spring';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { COLORS } from '../../utils/constants';

interface StatusIndicatorProps {
  status: 'responsive' | 'unresponsive' | 'ready' | 'not-ready';
  label: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const isPositive = status === 'responsive' || status === 'ready';
  
  const springs = useSpring({
    from: { scale: 1 },
    to: [
      { scale: isPositive ? 1 : 0.95 },
      { scale: isPositive ? 1 : 1.05 },
      { scale: 1 }
    ],
    loop: !isPositive,
    config: { tension: 300, friction: 10 }
  });

  const getStatusInfo = () => {
    switch (status) {
      case 'responsive':
        return { 
          color: COLORS.normal, 
          icon: <CheckCircle size={20} />, 
          text: 'Responsive' 
        };
      case 'unresponsive':
        return { 
          color: COLORS.alert, 
          icon: <AlertTriangle size={20} />, 
          text: 'Unresponsive' 
        };
      case 'ready':
        return { 
          color: COLORS.normal, 
          icon: <CheckCircle size={20} />, 
          text: 'Ready' 
        };
      case 'not-ready':
        return { 
          color: COLORS.alert, 
          icon: <XCircle size={20} />, 
          text: 'Not Ready' 
        };
      default:
        return { 
          color: COLORS.normal, 
          icon: <Activity size={20} />, 
          text: 'Unknown' 
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex flex-col items-center space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <animated.div 
        style={{
          ...springs,
          color: statusInfo.color,
          backgroundColor: `${statusInfo.color}10`, // 10% opacity of status color
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-md"
      >
        {statusInfo.icon}
        <span className="text-sm font-medium">{statusInfo.text}</span>
      </animated.div>
    </div>
  );
};

export default StatusIndicator;