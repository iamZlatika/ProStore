import type { TInsertProduct } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UploadButton } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface ImagesFieldProps {
  form: UseFormReturn<TInsertProduct>;
  images: string[];
}
const ImagesField = ({ form, images }: ImagesFieldProps) => {
  const handleRemoveImage = (imageToRemove: string) => {
    const updatedImages = images.filter((image) => image !== imageToRemove);
    form.setValue('images', updatedImages);
  };
  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem className="w-full">
          <FormLabel>Images</FormLabel>
          <Card>
            <CardContent className="space-y-2 mt-2 min-h-48">
              <div className="flex-start space-x-2">
                {images.map((image: string) => (
                  <div key={image} className="relative">
                    <Image
                      src={image}
                      alt="product image"
                      className="w-20 h-20 object-cover object-center rounded-sm"
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-transparent text-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      onClick={() => handleRemoveImage(image)}
                    >
                      X
                    </button>
                  </div>
                ))}
                <FormControl>
                  <UploadButton
                    endpoint="imageUploader"
                    className="upload-thing"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue('images', [...images, res[0].url]);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`ERROR! ${error.message}`);
                    }}
                  />
                </FormControl>
              </div>
            </CardContent>
          </Card>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImagesField;
