import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDevice } from '../context/DeviceContext';
import VentilatorCard from './VentilatorCard';
import DefibrillatorCard from './DefibrillatorCard';
import DiagnosticsPanel from './DiagnosticsPanel';
import { Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { ventilatorData, defibrillatorData, diagnosticMessages, isInitialized } = useDevice();
  const [showLoader, setShowLoader] = useState(true);
  
  // Fade in animation for dashboard
  const fadeIn = useSpring({
    opacity: isInitialized ? 1 : 0,
    transform: isInitialized ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });
  
  // Pulse animation for loader
  const pulse = useSpring({
    loop: true,
    from: { opacity: 0.6, scale: 0.9 },
    to: [
      { opacity: 1, scale: 1 },
      { opacity: 0.6, scale: 0.9 }
    ],
    config: { tension: 300, friction: 10 }
  });
  
  useEffect(() => {
    if (isInitialized) {
      // Hide loader after a short delay
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (showLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <animated.div
          style={pulse}
          className="flex flex-col items-center"
        >
          <Activity size={48} className="text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Initializing Medical Devices...</h2>
          <p className="text-gray-500 mt-2">Connecting to monitoring systems</p>
        </animated.div>
      </div>
    );
  }

  return (
    <animated.div style={fadeIn} className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ICU Device Monitoring</h1>
        <p className="text-gray-600">Real-time medical device status with self-healing capabilities</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ventilator */}
        <div className="lg:col-span-1">
          <VentilatorCard data={ventilatorData} />
        </div>
        
        {/* Middle: Defibrillator */}
        <div className="lg:col-span-1">
          <DefibrillatorCard data={defibrillatorData} />
        </div>
        
        {/* Right: Diagnostics Panel */}
        <div className="lg:col-span-1 h-full">
          <DiagnosticsPanel messages={diagnosticMessages} />
        </div>
      </div>
    </animated.div>
  );
};

export default Dashboard;