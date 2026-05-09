import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Monitor, HeartPulse, Activity, Scan, SearchIcon } from 'lucide-react';
import { Panel, Button, Input, Select } from '../components/ui';
import { useToast } from '../utils/toast';
import { Store, randomMac, randomId } from '../utils/store';

const deviceIcons = {
  monitor: <Monitor className="w-5 h-5" />,
  pump: <HeartPulse className="w-5 h-5" />,
  sensor: <Activity className="w-5 h-5" />,
  imaging: <Scan className="w-5 h-5" />,
};

const deviceTypeLabels = {
  monitor: 'Patient Monitor',
  pump: 'Infusion Pump',
  sensor: 'Wearable Sensor',
  imaging: 'Imaging Device',
};

const statusColors = {
  active: 'success',
  suspended: 'warning',
  deregistered: 'critical',
};

export default function Devices() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const toast = useToast();
  
  useEffect(() => {
    setDevices(Store.devices);
  }, []);
  
  const filteredDevices = devices.filter(d => {
    const matchesSearch = !search || 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.mac.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || d.type === filter;
    return matchesSearch && matchesFilter;
  });
  
  const handleAddDevice = (e) => {
    e.preventDefault();
    const form = e.target;
    const newDevice = {
      id: randomId('d'),
      name: form.deviceName.value,
      type: form.deviceType.value,
      zone: form.deviceZone.value,
      mac: randomMac(),
      status: 'active',
      lastSeen: 'just now',
      registered: new Date().toISOString().split('T')[0],
    };
    
    Store.addDevice(newDevice);
    setDevices([newDevice, ...devices]);
    setShowModal(false);
    toast.success('Device Registered', `${newDevice.name} added successfully`);
  };
  
  const handleRemoveDevice = (id, name) => {
    Store.removeDevice(id);
    setDevices(devices.filter(d => d.id !== id));
    toast.info('Device Removed', `${name} has been deregistered`);
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="flex justify-between items-end mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Asset Inventory</p>
          <h1 className="text-4xl font-bold text-text font-ui">
            Registered <em className="text-primary not-italic">IoT Devices</em>
          </h1>
          <p className="text-text-dim mt-2">X.509 certificate-authenticated medical IoT endpoints.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Register Device
        </Button>
      </header>
      
      {/* Toolbar */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search devices by name, type, MAC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto">
          <option value="all">All types</option>
          <option value="monitor">Patient Monitor</option>
          <option value="pump">Infusion Pump</option>
          <option value="sensor">Wearable Sensor</option>
          <option value="imaging">Imaging Device</option>
        </Select>
      </div>
      
      {/* Device Table */}
      <Panel flush>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="text-left py-4 px-6 text-[11px] uppercase tracking-wider text-text-muted font-mono">Device</th>
                <th className="text-left py-4 px-6 text-[11px] uppercase tracking-wider text-text-muted font-mono hidden md:table-cell">MAC</th>
                <th className="text-left py-4 px-6 text-[11px] uppercase tracking-wider text-text-muted font-mono hidden md:table-cell">Zone</th>
                <th className="text-left py-4 px-6 text-[11px] uppercase tracking-wider text-text-muted font-mono">Status</th>
                <th className="text-right py-4 px-6 text-[11px] uppercase tracking-wider text-text-muted font-mono">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device, index) => (
                <motion.tr
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border-soft hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        {deviceIcons[device.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{device.name}</p>
                        <p className="text-xs text-text-muted font-mono">{deviceTypeLabels[device.type]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-text-dim font-mono hidden md:table-cell">{device.mac}</td>
                  <td className="py-4 px-6 text-sm text-text-dim hidden md:table-cell">{device.zone}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${
                      device.status === 'active' ? 'border-success/30 text-success bg-success/5' :
                      device.status === 'suspended' ? 'border-warning/30 text-warning bg-warning/5' :
                      'border-critical/30 text-critical bg-critical/5'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        device.status === 'active' ? 'bg-success' :
                        device.status === 'suspended' ? 'bg-warning' :
                        'bg-critical'
                      }`} />
                      {device.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleRemoveDevice(device.id, device.name)}
                        className="px-2.5 py-1 text-xs border border-border rounded-sm text-text-dim hover:text-critical hover:border-critical transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      
      {/* Add Device Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-surface-2 border border-border rounded-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-display text-text mb-4">Register New IoT Device</h3>
              <form onSubmit={handleAddDevice}>
                <Input label="Device Name" name="deviceName" placeholder="e.g. ICU Monitor 12" required />
                <Select label="Device Type" name="deviceType" className="mt-4">
                  <option value="monitor">Patient Monitor</option>
                  <option value="pump">Infusion Pump</option>
                  <option value="sensor">Wearable Sensor</option>
                  <option value="imaging">Imaging Device</option>
                </Select>
                <Select label="Zone" name="deviceZone" className="mt-4">
                  <option>ICU</option>
                  <option>OT</option>
                  <option>ER</option>
                  <option>Wards</option>
                  <option>Cardio</option>
                  <option>Imaging</option>
                </Select>
                <div className="flex gap-2 mt-5">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Register Device
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
