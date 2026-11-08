'use client';

import { DEFAULT_FILTER_VALUE } from '@/components/shared/combobox';
import type { CategoryList } from '@/types/biz';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryListItem from './category-list-item';

export type CategoryListClientProps = {
  urlPrefix: string;
  categoryList: CategoryList;
};

export function CategoryListClient({
  urlPrefix,
  categoryList,
}: CategoryListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('d') || DEFAULT_FILTER_VALUE;

  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: '不限' },
    ...categoryList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];

  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} -> ${value}`);
    const newParams = new URLSearchParams(window.location.search);
    if (value === null || value === DEFAULT_FILTER_VALUE) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    newParams.delete('page');
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  return (
    <div className="hidden md:flex border rounded-lg p-4">
      <ul className="flex flex-col gap-y-2 w-full">
        {categoryFilterItemList.map((item) => (
          <CategoryListItem
            key={item.label}
            title={item.label}
            active={item.value === selectedCategory}
            clickAction={() => handleFilterChange('d', item.value)}
          />
        ))}
      </ul>
    </div>
  );
}
