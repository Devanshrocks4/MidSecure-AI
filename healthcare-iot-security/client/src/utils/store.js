// Data Store Adapter - Maintains compatibility with original Aegis data layer
// Persists to localStorage

const STORAGE_KEYS = {
  devices: 'medsecure_devices_v1',
  incidents: 'medsecure_incidents_v1',
  audit: 'medsecure_audit_v1',
};

// Seed data from original
const seedDevices = [
  { id: 'd-001', name: 'ICU Cardiac Monitor 04', type: 'monitor', zone: 'ICU', mac: '0A:1B:2C:3D:4E:5F', status: 'active', lastSeen: 'just now', registered: '2025-08-12' },
  { id: 'd-002', name: 'Infusion Pump A12', type: 'pump', zone: 'ICU', mac: '12:34:56:78:9A:BC', status: 'active', lastSeen: '2 min ago', registered: '2025-09-01' },
  { id: 'd-003', name: 'Vital Sensor — Ward 3', type: 'sensor', zone: 'Wards', mac: 'AB:CD:EF:01:23:45', status: 'active', lastSeen: '5 min ago', registered: '2025-08-19' },
  { id: 'd-004', name: 'CT Scanner — Imaging 02', type: 'imaging', zone: 'Imaging', mac: '98:76:54:32:10:FE', status: 'active', lastSeen: '12 min ago', registered: '2024-11-04' },
  { id: 'd-005', name: 'OT Anesthesia Unit 7', type: 'monitor', zone: 'OT', mac: 'F1:E2:D3:C4:B5:A6', status: 'active', lastSeen: 'just now', registered: '2025-07-22' },
  { id: 'd-006', name: 'ER Patient Monitor 11', type: 'monitor', zone: 'ER', mac: '11:22:33:44:55:66', status: 'suspended', lastSeen: '3 hr ago', registered: '2025-06-30' },
  { id: 'd-007', name: 'Cardio Holter Recorder', type: 'sensor', zone: 'Cardio', mac: 'AA:BB:CC:DD:EE:FF', status: 'active', lastSeen: '1 min ago', registered: '2025-10-11' },
  { id: 'd-008', name: 'Insulin Pump P-22', type: 'pump', zone: 'Wards', mac: '7E:8F:90:A1:B2:C3', status: 'active', lastSeen: '8 min ago', registered: '2025-09-15' },
];

const seedIncidents = [
  { id: 'inc-001', type: 'Reconnaissance', severity: 'medium', status: 'open', deviceId: 'd-006', srcIp: '198.51.100.42', detectionTime: timeAgo(4), confidence: 0.91, threatType: 'Port Scan' },
  { id: 'inc-002', type: 'Denial of Service', severity: 'critical', status: 'open', deviceId: 'd-004', srcIp: '203.0.113.7', detectionTime: timeAgo(11), confidence: 0.97, threatType: 'SYN Flood' },
  { id: 'inc-003', type: 'Data Exfiltration', severity: 'high', status: 'acknowledged', deviceId: 'd-003', srcIp: '198.51.100.21', detectionTime: timeAgo(28), confidence: 0.84, threatType: 'Anomalous Outbound' },
  { id: 'inc-004', type: 'Reconnaissance', severity: 'low', status: 'resolved', deviceId: 'd-002', srcIp: '198.51.100.88', detectionTime: timeAgo(73), confidence: 0.62, threatType: 'Banner Grab' },
  { id: 'inc-005', type: 'Brute Force Auth', severity: 'medium', status: 'open', deviceId: 'd-005', srcIp: '203.0.113.55', detectionTime: timeAgo(15), confidence: 0.78, threatType: 'Credential Stuffing' },
  { id: 'inc-006', type: 'Malware Beacon', severity: 'high', status: 'open', deviceId: 'd-001', srcIp: '198.51.100.13', detectionTime: timeAgo(42), confidence: 0.88, threatType: 'C2 Beaconing' },
];

