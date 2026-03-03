import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  severity?: 'normal' | 'warning' | 'critical';
  delay?: number;
}
export function StatCard({
  title,
  value,
  suffix = '',
  prefix = '',
  icon: Icon,
  trend,
  severity = 'normal',
  delay = 0
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  const severityClasses = {
    normal: 'text-terminal-green',
    warning: 'text-terminal-amber pulse-warning',
    critical: 'text-terminal-red pulse-critical'
  };
  const borderClasses = {
    normal: 'border-terminal-green/30 hover:border-terminal-green/50',
    warning: 'border-terminal-amber/30 hover:border-terminal-amber/50',
    critical: 'border-terminal-red/30 hover:border-terminal-red/50'
  };
  const glowClasses = {
    normal: 'neon-box-green',
    warning: 'neon-box-amber',
    critical: 'neon-box-red'
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay: delay / 1000
      }}
      className={`relative bg-terminal-dark rounded-lg border ${borderClasses[severity]} p-5 hover-lift ${glowClasses[severity]}`}>

      {/* ASCII corners */}
      <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
        ┌
      </span>
      <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
        ┐
      </span>
      <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
        └
      </span>
      <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
        ┘
      </span>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">[</span>
          <span className="text-gray-400 text-xs uppercase tracking-wider">
            {title}
          </span>
          <span className="text-gray-500 text-xs">]</span>
        </div>
        <Icon className={`w-5 h-5 ${severityClasses[severity]}`} />
      </div>

      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-gray-500 text-lg">{prefix}</span>}
        <span
          className={`text-4xl font-bold tabular-nums ${severityClasses[severity]}`}>

          {displayValue.toLocaleString()}
        </span>
        {suffix && <span className="text-gray-500 text-lg">{suffix}</span>}
      </div>

      {trend &&
      <div className="mt-3 flex items-center gap-2">
          <span
          className={
          trend.isPositive ? 'text-terminal-green' : 'text-terminal-red'
          }>

            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 text-xs">vs last period</span>
        </div>
      }

      {/* Scanline effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal-green/5 to-transparent animate-pulse" />
      </div>
    </motion.div>);

}