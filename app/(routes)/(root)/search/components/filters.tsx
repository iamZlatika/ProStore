'use client';

import type { TCategory } from '@/types';
import { useFilterUrl } from '../useFilterUrl';
import { FilterSection } from './filter-section';
import { prices, ratings, sortOrders } from '../data/data';

interface FiltersProps {
  categories: TCategory[];
}

const Filters = ({ categories }: FiltersProps) => {
  const { getFilterUrl, currentParams } = useFilterUrl();

  return (
    <>
      <FilterSection
        title="Department"
        options={categories}
        currentValue={currentParams.category || 'all'}
        getFilterUrl={getFilterUrl}
        param="category"
        getOptionValue={(item) => item.category}
        getOptionLabel={(item) => item.category}
      />
      <FilterSection
        title="Price"
        options={prices}
        currentValue={currentParams.price || 'all'}
        getFilterUrl={getFilterUrl}
        param="price"
        getOptionValue={(item) => item.value}
        getOptionLabel={(item) => item.name}
      />
      <FilterSection
        title="Customer Ratings"
        options={ratings}
        currentValue={currentParams.rating || 'all'}
        getFilterUrl={getFilterUrl}
        param="rating"
        getOptionValue={(item) => item.toString()}
        getOptionLabel={(item) => `${item.toString()} & up`}
      />
      <FilterSection
        title="Sort by"
        options={sortOrders}
        currentValue={currentParams.sort || 'all'}
        getFilterUrl={getFilterUrl}
        param="sort"
        getOptionValue={(item) => item}
        getOptionLabel={(item) => item}
      />
    </>
  );
};

export default Filters;
