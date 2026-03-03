import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-terminal-green/10 border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/20 hover:neon-box-green',
    secondary:
    'bg-terminal-dark border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white',
    danger:
    'bg-terminal-red/10 border border-terminal-red/30 text-terminal-red hover:bg-terminal-red/20 hover:neon-box-red',
    ghost:
    'bg-transparent border border-transparent text-gray-400 hover:text-terminal-green hover:bg-terminal-green/5'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>

      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>);

}