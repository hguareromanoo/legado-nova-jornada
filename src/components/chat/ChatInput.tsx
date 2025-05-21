
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/contexts/ChatContext';

interface ChatInputProps {
  // Make these props optional with default values
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (text: string) => void;
  onOptionSelect?: (response: any) => void;
  currentQuestion?: any;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  value, 
  onChange, 
  onSubmit, 
  currentQuestion,
  onOptionSelect 
}: ChatInputProps) => {
  const [message, setMessage] = useState(value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isSessionComplete } = useChat();

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setMessage(value);
    }
  }, [value]);

  // Auto-focus on the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !isSessionComplete) {
      textareaRef.current.focus();
    }
  }, [isSessionComplete]);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isSessionComplete) {
      if (onSubmit) {
        onSubmit(message);
      } else if (onSendMessage) {
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
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 relative">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isSessionComplete 
            ? "Sessão concluída! Prossiga para a próxima etapa." 
            : "Digite sua mensagem..."}
          disabled={disabled || isSessionComplete}
          className="min-h-[48px] max-h-[200px] text-base resize-none flex-1"
        />
        {isSessionComplete && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-80 flex items-center justify-center rounded-md pointer-events-none">
            <span className="text-sm font-medium text-gray-600">Sessão concluída</span>
          </div>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled || isSessionComplete}
        className="h-12 w-12 p-0 rounded-full"
        variant="w1Primary"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
