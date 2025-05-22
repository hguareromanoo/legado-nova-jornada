
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ConversationMessage } from '@/types/chat';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  messages: ConversationMessage[];
  isTyping?: boolean;
}

const MessageList = ({ messages, isTyping = false }: MessageListProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

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
      {messages.map((message, index) => {
        // Check if this is the last message from the assistant and it's empty (still typing)
        const isEmptyLastMessage = 
          index === messages.length - 1 && 
          message.role === 'assistant' && 
          message.content === '';

        return (
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
              {isEmptyLastMessage && isTyping ? (
                <div className="flex items-center space-x-2 py-1">
                  <span className="text-gray-700 typing-animation">
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-base md:text-lg whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Show typing indicator outside of any message */}
      {isTyping && messages[messages.length - 1]?.content !== '' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
            <div className="flex items-center">
              <span className="text-gray-700 typing-animation">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={endOfMessagesRef} />

      <style dangerouslySetInnerHTML={{ __html: `
        .typing-animation {
          display: inline-flex;
          font-size: 24px;
          line-height: 1;
        }
        .typing-animation .dot {
          animation: typingAnimation 1.4s infinite ease-in-out;
          margin-right: 2px;
        }
        .typing-animation .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-animation .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-animation .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typingAnimation {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
};

export default MessageList;
