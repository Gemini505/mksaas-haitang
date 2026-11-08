import CustomQueryPagination from '@/components/custom/pagination';
import WorkCard from '@/components/custom/works/work-card';
import EmptyGrid from '@/components/shared/empty-grid';
import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_collection_works, table_works } from '@/db/schema';
import { DEFAULT_SORT, SORT_FILTER_LIST } from '@/lib/constants';
import { constructMetadata } from '@/lib/metadata';
import type { CollectionWork, Work } from '@/types/db';
import type { NextPageProps } from '@/types/next-page-props';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
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
    title: '诗文检索 - ' + t('title'),
    description: t('description'),
    locale,
    pathname: '/works',
  });
}

export default async function WorksPage(props: NextPageProps) {
  const { searchParams } = await props;
  const { c: collection, d: category, t: tag, sort, page } = await searchParams;
  console.log(
    `WorksPage, collection: ${collection}, category: ${category}, tag: ${tag}, sort: ${sort}, page: ${page}`
  );

  // find all works by conditions
  let items: Work[] | CollectionWork[] = [];
  let total = 0;
  const pageSize = websiteConfig.extend.workPageSize;
  const currentPage = Number(page) || 1;
  const sortOption =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;

  if (collection) {
    // Build where conditions for collection, category, and tag
    const whereConds = [
      eq(table_collection_works.collection_id, Number(collection)),
    ];
    if (category) {
      whereConds.push(
        eq(table_collection_works.work_dynasty, category as string)
      );
    }
    if (tag) {
      whereConds.push(eq(table_collection_works.work_kind, tag as string));
    }
    const where = and(...whereConds);

    let orderByField: ReturnType<typeof asc> | ReturnType<typeof desc>;
    if (sortOption.sortKey === 'views_count') {
      orderByField = sortOption.reverse
        ? asc(table_collection_works.show_order)
        : desc(table_collection_works.show_order);
    } else {
      orderByField = asc(table_collection_works.show_order);
    }

    const db = await getDb();
    const [works, [{ count }]] = await Promise.all([
      db
        .select()
        .from(table_collection_works)
        .where(where)
        .orderBy(orderByField)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db
        .select({ count: sql`count(*)` })
        .from(table_collection_works)
        .where(where),
    ]);
    items = works;
    total = Number(count);
  } else {
    // Build where conditions for category and tag
    const whereConds = [];
    if (category) {
      whereConds.push(eq(table_works.dynasty, category as string));
    }
    if (tag) {
      whereConds.push(eq(table_works.kind, tag as string));
    }
    const where = whereConds.length > 0 ? and(...whereConds) : undefined;

    let orderByField: ReturnType<typeof asc> | ReturnType<typeof desc>;
    if (sortOption.sortKey === 'views_count') {
      orderByField = sortOption.reverse
        ? desc(table_works.posts_count)
        : asc(table_works.posts_count);
    } else {
      orderByField = desc(table_works.posts_count);
    }

    const db = await getDb();
    const [works, [{ count }]] = await Promise.all([
      db
        .select()
        .from(table_works)
        .where(where)
        .orderBy(orderByField)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db.select({ count: sql`count(*)` }).from(table_works).where(where),
    ]);
    items = works;
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
                <WorkCard key={item.id} work={item} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <CustomQueryPagination
              routePreix="/works"
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </>
  );
}
