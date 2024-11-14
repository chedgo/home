'use client';

import { useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { Message as MessageType } from 'ai';
import { Question } from '@/types/Interviews';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface MessageProps {
  message: MessageType;
}

const FeedbackMessage = ({ feedback }: { feedback: string }) => {
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  return feedback && !feedbackExpanded ? (
    <div className="self-end mr-8 cursor-pointer text-primary">
      <button onClick={() => setFeedbackExpanded((prev) => !prev)}>
        ✨ feedback available
      </button>
    </div>
  ) : (
    <div
      className="self-end mr-8 max-w-xl text-sm p-2 border rounded-md cursor-pointer text-primary border-primary"
      onClick={() => setFeedbackExpanded((prev) => !prev)}
    >
      {feedback}
    </div>
  );
};

const Message = ({ message }: MessageProps) => {
  if (!message.content) return null;
  if (
    message.content === '' &&
    message.toolInvocations?.[0]?.toolName === 'provideFeedback'
  ) {
    return (
      <FeedbackMessage
        feedback={message.toolInvocations?.[0]?.args.feedback as string}
      />
    );
  }
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

interface ErrorResponse {
  error: string;
  message: string;
  suggestion?: string;
  flaggedContent?: string[];
}

export const InterviewSimulator = ({ questions }: InterviewSimulatorProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const filteredQuestions = questions.filter((q): q is Question => !!q?.text);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
  } = useChat({
    keepLastMessageOnError: true,
    maxSteps: 1,
    api: '/api/chat',
    body: {
      questions: filteredQuestions,
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message) as ErrorResponse;
        setError(errorData);
      } catch {
        setError({
          error: 'Error',
          message: error.message,
        });
      }
    },
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'provideFeedback') {
        console.log('client side call- feedback:', toolCall);
        return {
          result: 'Feedback saved successfully!',
          toolCallId: toolCall.toolCallId,
        };
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await originalHandleSubmit(e);
  };

  useAutoScroll({
    messagesEndRef,
    messagesContainerRef,
    dependencies: [messages],
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

      {error && (
        <div className="mx-4 p-4 border-2 border-red-500 rounded-md">
          <div className="text-red-500 font-bold">{error.error}</div>
          <div className="mt-2">{error.message}</div>
          {error.suggestion && (
            <div className="mt-2 text-gray-600">{error.suggestion}</div>
          )}
          {error.flaggedContent && (
            <div className="mt-2">
              Content flagged in: {error.flaggedContent.join(', ')}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          className="w-full border-2 border-primary/50 focus:border-primary focus:outline-none p-2 rounded"
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder={
            error ? 'Please revise your message...' : 'Type your message...'
          }
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
