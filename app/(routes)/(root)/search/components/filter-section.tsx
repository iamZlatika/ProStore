import Link from 'next/link';

interface FilterSectionProps<T> {
  title: string;
  param: string;
  options: T[];
  currentValue: string;
  getFilterUrl: (params: Record<string, string>) => string;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
}

export const FilterSection = <T,>({
  title,
  param,
  options,
  currentValue,
  getFilterUrl,
  getOptionValue,
  getOptionLabel,
}: FilterSectionProps<T>) => {
  return (
    <div className="mb-4">
      <div className="text-xl mb-2 mt-3">{title}</div>
      <ul className="space-y-1">
        <li>
          <Link
            className={`${(currentValue === 'all' || currentValue === '') && 'font-bold'}`}
            href={getFilterUrl({ [param]: 'all' })}
          >
            Any
          </Link>
        </li>
        {options.map((option, index) => {
          const value = getOptionValue(option);
          const label = getOptionLabel(option);

          return (
            <li key={index}>
              <Link
                className={`${currentValue === value && 'font-bold'}`}
                href={getFilterUrl({ [param]: value })}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
