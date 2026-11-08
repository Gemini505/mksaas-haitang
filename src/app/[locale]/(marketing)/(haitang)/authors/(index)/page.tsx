import AuthorCard from '@/components/custom/authors/author-card';
import CustomQueryPagination from '@/components/custom/pagination';
import EmptyGrid from '@/components/shared/empty-grid';
import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_authors } from '@/db/schema';
import { constructMetadata } from '@/lib/metadata';
import type { Author } from '@/types/db';
import type { NextPageProps } from '@/types/next-page-props';
import { desc, eq, sql } from 'drizzle-orm';
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
    title: '作者检索 - ' + t('title'),
    description: t('description'),
    locale,
    pathname: '/authors',
  });
}

export default async function AuthorsPage(props: NextPageProps) {
  const { searchParams } = await props;
  const { d: category, page } = await searchParams;
  console.log(`AuthorsPage, category: ${category}, page: ${page}`);

  // find all authors by conditions
  let items: Author[] = [];
  let total = 0;
  const pageSize = websiteConfig.extend.authorPageSize;
  const currentPage = Number(page) || 1;

  const db = await getDb();
  if (category) {
    const [authors, [{ count }]] = await Promise.all([
      db
        .select()
        .from(table_authors)
        .where(eq(table_authors.dynasty, category as string))
        .orderBy(desc(table_authors.works_count))
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db
        .select({ count: sql`count(*)` })
        .from(table_authors)
        .where(eq(table_authors.dynasty, category as string)),
    ]);
    items = authors;
    total = Number(count);
  } else {
    const [authors, [{ count }]] = await Promise.all([
      db
        .select()
        .from(table_authors)
        .orderBy(desc(table_authors.works_count))
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize),
      db.select({ count: sql`count(*)` }).from(table_authors),
    ]);
    items = authors;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <AuthorCard key={item.id} author={item} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <CustomQueryPagination
              routePreix="/authors"
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </>
  );
}
