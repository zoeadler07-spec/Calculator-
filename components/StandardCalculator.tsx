import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { Display } from './Display';
import { KeyType, KeyConfig, HistoryItem } from '../types';

interface StandardCalculatorProps {
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const StandardCalculator: React.FC<StandardCalculatorProps> = ({ onAddToHistory }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [error, setError] = useState(false);
  const [scientificMode, setScientificMode] = useState(false);

  const safeCalculate = (expr: string): string => {
    try {
      // Basic sanitization
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
      
      // Handle percentage
      // This is a naive implementation of percentage: "50+10%" -> "50 + (50*0.1)" or "50*0.1" depends on context
      // For this simplified version, we'll treat % as /100
      const withPercents = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
      
      // Using Function constructor as a safer alternative to eval for strict math only
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${withPercents}`)();
      
      if (!isFinite(result) || isNaN(result)) {
        throw new Error("Invalid Result");
      }
      
      // Precision handling
      return String(Math.round(result * 10000000000) / 10000000000);
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleInput = useCallback((val: string, type: KeyType) => {
    setError(false);

    if (type === KeyType.Number) {
      if (val === '.') {
        if (isNewNumber) {
          setDisplayValue('0.');
          setIsNewNumber(false);
        } else if (!displayValue.includes('.')) {
          setDisplayValue(prev => prev + '.');
        }
      } else {
        if (isNewNumber || displayValue === '0') {
          setDisplayValue(val);
          setIsNewNumber(false);
        } else {
          setDisplayValue(prev => prev + val);
        }
      }
    } 
    
    else if (type === KeyType.Operator) {
      const op = val === '*' ? '×' : val === '/' ? '÷' : val;
      setExpression(prev => {
        // If we just calculated, use that result for new expression
        if (expression.includes('=') && !isNewNumber) {
           return displayValue + ' ' + op + ' ';
        }
        return prev + displayValue + ' ' + op + ' ';
      });
      setIsNewNumber(true);
    } 
    
    else if (type === KeyType.Scientific) {
        if(val === 'π' || val === 'e') {
            setDisplayValue(val === 'π' ? String(Math.PI) : String(Math.E));
            setIsNewNumber(true); // Treat constants as a complete number entry
            return;
        }

        // Functions like sin, cos, log
        // Immediate execution on current number for simplicity in this demo
        try {
            let valNum = parseFloat(displayValue);
            let res = 0;
            switch(val) {
                case 'sin': res = Math.sin(valNum); break;
                case 'cos': res = Math.cos(valNum); break;
                case 'tan': res = Math.tan(valNum); break;
                case 'log': res = Math.log10(valNum); break;
                case 'ln': res = Math.log(valNum); break;
                case '√': res = Math.sqrt(valNum); break;
                case 'x²': res = Math.pow(valNum, 2); break;
                default: return;
            }
            const resStr = String(Math.round(res * 10000000000) / 10000000000);
            setDisplayValue(resStr);
            setIsNewNumber(true);
        } catch (e) {
            setError(true);
        }
    }

    else if (type === KeyType.Action) {
      if (val === 'AC') {
        setDisplayValue('0');
        setExpression('');
        setIsNewNumber(true);
      } 
      else if (val === 'C') {
        setDisplayValue('0');
        setIsNewNumber(true);
      }
      else if (val === '⌫') {
        if (isNewNumber) return;
        if (displayValue.length === 1) {
            setDisplayValue('0');
            setIsNewNumber(true);
        } else {
            setDisplayValue(prev => prev.slice(0, -1));
        }
      }
      else if (val === '=') {
        if (!expression) return;
        
        try {
            // Clean up expression logic
            const currentExpr = expression + displayValue;
            const finalRes = safeCalculate(currentExpr.replace(/=/g, ''));
            
            onAddToHistory({
                expression: currentExpr.replace(/=/g, ''),
                result: finalRes,
                type: 'standard'
            });

            setDisplayValue(finalRes);
            setExpression(''); // Clear expression after result to start fresh or chain?
            // Usually standard calcs clear top line or keep it. Let's clear for cleaner look but keep logic ready.
            setIsNewNumber(true);
        } catch (e) {
            setError(true);
            setDisplayValue('Error');
            setIsNewNumber(true);
        }
      }
      else if (val === '%') {
        const num = parseFloat(displayValue);
        setDisplayValue(String(num / 100));
      }
      else if (val === '+/-') {
        setDisplayValue(prev => String(parseFloat(prev) * -1));
      }
    }
  }, [displayValue, expression, isNewNumber, onAddToHistory]);

  // Key Definitions
  const standardKeys: KeyConfig[] = [
    { label: 'AC', value: 'AC', type: KeyType.Action },
    { label: '⌫', value: '⌫', type: KeyType.Action },
    { label: '%', value: '%', type: KeyType.Action },
    { label: '÷', value: '/', type: KeyType.Operator },
    { label: '7', value: '7', type: KeyType.Number },
    { label: '8', value: '8', type: KeyType.Number },
    { label: '9', value: '9', type: KeyType.Number },
    { label: '×', value: '*', type: KeyType.Operator },
    { label: '4', value: '4', type: KeyType.Number },
    { label: '5', value: '5', type: KeyType.Number },
    { label: '6', value: '6', type: KeyType.Number },
    { label: '-', value: '-', type: KeyType.Operator },
    { label: '1', value: '1', type: KeyType.Number },
    { label: '2', value: '2', type: KeyType.Number },
    { label: '3', value: '3', type: KeyType.Number },
    { label: '+', value: '+', type: KeyType.Operator },
    { label: '0', value: '0', type: KeyType.Number, span: 2 },
    { label: '.', value: '.', type: KeyType.Number },
    { label: '=', value: '=', type: KeyType.Action },
  ];

  const scientificKeys: KeyConfig[] = [
      { label: 'sin', value: 'sin', type: KeyType.Scientific },
      { label: 'cos', value: 'cos', type: KeyType.Scientific },
      { label: 'tan', value: 'tan', type: KeyType.Scientific },
      { label: 'log', value: 'log', type: KeyType.Scientific },
      { label: 'ln', value: 'ln', type: KeyType.Scientific },
      { label: '√', value: '√', type: KeyType.Scientific },
      { label: 'x²', value: 'x²', type: KeyType.Scientific },
      { label: 'π', value: 'π', type: KeyType.Scientific },
      { label: 'e', value: 'e', type: KeyType.Scientific },
  ];

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2 px-1">
        <button 
            onClick={() => setScientificMode(!scientificMode)}
            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${scientificMode ? 'bg-nebula-500/20 text-nebula-300' : 'bg-slate-800 text-slate-400'}`}
        >
            {scientificMode ? 'Hide Scientific' : 'Show Scientific'}
        </button>
      </div>

      <Display expression={expression} result={displayValue} isError={error} />
      
      {scientificMode && (
          <div className="grid grid-cols-5 gap-2 mb-2">
              {scientificKeys.map(k => (
                  <Button 
                    key={k.label} 
                    {...k} 
                    onClick={() => handleInput(k.value, k.type)} 
                    className="h-10 text-sm rounded-lg"
                  />
              ))}
          </div>
      )}

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {standardKeys.map((key) => (
          <Button
            key={key.label}
            label={key.label}
            type={key.type}
            span={key.span}
            onClick={() => handleInput(key.value, key.type)}
          />
        ))}
      </div>
    </div>
  );
};