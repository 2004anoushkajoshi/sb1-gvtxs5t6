import React from 'react';
import { useSpring, animated } from 'react-spring';
import { COLORS } from '../../utils/constants';

interface StatusBadgeProps {
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusMap = {
    'normal': { text: 'Normal', color: COLORS.normal },
    'auto-fix': { text: 'Auto-Fix', color: COLORS.autoFix },
    'alert': { text: 'Alert', color: COLORS.alert },
    'emergency': { text: 'Emergency', color: COLORS.emergency }
  };

  const springs = useSpring({
    from: { opacity: 0.7, scale: 0.95 },
    to: [
      { opacity: 1, scale: 1 },
      { opacity: status === 'emergency' || status === 'alert' ? 0.8 : 1, scale: status === 'emergency' ? 0.97 : 1 },
      { opacity: 1, scale: 1 }
    ],
    loop: status === 'emergency' || status === 'alert',
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.div
      style={{
        ...springs,
        backgroundColor: statusMap[status].color,
      }}
      className={`px-2 py-1 rounded-md text-white text-xs font-medium inline-flex items-center justify-center ${className}`}
    >
      {statusMap[status].text}
    </animated.div>
  );
};

export default StatusBadge;