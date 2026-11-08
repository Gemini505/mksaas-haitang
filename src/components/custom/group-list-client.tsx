'use client';

import { DEFAULT_FILTER_VALUE } from '@/components/shared/combobox';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { GroupList } from '@/types/biz';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type GroupListClientProps = {
  urlPrefix: string;
  groupList: GroupList;
};

export function GroupListClient({
  urlPrefix,
  groupList,
}: GroupListClientProps) {
  // console.log(JSON.stringify(groupList, null, 2));
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('c') || DEFAULT_FILTER_VALUE;
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedCategory || selectedCategory === DEFAULT_FILTER_VALUE) {
      setOpenCategories(new Set());
      return;
    }

    const parentCategory = groupList.find((group) =>
      group.categories.some((category) => category.slug === selectedCategory)
    );

    if (parentCategory) {
      setOpenCategories(new Set([parentCategory.slug]));
    }
  }, [selectedCategory, groupList]);

  // All Categories
  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: '选集: 不限', subCategories: [] },
    ...groupList.map((item) => ({
      value: item.slug,
      label: item.name,
      subCategories:
        item.categories.map((category) => ({
          title: category.name || '',
          slug: category.slug || '',
        })) || [],
    })),
  ];

  const handleFilterChange = (
    type: string,
    value: string,
    isSubCategory = false
  ) => {
    if (!isSubCategory && value !== DEFAULT_FILTER_VALUE) {
      return;
    }

    const newParams = new URLSearchParams(window.location.search);
    if (value === null || value === DEFAULT_FILTER_VALUE) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    newParams.delete('page');
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  const toggleCategory = (categoryValue: string) => {
    const newOpenCategories = new Set<string>();
    if (!openCategories.has(categoryValue)) {
      newOpenCategories.add(categoryValue);
    }
    setOpenCategories(newOpenCategories);
  };

  return (
    <div className="hidden md:flex border rounded-lg p-4">
      <ul className="flex flex-col gap-y-2 w-full">
        {categoryFilterItemList.map((item) => {
          const isOpen = openCategories.has(item.value);
          const isAllCategories = item.value === DEFAULT_FILTER_VALUE;

          return (
            <Collapsible
              key={item.value}
              open={isOpen}
              onOpenChange={() => toggleCategory(item.value)}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant={
                    isAllCategories && item.value === selectedCategory
                      ? 'default'
                      : 'ghost'
                  }
                  size="sm"
                  className="w-full px-3 py-3 justify-between cursor-pointer"
                  onClick={(e) => {
                    if (isAllCategories) {
                      handleFilterChange('c', item.value);
                    }
                    toggleCategory(item.value);
                  }}
                >
                  <span>{item.label}</span>
                  {item.subCategories.length > 0 && (
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </Button>
              </CollapsibleTrigger>
              {item.subCategories.length > 0 && (
                <CollapsibleContent className="space-y-2">
                  {item.subCategories.map((subCategory) => (
                    <Button
                      key={subCategory.slug}
                      variant={
                        subCategory.slug === selectedCategory
                          ? 'default'
                          : 'ghost'
                      }
                      size="sm"
                      className="w-full px-6 py-2 justify-start cursor-pointer"
                      onClick={() =>
                        handleFilterChange('c', subCategory.slug, true)
                      }
                    >
                      {subCategory.title}
                    </Button>
                  ))}
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </ul>
    </div>
  );
}