const seedAudit = [
  { time: timeAgo(2), action: 'AUTH_SUCCESS', target: 'd-001', actor: 'system', detail: 'Device authenticated via X.509 cert' },
  { time: timeAgo(5), action: 'THREAT_DETECTED', target: 'inc-002', actor: 'ml-engine', detail: 'DoS attack flagged · confidence 97%' },
  { time: timeAgo(8), action: 'INCIDENT_ACK', target: 'inc-003', actor: 'admin@medsecure', detail: 'Incident acknowledged by administrator' },
  { time: timeAgo(14), action: 'ENCRYPT_OK', target: 'd-004', actor: 'gateway', detail: 'AES-256-GCM encryption verified' },
  { time: timeAgo(22), action: 'AUTH_DENIED', target: '?', actor: 'gateway', detail: 'Invalid certificate from 198.51.100.42' },
  { time: timeAgo(31), action: 'CONFIG_CHANGE', target: 'firewall', actor: 'admin@medsecure', detail: 'Firewall rule updated · rule_id #42' },
  { time: timeAgo(45), action: 'REPORT_GEN', target: 'HIPAA_2026_05', actor: 'admin@medsecure', detail: 'HIPAA compliance report generated' },
  { time: timeAgo(58), action: 'DEVICE_REG', target: 'd-008', actor: 'biomed-eng', detail: 'New device registered: Insulin Pump P-22' },
];

function timeAgo(minutes) {
  const d = new Date(Date.now() - minutes * 60_000);
  return d.toISOString();
}

function loadOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through */ }
  localStorage.setItem(key, JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch (e) { /* quota or disabled — fail silent */ }
}

// Public store
export const Store = {
  devices: loadOrSeed(STORAGE_KEYS.devices, seedDevices),
  incidents: loadOrSeed(STORAGE_KEYS.incidents, seedIncidents),
  audit: loadOrSeed(STORAGE_KEYS.audit, seedAudit),

  saveDevices() { save(STORAGE_KEYS.devices, this.devices); },
  saveIncidents() { save(STORAGE_KEYS.incidents, this.incidents); },
  saveAudit() { save(STORAGE_KEYS.audit, this.audit); },

  addDevice(device) {
    this.devices.unshift(device);
    this.saveDevices();
    this.addAudit({ action: 'DEVICE_REG', target: device.id, actor: 'admin@medsecure', detail: `Device registered: ${device.name}` });
  },

  removeDevice(id) {
    const d = this.devices.find(x => x.id === id);
    this.devices = this.devices.filter(x => x.id !== id);
    this.saveDevices();
    if (d) this.addAudit({ action: 'DEVICE_REMOVE', target: id, actor: 'admin@medsecure', detail: `Device removed: ${d.name}` });
  },

  addIncident(inc) {
    this.incidents.unshift(inc);
    this.saveIncidents();
    this.addAudit({ action: 'THREAT_DETECTED', target: inc.id, actor: 'ml-engine', detail: `${inc.type} · confidence ${Math.round(inc.confidence * 100)}%` });
  },

  updateIncident(id, patch) {
    const inc = this.incidents.find(i => i.id === id);
    if (inc) {
      Object.assign(inc, patch);
      this.saveIncidents();
      if (patch.status) {
        this.addAudit({ action: 'INCIDENT_' + patch.status.toUpperCase(), target: id, actor: 'admin@medsecure', detail: `Incident ${patch.status}` });
      }
    }
  },

  addAudit(entry) {
    this.audit.unshift({ time: new Date().toISOString(), ...entry });
    if (this.audit.length > 100) this.audit = this.audit.slice(0, 100);
    this.saveAudit();
  },

  reset() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.devices = JSON.parse(JSON.stringify(seedDevices));
    this.incidents = JSON.parse(JSON.stringify(seedIncidents));
    this.audit = JSON.parse(JSON.stringify(seedAudit));
  },
};

// Helpers
export function formatRelativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day === 1 ? '' : 's'} ago`;
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour12: false });
}

export function randomMac() {
  const hex = '0123456789ABCDEF';
  return Array.from({ length: 6 }, () =>
    hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)]
  ).join(':');
}

export function randomIp() {
  return `198.51.100.${Math.floor(Math.random() * 255)}`;
}

export function randomId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
