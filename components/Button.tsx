import React from 'react';
import { KeyType } from '../types';

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: KeyType;
  span?: number;
  className?: string;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = KeyType.Number, 
  span = 1,
  className = '',
  active = false
}) => {
  
  let baseStyles = "h-14 sm:h-16 rounded-2xl text-lg sm:text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center select-none shadow-sm";
  let colorStyles = "";

  switch (type) {
    case KeyType.Number:
      colorStyles = "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:shadow-md border border-slate-700/50";
      break;
    case KeyType.Operator:
      colorStyles = active 
        ? "bg-nebula-600 text-white shadow-nebula-500/30" 
        : "bg-slate-900 text-nebula-400 hover:bg-slate-800 border border-slate-800";
      break;
    case KeyType.Action:
      if (label === 'AC' || label === 'C') {
        colorStyles = "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20";
      } else if (label === '=') {
        colorStyles = "bg-gradient-to-br from-nebula-500 to-indigo-600 text-white shadow-lg shadow-nebula-500/20 hover:brightness-110 border-0";
      } else {
        colorStyles = "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600";
      }
      break;
    case KeyType.Scientific:
      colorStyles = "bg-slate-800/50 text-slate-400 text-sm hover:bg-slate-800 border border-slate-800/50";
      break;
  }

  const spanClass = span === 2 ? 'col-span-2' : 'col-span-1';

  return (
    <button
      className={`${baseStyles} ${colorStyles} ${spanClass} ${className}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
};