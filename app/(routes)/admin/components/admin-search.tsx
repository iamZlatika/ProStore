'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminSearch = () => {
  const pathname = usePathname();
  const adminPaths = ['/admin/orders', '/admin/users', '/admin/products'];
  const formActionUrl = adminPaths.find((path) => pathname.includes(path)) || '/admin/products';

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState('');

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
