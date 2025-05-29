import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts } from '@/lib/actions/product.actions';
import type { TSearchParams } from '@/types';

const SearchPage = async (props: { searchParams: Promise<TSearchParams> }) => {
  const {
    query = 'all',
    category = 'all',
    page = '1',
    price = 'all',
    rating = 'all',
    sort = 'newest',
  } = await props.searchParams;
  const products = await getAllProducts({
    query,
    category,
    page: Number(page),
    price,
    rating,
    sort,
  });
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">Filters</div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
