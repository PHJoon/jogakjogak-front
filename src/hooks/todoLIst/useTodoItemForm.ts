import { useForm } from 'react-hook-form';

import { TodoCategory } from '@/types/jds';

export default function useTodoItemForm({
  initialData = {
    category: 'STRUCTURAL_COMPLEMENT_PLAN' as TodoCategory,
    title: '',
    content: '',
  },
}: {
  initialData?: {
    category: TodoCategory;
    title: string;
    content: string;
  };
}) {
  const { handleSubmit, setValue, getValues, reset, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      category: initialData.category || 'STRUCTURAL_COMPLEMENT_PLAN',
      title: initialData.title || '',
      content: initialData.content || '',
    },
  });

  return {
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
  };
}
