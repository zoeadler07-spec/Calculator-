import React, { useState } from 'react';
import { StandardCalculator } from './components/StandardCalculator';
import { AICalculator } from './components/AICalculator';
import { HistorySidebar } from './components/HistorySidebar';
import { HistoryItem, CalculatorMode } from './types';
import { Calculator, Sparkles, History as HistoryIcon, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    // Logic to load history item back into calc could go here
    // For now, we just copy result to clipboard
    navigator.clipboard.writeText(item.result);
    // Maybe show a toast notification?
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-nebula-500/30">
      
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nebula-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl relative">
        
        {/* Header / Nav */}
        <div className="flex items-center justify-between mb-8 bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-slate-800/50 shadow-xl">
          <div className="flex gap-1">
             <button
              onClick={() => setMode('standard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                mode === 'standard' 
                ? 'bg-slate-800 text-nebula-400 shadow-lg shadow-slate-900/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
             >
                <Calculator size={18} />
                <span className="font-medium hidden sm:inline">Calculator</span>
             </button>
             <button
              onClick={() => setMode('ai')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                mode === 'ai' 
                ? 'bg-slate-800 text-nebula-400 shadow-lg shadow-slate-900/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
             >
                <Sparkles size={18} />
                <span className="font-medium hidden sm:inline">AI Solver</span>
             </button>
          </div>

          <div className="flex items-center gap-2 pr-2">
             <div className="text-right hidden md:block mr-4">
                <h1 className="text-sm font-bold text-slate-200 tracking-wide">NEBULA CALC</h1>
                <p className="text-[10px] text-slate-500 font-mono">v2.0 • GEMINI</p>
             </div>
             <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-3 text-slate-400 hover:text-nebula-400 hover:bg-slate-800 rounded-xl transition-all relative"
             >
                <HistoryIcon size={20} />
                {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-nebula-500 rounded-full"></span>}
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-300 ease-in-out">
            {mode === 'standard' ? (
                <StandardCalculator onAddToHistory={addToHistory} />
            ) : (
                <AICalculator onAddToHistory={addToHistory} />
            )}
        </div>

      </div>

      <HistorySidebar 
        history={history}
        onClear={clearHistory}
        onSelect={handleHistorySelect}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

    </div>
  );
};

export default App;