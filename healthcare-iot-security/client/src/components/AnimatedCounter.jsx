import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function AnimatedCounter({ value, duration = 1400, decimals = 0, prefix = '', suffix = '' }) {
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });
  
  const display = useTransform(springValue, (current) => {
    const num = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
    return `${prefix}${num}${suffix}`;
  });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);
  
  return <motion.span>{display}</motion.span>;
}

// Simple counter for stat cards
export function StatCounter({ value, duration = 1400, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  
  useEffect(() => {
    startTime.current = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay(decimals > 0 ? current : Math.round(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration, decimals]);
  
  return <>{decimals > 0 ? display.toFixed(decimals) : display}</>;
}

// Counter with shimmer effect
export function ShimmerCounter({ value, decimals = 0, className = '' }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(value);
  
  useEffect(() => {
    if (value !== prevValue.current) {
      setIsUpdating(true);
      startAnimation();
      prevValue.current = value;
    }
  }, [value]);
  
  const startAnimation = () => {
    const start = displayValue;
    const diff = value - start;
    const duration = 600;
    const t0 = performance.now();
    
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(start + diff * eased);
      
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setIsUpdating(false);
      }
    };
    requestAnimationFrame(step);
  };
  
  return (
    <span className={className}>
      <span className={isUpdating ? 'text-primary animate-pulse' : ''}>
        {decimals > 0 ? displayValue.toFixed(decimals) : displayValue}
      </span>
    </span>
  );
}

// Live Counter - animates smoothly when value changes with spring physics
export function LiveCounter({ value, decimals = 0, duration = 800 }) {
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 15,
    mass: 1,
  });
  
  const display = useTransform(springValue, (current) => {
    const num = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
    return num;
  });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);
  
  return (
    <motion.span 
      className="tabular-nums"
      style={{ display: 'inline-block', minWidth: '3ch' }}
    >
      {display}
    </motion.span>
  );
}
