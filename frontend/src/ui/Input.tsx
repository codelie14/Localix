import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label &&
      <label className="block text-gray-400 text-xs mb-2">
          [{label.toUpperCase()}]
        </label>
      }
      <input
        {...props}
        className={`w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors placeholder-gray-600 ${error ? 'border-terminal-red/50' : ''} ${className}`} />

      {error && <p className="text-terminal-red text-xs mt-1">{error}</p>}
    </div>);

}
export default Input;