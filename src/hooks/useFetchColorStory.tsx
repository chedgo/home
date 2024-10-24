import { colorStorySchema, PartialColorStory } from '@/types/ColorStory';
import { useCallback, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { Color } from '@/types/Color';

export function useFetchColorStory() {
  const { submit, isLoading, object } = useObject<{
    text: PartialColorStory['text'];
  }>({
    api: '/api/color-stories',
    schema: colorStorySchema,
  });
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchStory = useCallback(
    (color: Color) => {
      if (!color) {
        return;
      }
      setIsDoneLoading(false);
      try {
        submit({
          color,
        });
        setIsDoneLoading(true);
      } catch (error) {
        setError('Failed to fetch story');
      }
    },
    [submit]
  );

  return {
    fetchStory,
    isLoading,
    story: object,
    isDoneLoading,
    error,
  };
}
