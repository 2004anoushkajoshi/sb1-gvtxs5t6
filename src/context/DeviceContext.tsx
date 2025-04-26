import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VentilatorData, 
  DefibrillatorData, 
  DiagnosticMessage 
} from '../types';
import { 
  initializeVentilatorData, 
  initializeDefibrillatorData, 
  simulateVentilatorChanges, 
  simulateDefibrillatorChanges,
  generateDiagnosticMessages
} from '../utils/simulationUtils';
import { UPDATE_INTERVAL } from '../utils/constants';

interface DeviceContextType {
  ventilatorData: VentilatorData;
  defibrillatorData: DefibrillatorData;
  diagnosticMessages: DiagnosticMessage[];
  isInitialized: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ventilatorData, setVentilatorData] = useState<VentilatorData>(initializeVentilatorData());
  const [defibrillatorData, setDefibrillatorData] = useState<DefibrillatorData>(initializeDefibrillatorData());
  const [diagnosticMessages, setDiagnosticMessages] = useState<DiagnosticMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize with a slight delay to simulate loading
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(initTimeout);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const updateInterval = setInterval(() => {
      setVentilatorData(prevData => {
        const newData = simulateVentilatorChanges(prevData);
        return newData;
      });

      setDefibrillatorData(prevData => {
        const newData = simulateDefibrillatorChanges(prevData);
        return newData;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(updateInterval);
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    setDiagnosticMessages(prevMessages => {
      return generateDiagnosticMessages(ventilatorData, defibrillatorData, prevMessages);
    });
  }, [ventilatorData, defibrillatorData, isInitialized]);

  const value = {
    ventilatorData,
    defibrillatorData,
    diagnosticMessages,
    isInitialized
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};