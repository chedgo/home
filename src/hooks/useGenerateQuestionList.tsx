import { questionSchema, PartialQuestion } from '@/types/Interviews';
import { useCallback, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import mockData from '@/app/interview-practice/mockData.json';

export function useGenerateQuestionList() {
  const { submit, isLoading, object } = useObject<PartialQuestion[]>({
    api: '/api/question-list',
    schema: questionSchema.array(),
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
    questions: mockData ? mockData.questions : object || [],
    isDoneLoading,
  };
}
