import { RefObject, useEffect, useCallback } from 'react';

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
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, [messagesContainerRef]);

  const scrollToBottom = useCallback(() => {
    if (isNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNearBottom, messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, ...dependencies]);

  return { scrollToBottom, isNearBottom };
}; 