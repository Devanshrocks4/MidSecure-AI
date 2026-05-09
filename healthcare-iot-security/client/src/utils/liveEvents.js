// Real-Time Event Engine
// Centralized live data management for synchronized dashboard
// Uses Zustand for state management with event-driven architecture

import { create } from 'zustand';
import React from 'react';

// Threat types with severity levels
const THREAT_TYPES = [
  { type: 'Reconnaissance', threatType: 'Port Scan', severity: 'medium', severityScore: 0.5 },
  { type: 'Reconnaissance', threatType: 'Banner Grab', severity: 'low', severityScore: 0.3 },
  { type: 'Denial of Service', threatType: 'SYN Flood', severity: 'critical', severityScore: 1.0 },
  { type: 'Denial of Service', threatType: 'UDP Flood', severity: 'high', severityScore: 0.8 },
  { type: 'Data Exfiltration', threatType: 'Anomalous Outbound', severity: 'high', severityScore: 0.85 },
  { type: 'Data Exfiltration', threatType: 'DNS Tunneling', severity: 'critical', severityScore: 0.95 },
  { type: 'Brute Force Auth', threatType: 'Credential Stuffing', severity: 'medium', severityScore: 0.55 },
  { type: 'Brute Force Auth', threatType: 'Dictionary Attack', severity: 'high', severityScore: 0.7 },
  { type: 'Malware Beacon', threatType: 'C2 Beaconing', severity: 'critical', severityScore: 1.0 },
  { type: 'SQL Injection', threatType: 'Web Attack', severity: 'high', severityScore: 0.75 },
];

// Hospital device zones for targeting
const ZONES = ['ICU', 'Operating Theatres', 'Emergency', 'General Wards', 'Cardiology', 'Imaging'];

// Generate random IP
function randomIp() {
  return `198.51.100.${Math.floor(Math.random() * 255)}`;
}

// Generate random device ID
function randomDeviceId(devices) {
  if (!devices || devices.length === 0) return 'unknown';
  return devices[Math.floor(Math.random() * devices.length)].id;
}

