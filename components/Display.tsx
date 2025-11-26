import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, isError }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression, result]);

  // Format numbers to have commas
  const formatNumber = (numStr: string) => {
    if (!numStr) return '';
    if (/[a-zA-Z]/.test(numStr)) return numStr; // Don't format error messages or text
    try {
        // Basic check to see if it's a valid number before attempting to format
        if (isNaN(Number(numStr)) && numStr !== '-') return numStr;
        
        const parts = numStr.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    } catch (e) {
        return numStr;
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl mb-4 border border-slate-800 shadow-inner min-h-[140px] flex flex-col justify-end relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-nebula-500/10 rounded-full blur-3xl group-hover:bg-nebula-500/20 transition-all duration-500"></div>

        <div 
          ref={scrollRef}
          className="text-slate-400 text-right text-lg sm:text-xl font-mono mb-1 overflow-x-auto scrollbar-hide whitespace-nowrap opacity-80"
        >
            {expression || '\u00A0'}
        </div>
        
        <div className={`text-right text-4xl sm:text-5xl font-bold tracking-tight break-all ${isError ? 'text-rose-400' : 'text-slate-50'}`}>
            {isError ? 'Error' : (formatNumber(result) || '0')}
        </div>
    </div>
  );
};