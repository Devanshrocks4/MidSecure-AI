import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useLiveEvents, useTrafficData } from '../utils/liveEvents';

// Chart colors
const COLORS = {
  benign: '#34d399',
  recon: '#fbbf24',
  dos: '#f43f5e',
  exfil: '#a78bfa',
  info: '#60a5fa',
};

const CHART_COLORS = ['#34d399', '#fbbf24', '#f43f5e', '#a78bfa', '#60a5fa'];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-base/95 border border-border p-2.5 rounded-sm shadow-card"
      >
        <p className="text-xs text-text-dim mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toFixed(0) ?? 0}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

// Animated Area that pulses when data changes
function AnimatedArea({ dataKey, name, stroke, fill, isAttacking }) {
  const [prevKey, setPrevKey] = useState(dataKey);
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    if (dataKey !== prevKey && isAttacking && (dataKey === 'dos' || dataKey === 'recon' || dataKey === 'exfil')) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevKey(dataKey);
  }, [dataKey, prevKey, isAttacking]);
  
  return (
    <Area
      type="monotone"
      dataKey={dataKey}
      name={name}
      stroke={stroke}
      strokeWidth={animating ? 3 : 2}
      fillOpacity={1}
      fill={fill}
      isAnimationActive={true}
      animationDuration={500}
    />
  );
}

// Line Area Chart with live updates
export function TrafficChart({ data, live = false }) {
  const [localData, setLocalData] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const prevDataRef = useRef([]);
  
  // Generate sample data if none provided
  const chartData = data || localData.length > 0 ? localData : Array.from({ length: 12 }, (_, i) => ({
    time: `${(11 - i) * 5}m ago`,
    benign: 380 + Math.random() * 80,
    recon: 4 + Math.random() * 12,
    dos: Math.random() * 6,
    exfil: Math.random() * 4,
  })).reverse();
  
  // Subscribe to live events if live mode
  useEffect(() => {
    if (!live) return;
    
    const liveEvents = useLiveEvents.getState();
    const unsubscribe = liveEvents.subscribe('onTrafficUpdate', (newData) => {
      setLocalData(newData);
    });
    
    const unsubscribeAttack = liveEvents.subscribe('onThreat', (threat) => {
      if (threat.severity === 'critical' || threat.severity === 'high') {
        setIsAttacking(true);
        setTimeout(() => setIsAttacking(false), 500);
      }
    });
    
    return () => {
      unsubscribe();
      unsubscribeAttack();
    };
  }, [live]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBenign" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.benign} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.benign} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRecon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.recon} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.recon} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.dos} stopOpacity={isAttacking ? 0.5 : 0.3} />
              <stop offset="95%" stopColor={COLORS.dos} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExfil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.exfil} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.exfil} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(88, 166, 255, 0.05)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={{ stroke: 'rgba(88, 166, 255, 0.08)' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={{ stroke: 'rgba(88, 166, 255, 0.08)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="benign"
            name="Benign"
            stroke={COLORS.benign}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBenign)"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="recon"
            name="Recon"
            stroke={COLORS.recon}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRecon)"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="dos"
            name="DoS"
            stroke={COLORS.dos}
            strokeWidth={isAttacking ? 3 : 2}
            fillOpacity={1}
            fill="url(#colorDos)"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="exfil"
            name="Exfil"
            stroke={COLORS.exfil}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExfil)"
            isAnimationActive={true}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Threat Doughnut Chart
export function ThreatDoughnutChart({ threats = [] }) {
  // Calculate threat distribution from passed threats
  const distribution = threats.reduce((acc, t) => {
    const type = t.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = [
    { name: 'Reconnaissance', value: distribution['Reconnaissance'] || 1, color: COLORS.recon },
    { name: 'DoS', value: distribution['Denial of Service'] || 1, color: COLORS.dos },
    { name: 'Exfiltration', value: distribution['Data Exfiltration'] || 0, color: COLORS.exfil },
    { name: 'Other', value: (distribution['Brute Force Auth'] || 0) + (distribution['Malware Beacon'] || 0), color: COLORS.info },
  ];
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="#0a1228" 
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-bg-base/95 border border-border p-2 rounded-sm">
                    <p className="text-sm text-text">{payload[0].name}: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-text-dim">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-45px' }}>
        <p className="text-3xl font-bold text-text font-ui">{total}</p>
        <p className="text-xs text-text-muted uppercase tracking-wider">Threats</p>
      </div>
    </motion.div>
  );
}

// Mini Doughnut for stats
export function MiniDoughnut({ percentage = 75, size = 60, color = COLORS.benign }) {
  const data = [
    { name: 'filled', value: percentage },
    { name: 'empty', value: 100 - percentage },
  ];
  
  return (
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={size * 0.65}
          outerRadius={size * 0.9}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="rgba(88, 166, 255, 0.1)" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