// Generate random threat
function generateThreat(devices = []) {
  const threatTemplate = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
  return {
    id: `thr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    type: threatTemplate.type,
    threatType: threatTemplate.threatType,
    severity: threatTemplate.severity,
    severityScore: threatTemplate.severityScore,
    status: 'open',
    deviceId: randomDeviceId(devices),
    srcIp: randomIp(),
    zone: ZONES[Math.floor(Math.random() * ZONES.length)],
    detectionTime: new Date().toISOString(),
    confidence: 0.6 + Math.random() * 0.39,
  };
}

// Generate network traffic data point
function generateTrafficData(prevData = []) {
  const baseTime = prevData.length > 0 
    ? new Date(prevData[prevData.length - 1].timestamp + 5000)
    : new Date();
  
  return {
    timestamp: baseTime.getTime(),
    time: `${Math.floor((Date.now() - baseTime.getTime()) / 60000)}m ago`,
    benign: 380 + Math.random() * 80,
    recon: 4 + Math.random() * 12,
    dos: Math.random() * 6,
    exfil: Math.random() * 4,
    total: 0,
  };
}

// Generate packet activity
function generatePacketActivity() {
  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'TLS'];
  const directions = ['inbound', 'outbound'];
  const statuses = ['encrypted', 'trusted', 'flagged', 'blocked'];
  
  return {
    id: `pkt-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 4)}`,
    timestamp: Date.now(),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    srcIp: randomIp(),
    dstIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    port: Math.floor(Math.random() * 65535),
    direction: directions[Math.floor(Math.random() * 2)],
    status: statuses[Math.floor(Math.random() * 4)],
    size: Math.floor(Math.random() * 1500) + 64,
  };
}

// NON-Zustand subscriber management - prevents state update loops
// Store subscribers externally to avoid triggering re-renders on subscribe/unsubscribe
const externalSubscribers = {
  onThreat: [],
  onTrafficUpdate: [],
  onPacket: [],
  onStatsUpdate: [],
  onPulse: [],
};

// Live Events Store
export const useLiveEvents = create((set, get) => ({
  // Core state
  isRunning: false,
  isSimulating: false,
  lastThreat: null,
  threatCount: 0,
  
  // Data streams
  threats: [],
  trafficData: [],
  packetStream: [],
  deviceActivity: [],
  
  // Stats
  stats: {
    devices: 247,
    encryptedFlows: 1842,
    openThreats: 7,
    accuracy: 97.3,
    flowsScanned: 14392,
    threatsBlocked: 23,
    activeConnections: 156,
    packetsPerSec: 1247,
  },
  
  // Subscribe to event types - uses EXTERNAL storage to avoid Zustand re-renders
  subscribe: (eventType, callback) => {
    if (externalSubscribers[eventType]) {
      externalSubscribers[eventType].push(callback);
    }
    // Return unsubscribe function that doesn't trigger state updates
    return () => {
      const idx = externalSubscribers[eventType]?.indexOf(callback);
      if (idx !== undefined && idx > -1) {
        externalSubscribers[eventType].splice(idx, 1);
      }
    };
  },
  
  // Trigger event to all subscribers - uses EXTERNAL storage
  trigger: (eventType, data) => {
    if (externalSubscribers[eventType]) {
      externalSubscribers[eventType].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error('Subscriber error:', e);
        }
      });
    }
  },
  
  // Start the live event engine (background data streams)
  start: () => {
    const { isRunning } = get();
    if (isRunning) return;
    
    set({ isRunning: true });
    
    // Initialize traffic data
    const initialTraffic = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(Date.now() - (11 - i) * 5000);
      return {
        timestamp: time.getTime(),
        time: `${(11 - i) * 5}m ago`,
        benign: 380 + Math.random() * 80,
        recon: 4 + Math.random() * 12,
        dos: Math.random() * 6,
        exfil: Math.random() * 4,
      };
    }).reverse();
    
    set({ trafficData: initialTraffic });
    
    // Traffic data update interval (every 2 seconds)
    const trafficInterval = setInterval(() => {
      const { trafficData, trigger } = get();
      const newData = generateTrafficData(trafficData);
      const updated = [...trafficData.slice(1), newData];
      
      set({ trafficData: updated });
      trigger('onTrafficUpdate', updated);
      
      // Update packets per sec stat
      set(state => ({
        stats: { 
          ...state.stats, 
          packetsPerSec: Math.floor(1000 + Math.random() * 500),
          encryptedFlows: state.stats.encryptedFlows + Math.floor(Math.random() * 5),
        }
      }));
    }, 2000);
    
    // Packet stream interval (every 500ms)
    const packetInterval = setInterval(() => {
      const { packetStream, trigger } = get();
      const newPacket = generatePacketActivity();
      const updated = [newPacket, ...packetStream.slice(0, 19)];
      
      set({ packetStream: updated });
      trigger('onPacket', newPacket);
    }, 500);
    
    // Stats update interval (every 3 seconds)
    const statsInterval = setInterval(() => {
      const { stats, trigger } = get();
      set({
        stats: {
          ...stats,
          devices: stats.devices + (Math.random() > 0.7 ? 1 : 0),
          flowsScanned: stats.flowsScanned + Math.floor(Math.random() * 80) + 20,
          activeConnections: Math.floor(150 + Math.random() * 20),
        }
      });
      trigger('onStatsUpdate', get().stats);
    }, 3000);
    
    // Store interval IDs for cleanup
    set({ 
      intervals: { trafficInterval, packetInterval, statsInterval }
    });
  },
  
  // Stop the live event engine
  stop: () => {
    const { intervals } = get();
    if (intervals) {
      clearInterval(intervals.trafficInterval);
      clearInterval(intervals.packetInterval);
      clearInterval(intervals.statsInterval);
    }
    set({ isRunning: false, intervals: null });
  },
  
  // Start automatic threat simulation
  startSimulation: () => {
    const { isSimulating } = get();
    if (isSimulating) return;
    
    set({ isSimulating: true });
    
    // Inject threats at random intervals (8-20 seconds)
    const simulateThreat = () => {
      const { isSimulating, injectThreat, getState } = get();
      if (!isSimulating) return;
      
      injectThreat(true, []);
      
      // Schedule next threat
      const nextDelay = 8000 + Math.random() * 12000;
      const simulationTimeout = setTimeout(simulateThreat, nextDelay);
      set({ simulationTimeout });
    };
    
    // Start with initial threat after short delay
    const initialTimeout = setTimeout(simulateThreat, 3000);
    set({ simulationTimeout: initialTimeout });
  },
  
  // Stop threat simulation
  stopSimulation: () => {
    const { simulationTimeout } = get();
    if (simulationTimeout) {
      clearTimeout(simulationTimeout);
    }
    set({ isSimulating: false, simulationTimeout: null });
  },
  
  // Inject a new threat (manual or automatic)
  injectThreat: (manual = true, devices = []) => {
    const { threats, stats, trigger } = get();
    const newThreat = generateThreat(devices);
    
    const updatedThreats = [newThreat, ...threats].slice(0, 50);
    const updatedStats = {
      ...stats,
      openThreats: stats.openThreats + 1,
      threatsBlocked: stats.threatsBlocked + (Math.random() > 0.5 ? 1 : 0),
    };
    
    set({
      lastThreat: newThreat,
      threatCount: get().threatCount + 1,
      threats: updatedThreats,
      stats: updatedStats,
    });
    
    // Trigger threat event for all subscribers
    trigger('onThreat', newThreat);
    trigger('onPulse', { type: 'threat', severity: newThreat.severity, data: newThreat });
    
    return newThreat;
  },
  
  // Update incident status
  updateThreatStatus: (threatId, status) => {
    const { threats, stats } = get();
    const updated = threats.map(t => 
      t.id === threatId ? { ...t, status } : t
    );
    
    const openCount = updated.filter(t => t.status === 'open').length;
    
    set({
      threats: updated,
      stats: { ...stats, openThreats: openCount },
    });
  },
  
  // Acknowledge threat
  acknowledgeThreat: (threatId) => {
    get().updateThreatStatus(threatId, 'acknowledged');
  },
  
  // Resolve threat
  resolveThreat: (threatId) => {
    get().updateThreatStatus(threatId, 'resolved');
  },
  
  // Dismiss threat
  dismissThreat: (threatId) => {
    const { threats } = get();
    set({ threats: threats.filter(t => t.id !== threatId) });
  },
  
  // Clear all threats
  clearThreats: () => {
    set({ threats: [], lastThreat: null });
  },
  
  // Get store for devtools (optional)
  getState: () => get(),
  
  // Intervals storage
  intervals: null,
  simulationTimeout: null,
}));

// Hook for components to use live events
export function useLiveEventSubscription(eventType, callback) {
  const subscribe = useLiveEvents(s => s.subscribe);
  const unsubscribeRef = React.useRef(null);
  
  React.useEffect(() => {
    unsubscribeRef.current = subscribe(eventType, callback);
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [eventType, callback, subscribe]);
}

// Export convenience hooks
export const useThreatEvents = () => useLiveEvents(s => s.threats);
export const useLastThreat = () => useLiveEvents(s => s.lastThreat);
export const useTrafficData = () => useLiveEvents(s => s.trafficData);
export const usePacketStream = () => useLiveEvents(s => s.packetStream);
export const useStats = () => useLiveEvents(s => s.stats);
export const useIsRunning = () => useLiveEvents(s => s.isRunning);
export const useIsSimulating = () => useLiveEvents(s => s.isSimulating);

// Export actions as bound functions for easy use
export const start = () => useLiveEvents.getState().start();
export const stop = () => useLiveEvents.getState().stop();
export const startSimulation = () => useLiveEvents.getState().startSimulation();
export const stopSimulation = () => useLiveEvents.getState().stopSimulation();
export const injectThreat = (manual = true, devices = []) => 
  useLiveEvents.getState().injectThreat(manual, devices);
export const acknowledgeThreat = (id) => useLiveEvents.getState().acknowledgeThreat(id);
export const resolveThreat = (id) => useLiveEvents.getState().resolveThreat(id);
export const dismissThreat = (id) => useLiveEvents.getState().dismissThreat(id);
