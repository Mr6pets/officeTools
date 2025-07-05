import React from 'react';

export interface ToolConfig {
  id: string;
  name: string;
  icon: string;
  category: 'document' | 'image' | 'text' | 'utility' | 'calculator' | 'generator';
  description: string;
  component: React.ComponentType;
}

export interface ToolCategory {
  key: string;
  name: string;
  icon: string;
  tools: ToolConfig[];
}

export interface FileItem {
  uid: string;
  name: string;
  size: number;
  file: File;
}

export interface ImageProcessResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface QRCodeResult {
  text: string;
  format: string;
  timestamp: number;
}

export interface CalculatorHistory {
  expression: string;
  result: number;
  timestamp: number;
}

export interface GeneratedData {
  type: 'password' | 'uuid' | 'random' | 'fake';
  value: string;
  options?: Record<string, any>;
}

export interface TextProcessResult {
  original: string;
  processed: string;
  stats?: {
    characters: number;
    words: number;
    lines: number;
  };
}