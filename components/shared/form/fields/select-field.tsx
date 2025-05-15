'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalizeFirstLetter } from '@/lib/utils';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: string[];
}

const SelectField = <T extends FieldValues>({ form, name, options }: SelectFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{capitalizeFirstLetter(name)}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((role) => (
                <SelectItem key={role} value={role}>
                  {capitalizeFirstLetter(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
