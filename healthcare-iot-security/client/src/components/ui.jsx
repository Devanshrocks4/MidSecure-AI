import { motion } from 'framer-motion';
import { forwardRef } from 'react';

// Button component
export const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', className = '', disabled, ...props },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-sm';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-cyan-500 text-bg-base shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5',
    ghost: 'bg-surface-1 border border-border hover:bg-surface-2 hover:border-border-strong text-text',
    danger: 'bg-critical/10 border border-critical/30 text-critical hover:bg-critical/20',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClasses} ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

// Card component
export function Card({ children, className = '', glow = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        bg-surface-1 border border-border-soft rounded-lg p-5 relative overflow-hidden
        backdrop-blur-xl shadow-card
        hover:border-border transition-colors duration-300
        ${glow ? 'glow-effect' : ''}
        ${className}
      `}
      {...props}
    >
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      )}
      {children}
    </motion.div>
  );
}

// Panel component (larger card)
export function Panel({ children, className = '', title, subtitle, flush = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        bg-surface-1 border border-border-soft rounded-lg
        ${flush ? '' : 'p-5'}
        backdrop-blur-xl shadow-card
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="flex justify-between items-start gap-3 mb-5 flex-wrap">
          <div>
            {title && <h3 className="text-xl font-semibold text-text font-ui">{title}</h3>}
            {subtitle && <p className="text-sm text-text-dim mt-1">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
}

// Stat Card component
export function StatCard({ label, value, trend, trendUp, warning, children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        bg-surface-1 border border-border-soft rounded-lg p-4 relative overflow-hidden
        backdrop-blur-xl transition-all duration-300
        ${warning ? 'border-warning/30' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-text-dim tracking-wide">{label}</span>
        {trend && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${trendUp ? 'bg-success/20 text-success' : 'bg-critical/20 text-critical'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={`text-4xl font-bold text-text font-ui tracking-tight ${warning ? 'text-warning' : ''}`}>
        {value}
      </div>
      {children}
    </motion.div>
  );
}

// Badge/Pill component
export function Pill({ children, variant = 'default', dot, className = '' }) {
  const variants = {
    default: 'border-border text-text-soft',
    success: 'border-success/30 text-success',
    warning: 'border-warning/30 text-warning',
    critical: 'border-critical/30 text-critical',
    purple: 'border-accent/30 text-accent',
  };
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
      border rounded-full bg-surface-1
      ${variants[variant]}
      ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-success' : variant === 'warning' ? 'bg-warning' : variant === 'critical' ? 'bg-critical' : variant === 'purple' ? 'bg-accent' : 'bg-primary'}`} />}
      {children}
    </span>
  );
}

// Input component
export const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-text-muted font-mono mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3.5 py-2 bg-bg-canvas border border-border rounded-sm
          text-text text-sm outline-none transition-all duration-300
          focus:border-primary focus:ring-2 focus:ring-primary/20
          placeholder:text-text-muted font-body
          ${error ? 'border-critical' : ''}
        `}
        {...props}
      />
    </div>
  );
});

// Textarea component
export const Textarea = forwardRef(function Textarea(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-text-muted font-mono mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-3.5 py-2 bg-bg-canvas border border-border rounded-sm
          text-text text-sm outline-none transition-all duration-300
          focus:border-primary focus:ring-2 focus:ring-primary/20
          placeholder:text-text-muted font-body resize-y min-h-[90px]
          ${error ? 'border-critical' : ''}
        `}
        {...props}
      />
    </div>
  );
});

// Select component
export const Select = forwardRef(function Select(
  { label, error, className = '', children, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-text-muted font-mono mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-3.5 py-2 bg-bg-canvas border border-border rounded-sm
          text-text text-sm outline-none transition-all duration-300
          focus:border-primary focus:ring-2 focus:ring-primary/20
          ${error ? 'border-critical' : ''}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});
