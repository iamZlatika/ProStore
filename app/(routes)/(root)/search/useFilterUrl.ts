'use client';

import type { TSearchParams } from '@/types';
import { useSearchParams } from 'next/navigation';

export function useFilterUrl() {
  const searchParams = useSearchParams();

  const currentParams: Partial<TSearchParams> = {
    query: searchParams.get('query') || undefined,
    category: searchParams.get('category') || undefined,
    price: searchParams.get('price') || undefined,
    rating: searchParams.get('rating') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
  };

  const getFilterUrl = (updates: Partial<TSearchParams>) => {
    const merged: Record<string, string> = {
      ...Object.entries(currentParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>,
      ),
      ...Object.entries(updates).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    return `/search?${new URLSearchParams(merged).toString()}`;
  };

  return { getFilterUrl, currentParams };
}
