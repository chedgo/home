import {
  scriptSchema,
  // partialScriptSchema
} from '@/types/Interviews';
import { useCallback, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';

export function useGenerateScript() {
  const { submit, isLoading, object } = useObject<{
    script: string;
  }>({
    api: '/api/generate-script',
    schema: scriptSchema,
  });
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  const fetchScript = useCallback(
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
    fetchScript,
    isLoading,
    script: object?.script || '',
    isDoneLoading,
  };
}
