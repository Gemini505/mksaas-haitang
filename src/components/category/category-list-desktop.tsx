'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { CategoryList } from '@/types/biz';
import { useParams } from 'next/navigation';
import FilterItemDesktop from './filter-item-desktop';

export type CategoryListDesktopProps = {
  categoryList: CategoryList;
};

export function CategoryListDesktop({
  categoryList,
}: CategoryListDesktopProps) {
  const { slug } = useParams() as { slug?: string };

  return (
    <ScrollArea className="hidden md:flex w-full pb-4">
      <ul className="flex gap-x-2">
        <FilterItemDesktop title="All" href="/category" active={!slug} />

        {categoryList.map((item) => (
          <FilterItemDesktop
            key={item.slug}
            title={item.name}
            href={`/category/${item.slug}`}
            active={item.slug === slug}
          />
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
