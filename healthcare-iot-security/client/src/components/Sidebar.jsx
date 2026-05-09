import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  ShieldAlert, 
  Lock, 
  BrainCircuit, 
  FileCheck, 
  Info,
  Menu,
  X
} from 'lucide-react';
import { MedSecureLogo } from './Logo';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/devices', label: 'IoT Devices', icon: Server },
  { path: '/threats', label: 'Threat Center', icon: ShieldAlert },
  { path: '/encryption', label: 'Encryption Lab', icon: Lock },
  { path: '/ml-detector', label: 'ML Detector', icon: BrainCircuit },
  { path: '/compliance', label: 'Compliance', icon: FileCheck },
  { path: '/about', label: 'About Project', icon: Info },
];

export function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const openIncidents = 7; // This would come from store
  
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
<motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-[260px] p-4 pb-6 flex-col overflow-hidden
          bg-gradient-to-b from-bg-base/95 to-bg-base/98 backdrop-blur-xl
          border-r border-border-soft z-40"
      >
        <SidebarContent path={location.pathname} openIncidents={openIncidents} />
      </motion.aside>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[260px] p-5 pb-8 flex-col
              bg-bg-base border-r border-border-soft z-50 md:hidden"
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsOpen(false)} className="text-text-dim hover:text-text">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent path={location.pathname} openIncidents={openIncidents} onLinkClick={() => setIsOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-sm bg-surface-2 border border-border text-text"
      >
        <Menu className="w-5 h-5" />
      </button>
      
{/* Main Content */}
      <main className="flex-1 md:ml-[260px] p-6 md:p-8 pt-16 md:pt-8 relative z-10">
        {children}
      </main>
    </div>
  );
}

function SidebarContent({ path, openIncidents, onLinkClick }) {
  return (
    <>
{/* Logo */}
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-border-soft min-h-[50px] flex-shrink-0">
        <MedSecureLogo size={28} />
        <div className="flex flex-col justify-center">
          <span className="block text-lg font-bold text-text font-ui leading-tight">
            MedSecure <span className="text-primary">AI</span>
          </span>
          <span className="block text-[9px] uppercase tracking-[0.16em] text-text-muted font-mono">
            Security Platform
          </span>
        </div>
      </div>
      
{/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto px-1">
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono px-2.5 py-3">
          Operations
        </div>
        {navItems.slice(0, 3).map((item) => (
          <NavItem 
            key={item.path} 
            item={item} 
            path={path} 
            badge={item.path === '/threats' ? openIncidents : null}
            onClick={onLinkClick}
          />
        ))}
        
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono px-2.5 py-3">
          Security Tools
        </div>
        {navItems.slice(3, 6).map((item) => (
          <NavItem key={item.path} item={item} path={path} onClick={onLinkClick} />
        ))}
        
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-mono px-2.5 py-3">
          Information
        </div>
        {navItems.slice(6).map((item) => (
          <NavItem key={item.path} item={item} path={path} onClick={onLinkClick} />
        ))}
      </nav>
      
{/* Status */}
      <div className="pt-3 mt-3 border-t border-border-soft flex-shrink-0">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm bg-success/10 border border-success/30">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">System Online</span>
        </div>
        <div className="text-[10px] text-text-muted font-mono mt-1.5 px-2">
          v1.0 · MedSecure AI
        </div>
      </div>
    </>
  );
}

function NavItem({ item, path, badge, onClick }) {
  const isActive = path === item.path || (item.path === '/' && path === '/');
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-sm text-sm font-medium
        text-text-soft no-underline relative transition-all duration-300
        hover:text-text hover:translate-x-1
        active:bg-primary/10 active:text-primary"
      style={{ 
        color: isActive ? '#22d3ee' : undefined,
        background: isActive ? 'linear-gradient(90deg, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.04))' : undefined,
        fontWeight: isActive ? 600 : 500,
      }}
    >
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-r"
        />
      )}
      <Icon className={`w-[17px] h-[17px] ${isActive ? 'text-primary' : ''}`} />
      {item.label}
      {badge && badge > 0 && (
        <span className="ml-auto bg-critical text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
