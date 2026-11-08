import CustomQueryPagination from '@/components/custom/pagination';
import QuoteCard from '@/components/custom/quotes/quote-card';
import EmptyGrid from '@/components/shared/empty-grid';
import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_collection_quotes, table_quotes } from '@/db/schema';
import { DEFAULT_SORT, SORT_FILTER_LIST } from '@/lib/constants';
import { constructMetadata } from '@/lib/metadata';
import type { Quote } from '@/types/db';
import type { NextPageProps } from '@/types/next-page-props';
import { and, eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: '名句检索 - ' + t('title'),
    description: t('description'),
    locale,
    pathname: '/quotes',
  });
}

export default async function QuotesPage(props: NextPageProps) {
  const { searchParams } = await props;
  const { c: collection, d: category, t: tag, sort, page } = await searchParams;
  console.log(
    `QuotesPage, collection: ${collection}, category: ${category}, tag: ${tag}, sort: ${sort}, page: ${page}`
  );

  // find all quotes by conditions
  let items: Quote[] = [];
  let total = 0;
  const pageSize = websiteConfig.extend.quotePageSize;
  const currentPage = Number(page) || 1;
  const sortOption =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;

  if (collection) {
    // Build where conditions for collection, category, and tag (on table_quotes)
    const whereConds = [
      eq(table_collection_quotes.collection_id, Number(collection)),
    ];
    if (category) {
      whereConds.push(eq(table_quotes.dynasty, category as string));
    }
    if (tag) {
      whereConds.push(eq(table_quotes.kind, tag as string));
    }
    const where = and(...whereConds);

    const db = await getDb();
    const [joinedQuotes, [{ count }]] = await Promise.all([
      db
        .select({ quote: table_quotes })
        .from(table_collection_quotes)
        .innerJoin(
          table_quotes,
          eq(table_collection_quotes.quote_id, table_quotes.id)
        )
        .where(where)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db
        .select({ count: sql`count(*)` })
        .from(table_collection_quotes)
        .innerJoin(
          table_quotes,
          eq(table_collection_quotes.quote_id, table_quotes.id)
        )
        .where(where),
    ]);
    items = joinedQuotes.map((row) => row.quote);
    total = Number(count);
  } else {
    // Build where conditions for category and tag
    const whereConds = [];
    if (category) {
      whereConds.push(eq(table_quotes.dynasty, category as string));
    }
    if (tag) {
      whereConds.push(eq(table_quotes.kind, tag as string));
    }
    const where = whereConds.length > 0 ? and(...whereConds) : undefined;

    // let orderByField: ReturnType<typeof asc> | ReturnType<typeof desc>;
    // if (sortOption.sortKey === 'views_count') {
    //   orderByField = sortOption.reverse
    //     ? desc(table_quotes.show_order)
    //     : asc(table_quotes.show_order);
    // } else {
    //   orderByField = desc(table_quotes.show_order);
    // }

    const db = await getDb();
    const [quotes, [{ count }]] = await Promise.all([
      db
        .select()
        .from(table_quotes)
        .where(where)
        // .orderBy(orderByField)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db.select({ count: sql`count(*)` }).from(table_quotes).where(where),
    ]);
    items = quotes;
    total = Number(count);
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {/* right content: item grid */}
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          {items && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {items.map((item) => (
                <QuoteCard key={item.id} quote={item} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <CustomQueryPagination
              routePreix="/quotes"
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </>
  );
}
