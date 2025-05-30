import ProductCard from '@/components/shared/product/product-card';
import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions';
import type { TSearchParams } from '@/types';
import Filters from './components/filters';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata(props: {
  searchParams: Promise<{
    query: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    query = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = query && query !== 'all' && query.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? query : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

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

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <Filters categories={categories} />
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {query !== 'all' && query !== '' && 'Query: ' + query}
            {category !== 'all' && category !== '' && 'Category: ' + category}
            {price !== 'all' && ' Price: ' + price}
            {rating !== 'all' && ' Rating: ' + rating + ' stars & up'}
            &nbsp;
            {(query !== 'all' && query !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
        </div>
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
