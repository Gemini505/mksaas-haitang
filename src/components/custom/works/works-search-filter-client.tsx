'use client';

import {
  DEFAULT_FILTER_VALUE,
  ResponsiveComboBox,
} from '@/components/shared/combobox';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_SORT,
  type QueryFilterItem,
  type SortFilterItem,
} from '@/lib/constants';
import type { CategoryFilterItem, TagFilterItem } from '@/types/biz';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  selectedTag?: string;
  selectedCategory?: string;
  selectedSort?: string;
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  filterList: QueryFilterItem[];
  urlPrefix: string;
}

export function WorksSearchFilterClient({
  tagList,
  categoryList,
  sortList,
  filterList,
  urlPrefix,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('d');
  const selectedTag = searchParams.get('t');
  const selectedSort = searchParams.get('sort');
  const selectedFilter = searchParams.get('f');

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

  const handleResetFilters = () => {
    router.push(urlPrefix);
  };

  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: '不限' }, // All Categories
    ...categoryList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  // Single Select for tag
  const tagFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: '不限' }, // All Tags
    ...tagList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  // MultiSelect for tags
  // const tagFilterItemList = [
  //   ...tagList.map((item) => ({
  //     value: item.slug,
  //     label: item.name,
  //   })),
  // ];
  // change default sort value to default filter value
  const sortFilterItemList = sortList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));
  // change default filter value to default filter value
  const queryFilterItemList = filterList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-4 z-10 items-center">
      {/* <div className="flex md:hidden"> */}
      <ResponsiveComboBox
        filterItemList={categoryFilterItemList}
        placeholder="朝代: 不限"
        labelPrefix="朝代: "
        selectedValue={selectedCategory || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange('d', value ?? '')}
      />
      {/* </div> */}

      {/* Single Select for tag */}
      <ResponsiveComboBox
        filterItemList={tagFilterItemList}
        placeholder="类型: 不限"
        labelPrefix="类型: "
        selectedValue={selectedTag || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange('t', value ?? '')}
      />

      {/* MultiSelect for tags */}
      {/* <MultiSelect
        className="shadow-none"
        options={tagFilterItemList.map((tag) => ({
          value: tag.value,
          label: tag.label || '',
        }))}
        onValueChange={(selected) =>
          handleFilterChange(
            't',
            selected.length > 0 ? selected.join(',') : null
          )
        }
        value={selectedTag ? selectedTag.split(',') : []}
        placeholder="Select tags"
        variant="default"
        maxCount={1}
      /> */}

      {/* <ResponsiveComboBox
        filterItemList={queryFilterItemList}
        placeholder={DEFAULT_QUERY.label}
        selectedValue={selectedFilter || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange('f', value ?? '')}
      /> */}

      <ResponsiveComboBox
        filterItemList={sortFilterItemList}
        placeholder={DEFAULT_SORT.label}
        selectedValue={selectedSort || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange('sort', value ?? '')}
      />

      <Button
        variant="outline"
        onClick={handleResetFilters}
        className="cursor-pointer"
      >
        重置
      </Button>
    </div>
  );
}
