import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveEvents } from '../utils/liveEvents';

/**
 * 3D Background Effects with Live Pulse Reactions
 * Creates floating geometric elements with parallax depth
 * and reactive animations to threat events
 */

// Glowing orbs with pulse - brighter and more visible
function GlowingOrbs({ pulseActive }) {
  const orbs = [
    { x: 15, y: 20, size: 400, color: 'rgba(34, 211, 238, 0.12)', delay: 0 },
    { x: 70, y: 55, size: 350, color: 'rgba(192, 132, 252, 0.10)', delay: 2 },
    { x: 45, y: 75, size: 280, color: 'rgba(129, 140, 248, 0.08)', delay: 4 },
    { x: 80, y: 25, size: 250, color: 'rgba(34, 211, 238, 0.08)', delay: 1 },
  ];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: pulseActive ? [1, 1.3, 1.1, 1] : [1, 1.2, 1],
            opacity: pulseActive ? [0.6, 1, 0.8, 0.6] : [0.6, 1, 0.6],
          }}
          transition={{
            duration: pulseActive ? 1.5 : 8 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

// Perspective grid - subtle but visible
function PerspectiveGrid() {
  const hLines = [2, 4, 6];
  const vLines = [2, 4, 6];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal lines with perspective - more visible */}
      {hLines.map((i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute w-full h-px"
          style={{
            top: `${i * 20}%`,
            background: `linear-gradient(90deg, transparent, rgba(34, 211, 238, ${0.06 + i * 0.02}), transparent)`,
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Vertical lines */}
      {vLines.map((i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute h-full w-px"
          style={{
            left: `${i * 20}%`,
            background: `linear-gradient(180deg, transparent, rgba(34, 211, 238, ${0.06 + i * 0.02}), transparent)`,
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// Floating particles - more visible
function FloatingParticles({ pulseActive }) {
  const particles = Array.from({ length: 25 });
  const colors = [
    'rgba(34, 211, 238, 0.6)',   // cyan - brighter
    'rgba(129, 140, 248, 0.5)', // indigo  
    'rgba(192, 132, 252, 0.5)', // purple
    'rgba(52, 211, 153, 0.5)', // emerald
  ];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => {
        const size = 2 + Math.random() * 3;
        const x = 5 + Math.random() * 90;
        const y = 5 + Math.random() * 90;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 4;
        const duration = 5 + Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: pulseActive ? [0, -25 - Math.random() * 30, 0] : [0, -15 - Math.random() * 20, 0],
              opacity: pulseActive ? [0.3, 0.9, 0.5, 0.3] : [0.3, 0.7, 0.3],
              scale: pulseActive ? [1, 1.5, 1] : [1, 1.3, 1],
            }}
            transition={{
              duration: pulseActive ? duration * 0.7 : duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }}
          />
        );
      })}
    </div>
  );
}

// Animated scan lines - more visible
function ScanLines({ pulseActive }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        animate={{
          top: ['-2%', '102%'],
          opacity: pulseActive ? [0.3, 1, 0.3] : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: pulseActive ? 5 : 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent"
        animate={{
          top: ['-2%', '102%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      />
    </div>
  );
}

// Threat pulse wave overlay
function ThreatPulseOverlay({ active, severity }) {
  if (!active) return null;
  
  const color = severity === 'critical' ? 'rgba(244, 63, 94, 0.15)' : 
               severity === 'high' ? 'rgba(251, 191, 36, 0.1)' : 
               'rgba(34, 211, 238, 0.08)';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 pointer-events-none"
      style={{ background: color }}
    />
  );
}

// Main 3D Background Component - fixed with proper z-index
export function Background3D() {
  const [pulseActive, setPulseActive] = useState(false);
  const [lastPulse, setLastPulse] = useState(null);
  const liveEvents = useLiveEvents.getState();
  
  // Subscribe to pulse events
  useEffect(() => {
    if (!liveEvents) return;
    
    const unsubscribe = liveEvents.subscribe('onPulse', (pulse) => {
      if (pulse.type === 'threat' && (pulse.severity === 'critical' || pulse.severity === 'high')) {
        setPulseActive(true);
        setLastPulse(pulse);
        
        // Reset after animation
        setTimeout(() => {
          setPulseActive(false);
        }, 1500);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <motion.div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-[0]" 
      style={{ zIndex: 0 }}
    >
      {/* Threat pulse overlay */}
      <ThreatPulseOverlay active={pulseActive} severity={lastPulse?.severity} />
      
      {/* Glowing gradient orbs - most visible layer */}
      <GlowingOrbs pulseActive={pulseActive} />
      
      {/* Floating particles */}
      <FloatingParticles pulseActive={pulseActive} />
      
      {/* Perspective grid */}
      <PerspectiveGrid />
      
      {/* Scan line effect */}
      <ScanLines pulseActive={pulseActive} />
      
      {/* Vignette overlay for depth - subtle */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 15, 28, 0.4) 100%)',
        }}
      />
    </motion.div>
  );
}

export default Background3D;
