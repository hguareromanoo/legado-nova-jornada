
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ConversationMessage } from '@/types/chat';

interface MessageListProps {
  messages: ConversationMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center">
          A conversa começará em breve. Aguarde...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.message_id || `msg-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`px-4 py-3 rounded-2xl max-w-[80%] ${ 
              message.role === 'user' 
                ? 'bg-w1-primary-accent text-w1-primary-dark rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            <p className="text-base md:text-lg whitespace-pre-wrap">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </motion.div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
