
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Mic, Upload } from 'lucide-react';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  content: string;
  type: 'text' | 'options' | 'input' | 'slider' | 'date';
  options?: {
    value: string;
    label: string;
  }[];
}

interface ChatInputProps {
  currentQuestion: Message;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onOptionSelect: (option: any) => void;
}

const ChatInput = ({ currentQuestion, value, onChange, onSubmit, onOptionSelect }: ChatInputProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>([5000]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(value);
    }
  };

  // Don't render input if the current question is an options type
  if (currentQuestion?.type === 'options') {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-4">
      {currentQuestion?.type === 'slider' && (
        <div className="w-full px-1">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">R$ 0</span>
            <span className="text-sm font-medium">
              R$ {sliderValue[0].toLocaleString('pt-BR')}
            </span>
            <span className="text-sm text-gray-500">R$ 50.000+</span>
          </div>
          <Slider
            defaultValue={[5000]}
            max={50000}
            step={1000}
            value={sliderValue}
            onValueChange={setSliderValue}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button 
              onClick={() => onOptionSelect(sliderValue[0])}
              className="bg-w1-primary-dark hover:bg-opacity-90"
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
      
      {currentQuestion?.type === 'input' && (
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua resposta..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={() => onSubmit(value)}
            className="bg-w1-primary-dark hover:bg-opacity-90"
            disabled={!value.trim()}
          >
            <Send size={18} />
          </Button>
          <Button variant="outline">
            <Upload size={18} />
          </Button>
          <Button variant="outline">
            <Mic size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
