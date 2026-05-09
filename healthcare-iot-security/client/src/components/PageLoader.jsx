import { motion } from 'framer-motion';
import { MedSecureIcon } from './Logo';

export function PageLoader({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 bg-bg-base flex items-center justify-center flex-col gap-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ 
            filter: ['drop-shadow(0 0 4px #22d3ee)', 'drop-shadow(0 0 16px #22d3ee)']
          }}
          transition={{ 
            duration: 1.4, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
        >
          <MedSecureIcon className="w-[60px] h-[60px]" />
        </motion.div>
        <span className="text-xs font-mono text-text-dim tracking-[0.18em] uppercase">
          Initialising secure session
        </span>
      </motion.div>
    </motion.div>
  );
}
