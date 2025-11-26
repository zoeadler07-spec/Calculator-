import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { solveMathProblem } from '../services/geminiService';
import { ChatMessage, HistoryItem } from '../types';
import ReactMarkdown from 'react-markdown';

interface AICalculatorProps {
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const AICalculator: React.FC<AICalculatorProps> = ({ onAddToHistory }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hi! I can help you solve complex math problems, word problems, or explain concepts. Just type below!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const answer = await solveMathProblem(userMsg.content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: answer
      };
      
      setMessages(prev => [...prev, aiMsg]);
      onAddToHistory({
        expression: userMsg.content,
        result: 'AI Solved', // We don't parse the exact number for history in AI mode as it's often text
        type: 'ai'
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Sorry, I encountered an error trying to solve that. Please check your internet connection or API key.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const CopyButton = ({ text }: { text: string }) => {
      const [copied, setCopied] = useState(false);
      const handleCopy = () => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      };
      return (
          <button onClick={handleCopy} className="text-slate-500 hover:text-nebula-400 transition-colors p-1">
              {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
      )
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-nebula-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
              } ${msg.isError ? 'bg-rose-900/50 border-rose-500/30' : ''}`}
            >
              {msg.role === 'model' && !msg.isError && (
                  <div className="flex justify-between items-start mb-2 border-b border-slate-700/50 pb-2">
                      <div className="flex items-center gap-2 text-nebula-400 text-xs font-bold uppercase tracking-wide">
                          <Sparkles size={12} /> Gemini Assistant
                      </div>
                      <CopyButton text={msg.content} />
                  </div>
              )}
              
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-sm border border-slate-700 flex items-center gap-2">
              <RefreshCw className="animate-spin text-nebula-400" size={16} />
              <span className="text-slate-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything... e.g., 'Derivative of x^2 + 5x'"
            className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-nebula-500/50 border border-slate-800 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 p-2 bg-nebula-600 hover:bg-nebula-500 disabled:opacity-50 disabled:hover:bg-nebula-600 text-white rounded-lg transition-colors shadow-lg shadow-nebula-500/20"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center mt-2">
             <p className="text-[10px] text-slate-500">Powered by Gemini 2.5 Flash. AI can make mistakes.</p>
        </div>
      </div>
    </div>
  );
};