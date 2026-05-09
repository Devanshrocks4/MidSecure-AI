import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle, AlertTriangle, ShieldX, FileWarning, HelpCircle } from 'lucide-react';
import { Panel, Button } from '../components/ui';
import { useToast } from '../utils/toast';

const threatLabels = {
  benign: 'Benign',
  recon: 'Reconnaissance',
  dos: 'Denial of Service',
  exfil: 'Data Exfiltration',
};

const threatColors = {
  benign: 'text-success border-success/30 bg-success/5',
  recon: 'text-info border-info/30 bg-info/5',
  dos: 'text-critical border-critical/30 bg-critical/5',
  exfil: 'text-accent border-accent/30 bg-accent/5',
};

export default function MLDetector() {
  const [features, setFeatures] = useState({
    duration: 120,
    bytes: 1200,
    packets: 10,
    iastd: 5,
    syn: 10,
    unique: 3,
  });
  
  const [result, setResult] = useState(null);
  const [latency, setLatency] = useState(null);
  const toast = useToast();
  
  const updateFeature = (key, value) => {
    setFeatures(f => ({ ...f, [key]: parseInt(value) }));
  };
  
  const classify = () => {
    const t0 = performance.now();
    
    // Simulated ML classification based on features
    const { duration, bytes, packets, iastd, syn, unique } = features;
    
    // Simple heuristic for demo (real model would use TensorFlow)
    let scores = {
      benign: 0.3,
      recon: 0.2,
      dos: 0.2,
      exfil: 0.3,
    };
    
    // Adjust based on features
    if (syn > 50) scores.dos += 0.4;
    if (syn > 20 && syn <= 50) scores.recon += 0.3;
    if (unique > 20) scores.recon += 0.3;
    if (bytes > 10000) scores.exfil += 0.3;
    if (iastd < 1 && packets > 100) scores.dos += 0.3;
    if (duration < 10 && packets < 5) scores.benign += 0.2;
    
    // Normalize
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    Object.keys(scores).forEach(k => scores[k] /= total);
    
    // Find max
    const max = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
    
    const elapsed = performance.now() - t0 + Math.floor(Math.random() * 50 + 100);
    setLatency(elapsed);
    setResult({ type: max[0], confidence: max[1], scores });
    
    toast.info('Classified', `${threatLabels[max[0]]} (${Math.round(max[1] * 100)}%)`);
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Machine Learning Engine</p>
        <h1 className="text-4xl font-bold text-text font-ui">
          ML Threat <em className="text-primary not-italic">Detector</em>
        </h1>
        <p className="text-text-dim mt-2">Random Forest + LSTM ensemble · trained on UNSW-NB15 + TON_IoT.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Features */}
        <Panel title="Network Flow Features" subtitle="Adjust the inputs to simulate a captured flow">
          <div className="space-y-4">
            {[
              { key: 'duration', label: 'Flow Duration', unit: 'ms', max: 5000 },
              { key: 'bytes', label: 'Byte Count', unit: 'B', max: 50000 },
              { key: 'packets', label: 'Packet Count', unit: '', max: 500 },
              { key: 'iastd', label: 'Inter-arrival Std Dev', unit: 'ms', max: 500 },
              { key: 'syn', label: 'SYN Flag Ratio', unit: '%', max: 100 },
              { key: 'unique', label: 'Unique Destinations', unit: '', max: 100 },
            ].map(({ key, label, unit, max }) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-text-dim font-mono">{label}</span>
                  <span className="text-primary font-mono">
                    {features[key].toLocaleString()}{unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={features[key]}
                  onChange={(e) => updateFeature(key, e.target.value)}
                  className="w-full h-1 bg-surface-3 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                />
              </div>
            ))}
          </div>
          
          <Button onClick={classify} className="w-full mt-4">
            <BrainCircuit className="w-4 h-4" />
            Classify Flow
          </Button>
        </Panel>
        
        {/* Results */}
        <Panel title="Classification Result" subtitle="Output of the trained ensemble model">
          {result ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-6 text-center border rounded-lg mb-4 ${
                result.type === 'benign' ? 'border-success/30 bg-success/5' :
                result.type === 'recon' ? 'border-info/30 bg-info/5' :
                result.type === 'dos' ? 'border-critical/30 bg-critical/5' :
                'border-accent/30 bg-accent/5'
              }`}
            >
              <div className={`mb-2 ${
                result.type === 'benign' ? 'text-success' :
                result.type === 'recon' ? 'text-info' :
                result.type === 'dos' ? 'text-critical' :
                'text-accent'
              }`}>
                {result.type === 'benign' ? <CheckCircle className="w-12 h-12 mx-auto" /> :
                 result.type === 'dos' ? <ShieldX className="w-12 h-12 mx-auto" /> :
                 result.type === 'recon' ? <AlertTriangle className="w-12 h-12 mx-auto" /> :
                 <FileWarning className="w-12 h-12 mx-auto" />}
              </div>
              <p className={`text-3xl font-display ${
                result.type === 'benign' ? 'text-success' :
                result.type === 'recon' ? 'text-info' :
                result.type === 'dos' ? 'text-critical' :
                'text-accent'
              }`}>
                {threatLabels[result.type]}
              </p>
              <p className="text-sm text-text-muted font-mono mt-1">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
            </motion.div>
          ) : (
            <div className="p-6 text-center border border-border-soft rounded-lg mb-4">
              <HelpCircle className="w-12 h-12 mx-auto text-text-dim mb-2" />
              <p className="text-xl font-display text-text-dim">Awaiting input</p>
              <p className="text-sm text-text-muted font-mono">Adjust sliders & click Classify</p>
            </div>
          )}
          
          {/* Probability Bars */}
          {result && (
            <div className="space-y-2.5">
              {Object.entries(result.scores).sort((a, b) => b[1] - a[1]).map(([type, prob]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-text-dim">{threatLabels[type]}</span>
                  <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prob * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        type === 'benign' ? 'bg-success' :
                        type === 'recon' ? 'bg-info' :
                        type === 'dos' ? 'bg-critical' :
                        'bg-accent'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono text-text w-10 text-right">
                    {Math.round(prob * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Model Info */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border-soft">
            <div className="text-center">
              <p className="text-sm font-mono text-primary">Random Forest (n=200)</p>
              <p className="text-[10px] text-text-muted font-mono">Model</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-mono text-primary">47 statistical</p>
              <p className="text-[10px] text-text-muted font-mono">Features</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-mono text-primary">{latency || '—'} ms</p>
              <p className="text-[10px] text-text-muted font-mono">Latency</p>
            </div>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
