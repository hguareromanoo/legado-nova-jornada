
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (text: string) => void;
  onOptionSelect?: (response: any) => void;
  currentQuestion?: any;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled, 
  value, 
  onChange, 
  onSubmit, 
  currentQuestion,
  onOptionSelect 
}: ChatInputProps) => {
  const [message, setMessage] = useState(value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setMessage(value);
    }
  }, [value]);

  // Auto-focus on the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      if (onSubmit) {
        onSubmit(message);
      } else {
        onSendMessage(message);
      }
      
      if (onChange === undefined) {
        setMessage('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        disabled={disabled}
        className="min-h-[48px] max-h-[200px] text-base resize-none flex-1"
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled}
        className="h-12 w-12 p-0 rounded-full"
        variant="w1Primary"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
