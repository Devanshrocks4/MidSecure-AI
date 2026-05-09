import { motion } from 'framer-motion';

/**
 * MedSecure AI Logo
 * Healthcare + Cybersecurity fusion: Shield (security) + Heartbeat (health) + AI Neural (intelligence)
 */

const gradientDef = (
  <defs>
    <linearGradient id="logoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#22d3ee" />
      <stop offset="50%" stopColor="#818cf8" />
      <stop offset="100%" stopColor="#c084fc" />
    </linearGradient>
    <linearGradient id="logoShieldGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#06b6d4" />
      <stop offset="100%" stopColor="#8b5cf6" />
    </linearGradient>
<filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="logoGlowLow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
);

/**
 * Main Logo - Shield with Heartbeat ECG + AI dots
 */
export function MedSecureLogo({ size = 32, animated = true }) {
  const Container = animated ? motion.svg : 'svg';
  const animProps = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  } : {};

  return (
    <Container
      viewBox="0 0 40 40"
      width={size}
      height={size}
      {...animProps}
      className="flex-shrink-0"
    >
      {gradientDef}
      
      {/* Shield Base - Cybersecurity */}
      <path
        d="M20 3 5 9v10c0 8.33 6.25 14.67 15 16 8.75-1.33 15-7.67 15-16V9L20 3Z"
        fill="url(#logoShieldGrad)"
        filter="url(#logoGlowLow)"
      />
      
      {/* Heartbeat ECG Line - Healthcare */}
      <path
        d="M8 22 L12 22 L14 16 L17 26 L20 10 L23 22 L27 22 L32 22"
        fill="none"
        stroke="#0a0f1c"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={animated ? "60 1000" : "none"}
        strokeDashoffset={animated ? "-60" : "0"}
        style={animated ? {
          animation: "logoHeartbeat 2s ease-in-out infinite"
        } : {}}
      />
      
      {/* AI Neural Dots - Intelligence */}
      {animated && (
        <g>
          <circle cx="28" cy="10" r="1.5" fill="#0a0f1c" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="31" cy="14" r="1" fill="#0a0f1c" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="8" r="1.2" fill="#ecfeff" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      
      <style>{`
        @keyframes logoHeartbeat {
          0%, 100% { stroke-dashoffset: -60; }
          50% { stroke-dashoffset: 0; }
        }
      `}</style>
    </Container>
  );
}

/**
 * Icon Only - For buttons and small spaces
 */
export function MedSecureIcon({ size = 24, glow = false }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="flex-shrink-0"
    >
      {gradientDef}
      <path
        d="M20 3 5 9v10c0 8.33 6.25 14.67 15 16 8.75-1.33 15-7.67 15-16V9L20 3Z"
        fill="url(#logoShieldGrad)"
        filter={glow ? "url(#logoGlow)" : undefined}
      />
      <path
        d="M8 22 L12 22 L14 16 L17 26 L20 10 L23 22 L27 22 L32 22"
        fill="none"
        stroke="#0a0f1c"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full Logo with Text - For Sidebar & Headers
 */
export default function Logo({ size = 36, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Icon */}
      <MedSecureLogo size={size} animated={true} />
      
      {showText && (
        <div className="flex flex-col">
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-xl font-bold text-text font-ui leading-none"
            style={{ background: "linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            MedSecure AI
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[9px] uppercase tracking-widest text-text-muted font-mono"
          >
            Security Platform
          </motion.span>
        </div>
      )}
    </div>
  );
}

/**
 * Favicon SVG - For browser tab (static, no animations)
 */
export function FaviconLogo() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="faviconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M16 2 4 6.5v8c0 6.67 5 11.73 12 13 7-1.27 12-6.33 12-13v-8L16 2z"
        fill="url(#faviconGrad)"
      />
      <path
        d="M6 17.5 L9 17.5 L11 13 L13 21 L15 7.5 L17 17.5 L21 17.5 L23 17.5"
        fill="none"
        stroke="#0a0f1c"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Inline favicon for index.html - Healthcare + Cybersecurity fusion */
export const faviconSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0'25' y1='0'25' x2='100'25' y2='100'25'%3E%3Cstop offset='0%25' stop-color='%2322d3ee'/%3E%3Cstop offset='100%25' stop-color='%23818cf8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M16 2 4 6.5v8c0 6.67 5 11.73 12 13 7-1.27 12-6.33 12-13v-8L16 2z'/%3E%3Cpath fill='none' stroke='%230a0f1c' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' d='M6 17.5 9 17.5 11 13 13 21 15 7.5 17 17.5 21 17.5 23 17.5'/%3E%3C/svg%3E`;
