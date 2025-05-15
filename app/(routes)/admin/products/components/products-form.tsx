'use client';

import { Form } from '@/components/ui/form';
import slugify from 'slugify';
import type { TInsertProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { useProductForm } from './useProductForm';
import BasicField from '@/components/shared/form/fields/basic-field';
import ImagesField from '@/components/shared/form/fields/images-field';
import IsFeaturedField from '@/components/shared/form/fields/is-featured-field';
import TextAreaField from '@/components/shared/form/fields/text-area-field';

interface ProductsFormProps {
  type: 'Create' | 'Update';
  product?: TInsertProduct;
  productId?: string;
}
const ProductForm = ({ type, product, productId }: ProductsFormProps) => {
  const { form, onSubmit, images, isFeatured, banner } = useProductForm({
    type,
    product,
    productId,
  });

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 md:flex-row">
          <BasicField form={form} name="name" />
          <BasicField
            form={form}
            name="slug"
            onGenerate={() => {
              form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
            }}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <BasicField form={form} name="category" />
          <BasicField form={form} name="brand" />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <BasicField form={form} name="price" />
          <BasicField form={form} name="stock" />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <ImagesField form={form} images={images} />
        </div>
        <div className="upload-field">
          Featured Product
          <IsFeaturedField form={form} isFeatured={isFeatured} banner={banner} />
        </div>
        <div>
          <TextAreaField form={form} name="description" />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? 'Submitting' : `${type} product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
