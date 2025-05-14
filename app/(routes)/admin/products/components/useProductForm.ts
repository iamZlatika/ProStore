import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { insertProductSchema } from '@/lib/validators';
import { productDefaultValues } from '@/lib/constants';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import type { TInsertProduct } from '@/types';

export const useProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: TInsertProduct;
  productId?: string;
}) => {
  const router = useRouter();

  const defaultValues = type === 'Update' && product ? product : productDefaultValues;

  const form = useForm<TInsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues,
  });

  const onSubmit = async (values: TInsertProduct) => {
    if (type === 'Create') {
      const result = await createProduct(values);
      toast[result.success ? 'success' : 'error'](result.message);
      if (result.success) router.push('/admin/products');
    }
    if (type === 'Update') {
      if (!productId) return router.push('/admin/products');
      const result = await updateProduct({ ...values, id: productId });
      toast[result.success ? 'success' : 'error'](result.message);
      if (result.success) router.push('/admin/products');
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return { form, onSubmit, images, isFeatured, banner };
};
