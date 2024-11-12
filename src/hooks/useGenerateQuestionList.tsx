import {
  questionListSchema,
  // partialQuestionListSchema
} from '@/types/Interviews';
import { useCallback, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';

export function useGenerateQuestionList() {
  const { submit, isLoading, object } = useObject<{
    questions: string[];
  }>({
    api: '/api/question-list',
    schema: questionListSchema,
  });
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  const fetchQuestionList = useCallback(
    (jobPost: string, companyProfile: string, resume: string) => {
      if (!jobPost || !companyProfile || !resume) {
        return;
      }
      setIsDoneLoading(false);

      submit({
        jobPost,
        companyProfile,
        resume,
      });
      setIsDoneLoading(true);
    },
    [submit]
  );

  return {
    fetchQuestionList,
    isLoading,
    questions: object?.questions || [],
    isDoneLoading,
  };
}
