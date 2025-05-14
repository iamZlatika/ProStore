import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { capitalizeFirstLetter } from '@/lib/utils';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

interface BasicFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  onGenerate?: () => void;
}

const BasicField = <T extends FieldValues>({ form, name, onGenerate }: BasicFieldProps<T>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>{capitalizeFirstLetter(name)}</FormLabel>
        <FormControl>
          {onGenerate ? (
            <div className="relative">
              <Input placeholder={`Enter product ${name}`} {...field} />
              <Button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 mt-2"
                onClick={onGenerate}
              >
                Generate
              </Button>
            </div>
          ) : (
            <Input placeholder={`Enter product ${name}`} {...field} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default BasicField;
