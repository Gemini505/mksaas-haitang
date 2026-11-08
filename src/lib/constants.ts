import authors from '@/scripts/data/authors.json';
import collections from '@/scripts/data/collections.json';
import dynasties from '@/scripts/data/dynasties.json';
import groups from '@/scripts/data/groups.json';
import types from '@/scripts/data/types.json';

/**
 * Max file size (4MB)
 * https://vercel.com/docs/functions/limitations#request-body-size
 */
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

/**
 * in next 30 days for credits expiration
 */
export const CREDITS_EXPIRATION_DAYS = 30;
/**
 * Polling interval (2 seconds)
 */
export const PAYMENT_POLL_INTERVAL = 2000;

/**
 * Max polling time (1 minute)
 */
export const PAYMENT_MAX_POLL_TIME = 60000;
/**
 * Max retry attempts for finding payment records
 */
export const PAYMENT_RECORD_RETRY_ATTEMPTS = 30;

/**
 * Retry delay between attempts (2 seconds)
 */
export const PAYMENT_RECORD_RETRY_DELAY = 2000;

export type SortFilterItem = {
  label: string;
  slug: string | null;
  sortKey: 'views_count' | 'favorites_count';
  reverse: boolean;
};

export const DEFAULT_SORT: SortFilterItem = {
  label: '浏览数 (降序)',
  slug: null,
  sortKey: 'views_count',
  reverse: true,
};

export const SORT_FILTER_LIST: SortFilterItem[] = [
  DEFAULT_SORT,
  {
    label: '浏览数 (升序)',
    slug: 'views_count_asc',
    sortKey: 'views_count',
    reverse: false,
  },
  // {
  //   label: '收藏数 (降序)',
  //   slug: 'favorites_count_desc',
  //   sortKey: 'favorites_count',
  //   reverse: true,
  // },
  // {
  //   label: '收藏数 (升序)',
  //   slug: 'favorites_count_asc',
  //   sortKey: 'favorites_count',
  //   reverse: false,
  // },
];

export type QueryFilterItem = {
  label: string;
  slug: string | null;
};

export const DEFAULT_QUERY: QueryFilterItem = {
  label: 'No Filter',
  slug: null,
};

export const QUERY_FILTER_LIST: QueryFilterItem[] = [
  DEFAULT_QUERY,
  {
    label: 'Featured',
    slug: 'featured==true',
  },
];

export const DYNASTY_LIST = dynasties.map(
  (item: { name: string; slug: string }) => ({
    name: item.name,
    slug: item.slug,
  })
);

export const TYPE_LIST = types.map((item) => ({
  slug: item.slug,
  name: item.name,
}));

export const GROUP_LIST = groups.map(
  (item: {
    slug: string;
    name: string;
    categories: { slug: string; name: string }[];
  }) => ({
    slug: item.slug,
    name: item.name,
    categories: item.categories.map((category) => ({
      slug: category.slug,
      name: category.name,
    })),
  })
);

export const COLLECTION_LIST = collections.map(
  (item: { name: string; slug: string }) => ({
    name: item.name,
    slug: item.slug,
  })
);

export const AUTHOR_LIST = authors.map(
  (item: { name: string; slug: string }) => ({
    name: item.name,
    slug: item.slug,
  })
);
