import {
  DYNASTY_LIST,
  QUERY_FILTER_LIST,
  SORT_FILTER_LIST,
  TYPE_LIST,
} from '@/lib/constants';
import { QuotesSearchFilterClient } from './quotes-search-filter-client';

interface SearchFilterProps {
  urlPrefix: string;
}

export async function QuotesSearchFilter({ urlPrefix }: SearchFilterProps) {
  return (
    <div>
      {/* Desktop View, has Container */}
      <div className="hidden md:flex md:flex-col">
        <div className="w-full">
          <QuotesSearchFilterClient
            tagList={TYPE_LIST}
            categoryList={DYNASTY_LIST}
            sortList={SORT_FILTER_LIST}
            filterList={QUERY_FILTER_LIST}
            urlPrefix={urlPrefix}
          />
        </div>
      </div>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col">
        <div className="">
          <QuotesSearchFilterClient
            tagList={TYPE_LIST}
            categoryList={DYNASTY_LIST}
            sortList={SORT_FILTER_LIST}
            filterList={QUERY_FILTER_LIST}
            urlPrefix={urlPrefix}
          />
        </div>
      </div>
    </div>
  );
}
