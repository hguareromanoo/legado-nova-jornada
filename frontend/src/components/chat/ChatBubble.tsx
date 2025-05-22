
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

interface ChatBubbleProps {
  message: Message;
  onResponse: (response: any) => void;
  isLastMessage: boolean;
}

const ChatBubble = ({ message, onResponse, isLastMessage }: ChatBubbleProps) => {
  const isAssistant = message.sender === 'assistant';
  
  return (
    <div className={cn(
      "mb-4", 
      isAssistant ? "flex justify-start" : "flex justify-end"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-xl p-3",
        isAssistant 
          ? "bg-gray-100 text-gray-800 rounded-tl-none" 
          : "bg-w1-primary-accent text-w1-primary-dark rounded-tr-none"
      )}>
        {message.content}
        
        {/* Render options buttons if it's an options type message and it's from the assistant */}
        {isAssistant && message.type === 'options' && isLastMessage && message.options && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.options.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={message.sender === 'assistant' ? 'outline' : 'default'}
                className="text-xs"
                onClick={() => onResponse(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
