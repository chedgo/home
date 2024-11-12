'use client';

import { useRef } from 'react';
import { useChat } from 'ai/react';
import { Message as MessageType } from 'ai';
import { Question } from '@/types/Interviews';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  return (
    <div className="bg-primary text-white w-fit rounded-md p-4 mx-4 flex gap-2">
      <div> {message.role === 'user' ? 'You: ' : 'AI: '}</div>
      <div className="whitespace-pre-wrap -mt-6 pt-6">{message.content}</div>
    </div>
  );
};

interface InterviewSimulatorProps {
  questions: Question[];
}

export const InterviewSimulator = ({ questions }: InterviewSimulatorProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const filteredQuestions = questions.filter((q): q is Question => !!q?.text);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    keepLastMessageOnError: true,
    maxSteps: 1,
    api: '/api/chat',
    body: {
      questions: filteredQuestions,
    },
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'saveEvaluation') {
        console.log('server side call- evaluation:', toolCall);
      }
    },
  });
  
  useAutoScroll({
    messagesEndRef,
    messagesContainerRef,
    dependencies: [messages]
  });

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={messagesContainerRef}
        className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          className="w-full border-2 border-primary/50 focus:border-primary focus:outline-none p-2 rounded"
          name="prompt"
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}; 