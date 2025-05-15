'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeFirstLetter } from '@/lib/utils';
import type { FieldValues, Path } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}
const TextAreaField = <T extends FieldValues>({ form, name }: TextAreaFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{capitalizeFirstLetter(name)}</FormLabel>
          <FormControl>
            <Textarea placeholder={`Enter product ${name}`} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaField;
