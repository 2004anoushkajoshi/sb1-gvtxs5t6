import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Scroll, AlertTriangle, CheckCircle, Wrench, ShieldAlert } from 'lucide-react';
import { DiagnosticMessage } from '../types';
import { COLORS } from '../utils/constants';

interface DiagnosticsPanelProps {
  messages: DiagnosticMessage[];
}

// Get icon for message based on status - moved outside components
const getStatusIcon = (status: 'normal' | 'auto-fix' | 'alert' | 'emergency') => {
  switch (status) {
    case 'normal':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'auto-fix':
      return <Wrench size={16} className="text-yellow-500" />;
    case 'alert':
      return <AlertTriangle size={16} className="text-orange-500" />;
    case 'emergency':
      return <ShieldAlert size={16} className="text-red-500" />;
    default:
      return <CheckCircle size={16} className="text-green-500" />;
  }
};

const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({ messages }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md w-full h-full">
      <div className="flex items-center mb-4">
        <Scroll size={24} className="text-blue-500 mr-2" />
        <h2 className="text-xl font-bold">Diagnostics</h2>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-2rem)] pr-2">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No diagnostic messages yet.</div>
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Individual message component with animations
const MessageItem: React.FC<{ message: DiagnosticMessage }> = ({ message }) => {
  const statusColorMap = {
    'normal': COLORS.normal,
    'auto-fix': COLORS.autoFix,
    'alert': COLORS.alert,
    'emergency': COLORS.emergency
  };
  
  // Entry animation for new messages
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  return (
    <animated.div 
      style={{
        ...springProps,
        borderLeftColor: statusColorMap[message.status],
        backgroundColor: `${statusColorMap[message.status]}10` // 10% opacity
      }}
      className="p-3 rounded-lg border-l-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {getStatusIcon(message.status)}
          <span className="ml-2 font-medium capitalize">
            {message.device}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-700">{message.message}</p>
    </animated.div>
  );
};

export default DiagnosticsPanel;