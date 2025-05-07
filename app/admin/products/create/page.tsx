import type { Metadata } from 'next';
import ProductsForm from '../products-form';

export const metadata: Metadata = {
  title: 'Create Product',
};

const CreateProductPage = () => {
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductsForm type="Create" />
      </div>
    </>
  );
};

export default CreateProductPage;
