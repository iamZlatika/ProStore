import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { TInsertProduct } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface IsFeaturedFieldProps {
  form: UseFormReturn<TInsertProduct>;
  isFeatured: boolean;
  banner: string | null;
}
const IsFeaturedField = ({ form, isFeatured, banner }: IsFeaturedFieldProps) => {
  const handleRemoveBanner = () => {
    form.setValue('banner', null);
  };
  return (
    <Card>
      <CardContent className="space-y-2 mt-2">
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="space-x-2 items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Is Featured?</FormLabel>
            </FormItem>
          )}
        />
        {isFeatured && banner && (
          <div className="relative">
            <Image
              src={banner}
              alt="banner image"
              className="w-full object-cover object-center rounded-sm"
              width={1920}
              height={680}
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-transparent text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              onClick={handleRemoveBanner}
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
        )}
        {isFeatured && !banner && (
          <UploadButton
            endpoint="imageUploader"
            className="upload-thing"
            onClientUploadComplete={(res: { url: string }[]) => {
              form.setValue('banner', res[0].url);
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default IsFeaturedField;
