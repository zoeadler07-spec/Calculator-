export type CalculatorMode = 'standard' | 'scientific' | 'ai';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'standard' | 'ai';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

export enum KeyType {
  Number = 'number',
  Operator = 'operator',
  Action = 'action',
  Scientific = 'scientific'
}

export interface KeyConfig {
  label: string;
  value: string;
  type: KeyType;
  span?: number; // col-span
  secondary?: boolean; // style variant
}