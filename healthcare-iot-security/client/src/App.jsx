import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { PageLoader } from './components/PageLoader';
import { ToastContainer } from './components/ToastContainer';
import { Background3D } from './components/Background3D';

import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Threats from './pages/Threats';
import Encryption from './pages/Encryption';
import MLDetector from './pages/MLDetector';
import Compliance from './pages/Compliance';
import About from './pages/About';

import { useToast } from './utils/toast';
import { start, stop } from './utils/liveEvents';

function App() {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Initialize live events globally - runs once on app mount
  useEffect(() => {
    // Start the live event engine
    start();
    
    // Clean up on unmount
    return () => stop();
  }, []);
  
  useEffect(() => {
    // Hide loader after initial load
    const timer = setTimeout(() => {
      setLoading(false);
      // Show welcome toast
      setTimeout(() => {
        toast.success('MedSecure AI Online', 'Encrypted gateway listening · ML engine loaded.');
      }, 500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
return (
    <BrowserRouter>
      {/* 3D Background Effects */}
      <Background3D />
      
      <AnimatePresence mode="wait">
        {loading && <PageLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <Sidebar>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/encryption" element={<Encryption />} />
            <Route path="/ml-detector" element={<MLDetector />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Sidebar>
      )}
      
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
