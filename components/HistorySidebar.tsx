import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronLeft } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onClear, 
  onSelect,
  isOpen,
  onClose
}) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-nebula-400">
            <Clock size={20} />
            <span className="font-semibold">History</span>
          </div>
          <div className="flex gap-1">
             <button 
              onClick={onClear}
              className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              title="Clear History"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 rounded-lg transition-colors md:hidden"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
         
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 mt-10 text-sm">
              No calculations yet.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-right bg-slate-800/50 hover:bg-slate-800 p-3 rounded-xl border border-transparent hover:border-slate-700 transition-all group"
              >
                <div className="text-slate-400 text-xs mb-1 font-mono">{item.expression}</div>
                <div className="text-slate-200 text-lg font-medium group-hover:text-nebula-300">{item.result}</div>
                {item.type === 'ai' && <span className="text-[10px] bg-nebula-500/20 text-nebula-300 px-1.5 py-0.5 rounded uppercase tracking-wider">AI</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};