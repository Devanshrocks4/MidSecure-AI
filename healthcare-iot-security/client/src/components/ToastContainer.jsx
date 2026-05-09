import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../utils/toast';

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <XCircle className="w-5 h-5 text-critical" />,
  info: <AlertCircle className="w-5 h-5 text-info" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
};

const borderColors = {
  success: 'border-l-success',
  error: 'border-l-critical',
  info: 'border-l-info',
  warning: 'border-l-warning',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence mode="pop">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              pointer-events-auto min-w-[280px] max-w-[380px] p-3.5 
              bg-surface-2 border border-border rounded-lg
              flex items-start gap-2.5 shadow-card
              border-l-4 ${borderColors[toast.type] || borderColors.info}
            `}
          >
            <div className="flex-shrink-0">
              {toastIcons[toast.type] || toastIcons.info}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-text-dim mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-text-dim hover:text-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
