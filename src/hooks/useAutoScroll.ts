import { RefObject, useEffect } from 'react';

interface UseAutoScrollProps {
  messagesEndRef: RefObject<HTMLDivElement | null>;
  messagesContainerRef: RefObject<HTMLDivElement | null>;
  dependencies?: any[];
}

export const useAutoScroll = ({ 
  messagesEndRef, 
  messagesContainerRef, 
  dependencies = [] 
}: UseAutoScrollProps) => {
  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  const scrollToBottom = () => {
    if (isNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return { scrollToBottom, isNearBottom };
}; 