import CustomQueryPagination from '@/components/custom/pagination';
import SubTitle from '@/components/custom/sub-title';
import WorkCard from '@/components/custom/works/work-card';
import EmptyGrid from '@/components/shared/empty-grid';
import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_authors, table_works } from '@/db/schema';
import { constructMetadata } from '@/lib/metadata';
import type { NextPageProps } from '@/types/next-page-props';
import { eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata | undefined> {
  const { locale, id } = await params;
  const db = await getDb();
  const authors = await db
    .select()
    .from(table_authors)
    .where(eq(table_authors.id, Number.parseInt(id as string)))
    .limit(1);

  if (authors.length === 0) {
    console.error(`AuthorPage, author not found, id: ${id}`);
    return undefined;
  }
  const author = authors[0];
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: author.name + ' - ' + t('title'),
    description: author.intro + ' - ' + t('description'),
    locale,
    pathname: `/authors/${id}`,
  });
}

export default async function AuthorPage(props: NextPageProps) {
  const { params, searchParams } = await props;
  const { id } = await params;
  const { page } = await searchParams;
  console.log(`AuthorPage, id: ${id}, page: ${page}`);

  // find author by id
  const db = await getDb();
  const authors = await db
    .select()
    .from(table_authors)
    .where(eq(table_authors.id, Number.parseInt(id as string)))
    .limit(1);

  if (authors.length === 0) {
    console.error(`AuthorPage, author not found, id: ${id}`);
    return notFound();
  }

  const author = authors[0];
  const pageSize = websiteConfig.extend.authorPageSize;
  const currentPage = Number(page) || 1;
  console.log(`AuthorPage, pageSize: ${pageSize}, currentPage: ${currentPage}`);

  const [works, [{ count }]] = await Promise.all([
    db
      .select()
      .from(table_works)
      .where(eq(table_works.author_id, Number.parseInt(id as string)))
      // .orderBy(asc(table_works.show_order))
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize),
    db
      .select({ count: sql`count(*)` })
      .from(table_works)
      .where(eq(table_works.author_id, Number.parseInt(id as string))),
  ]);

  const total = Number(count);
  const totalPages = Math.ceil(total / pageSize);
  const items = works;

  return (
    <>
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold">{author.name}</h2>
          <p className="text-base leading-relaxed flex items-center gap-2 text-muted-foreground">
            <a
              href={`/works?d=${author.dynasty}`}
              className="animated-underline hover:text-primary"
            >
              [{author.dynasty}]
            </a>
            <span>
              {author.birth_year} - {author.death_year}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <SubTitle title="简介" description="" />
          <p className="text-base leading-relaxed">{author.intro}</p>
        </div>
        <div className="flex flex-col gap-4">
          <SubTitle title="作品" description={`(${total} 首)`} />
          {/* when no items are found */}
          {items?.length === 0 && <EmptyGrid />}

          {/* when items are found */}
          {items && items.length > 0 && (
            <section className="">
              {items && items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item) => (
                    <WorkCard key={item.id} work={item} />
                  ))}
                </div>
              )}

              <div className="mt-8 flex items-center justify-center">
                <CustomQueryPagination
                  routePreix={`/authors/${id}`}
                  totalPages={totalPages}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
