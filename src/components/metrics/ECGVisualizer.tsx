import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { COLORS } from '../../utils/constants';

interface ECGVisualizerProps {
  value: number;
  status: 'normal' | 'auto-fix' | 'alert' | 'emergency';
}

interface Point {
  x: number;
  y: number;
}

const ECGVisualizer: React.FC<ECGVisualizerProps> = ({ value, status }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  
  // Maximum number of points to display
  const MAX_POINTS = 100;
  
  // Generate an ECG-like waveform
  const generateECGPoint = (position: number, value: number): number => {
    const baseAmplitude = Math.min(Math.abs(value), 1); // Base height of the ECG wave
    const noiseLevel = 0.05; // Small noise to make it look more realistic
    
    // Add some randomness to simulate real ECG
    const noise = (Math.random() - 0.5) * noiseLevel;
    
    // Modifying the baseline based on the current value (from -1 to 1)
    const baseline = value * 0.3;
    
    // Create a periodic pattern with a QRS complex
    const period = 25; // Points per complete ECG cycle
    const pos = position % period;
    
    if (pos === 0) {
      return baseline + noise;
    } else if (pos === 10) {
      return baseline - baseAmplitude * 0.2 + noise;
    } else if (pos === 12) {
      return baseline + baseAmplitude + noise;
    } else if (pos === 14) {
      return baseline - baseAmplitude * 0.5 + noise;
    } else if (pos === 16) {
      return baseline + baseAmplitude * 0.3 + noise;
    } else if (pos > 16 && pos < 25) {
      // Add a small T wave
      const tWave = Math.sin((pos - 16) * Math.PI / 8) * baseAmplitude * 0.2;
      return baseline + tWave + noise;
    } else {
      return baseline + noise;
    }
  };
  
  // Animation loop
  const animate = (time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    
    const deltaTime = time - lastTimeRef.current;
    
    // Add new point every ~16ms (approx 60fps)
    if (deltaTime > 16) {
      lastTimeRef.current = time;
      
      const newY = generateECGPoint(positionRef.current, value);
      positionRef.current += 1;
      
      setPoints(prevPoints => {
        const newPoints = [...prevPoints, { x: prevPoints.length, y: newY }];
        
        // Remove points from the beginning if we have too many
        if (newPoints.length > MAX_POINTS) {
          return newPoints.slice(newPoints.length - MAX_POINTS);
        }
        
        return newPoints;
      });
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [value]);
  
  // Spring animation for line color based on status
  const { lineColor } = useSpring({
    lineColor: 
      status === 'normal' ? COLORS.normal :
      status === 'auto-fix' ? COLORS.autoFix :
      status === 'alert' ? COLORS.alert :
      COLORS.emergency,
    config: { duration: 300 }
  });
  
  // Calculate viewBox and draw the path
  const width = MAX_POINTS;
  const height = 2; // -1 to 1 range, so total height is 2
  const minY = -1;
  const maxY = 1;
  
  // Create SVG path from points
  const path = points.map((point, i) => {
    // Map points to SVG coordinates
    const x = point.x;
    const y = height - ((point.y - minY) / (maxY - minY)) * height;
    return (i === 0 ? 'M' : 'L') + `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-gray-700 mb-1">ECG Signal</div>
      <div className="w-full h-24 bg-gray-100 rounded-md relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-gray-300 border-dashed"></div>
        </div>
        
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          <animated.path
            d={path}
            fill="none"
            strokeWidth="0.05"
            stroke={lineColor}
          />
        </svg>
        
        <div className="absolute bottom-1 right-2 flex items-center">
          <span className="text-xs font-semibold" style={{ color: status === 'normal' ? COLORS.normal : COLORS.alert }}>
            {value.toFixed(2)} mV
          </span>
        </div>
      </div>
    </div>
  );
};

export default ECGVisualizer;