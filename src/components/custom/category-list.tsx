import type { CategoryList } from '@/types/biz';
import { CategoryListClient } from './category-list-client';

interface CategoryListProps {
  urlPrefix: string;
  categoryList: CategoryList;
}

export async function CategoryListComponent({
  urlPrefix,
  categoryList,
}: CategoryListProps) {
  return (
    <CategoryListClient urlPrefix={urlPrefix} categoryList={categoryList} />
  );
}
