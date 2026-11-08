import SubTitle from '@/components/custom/sub-title';
import FavoriteButton from '@/components/custom/works/favorite-button';
import { getDb } from '@/db';
import { table_collection_works, table_quotes, table_works } from '@/db/schema';
import { constructMetadata } from '@/lib/metadata';
import type { NextPageProps } from '@/types/next-page-props';
import { asc, eq } from 'drizzle-orm';
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
  const works = await db
    .select()
    .from(table_works)
    .where(eq(table_works.id, Number.parseInt(id as string)))
    .limit(1);

  if (works.length === 0) {
    console.error(`WorkPage, work not found, id: ${id}`);
    return undefined;
  }
  const work = works[0];
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: work.title + ' - ' + t('title'),
    description: work.intro + ' - ' + t('description'),
    locale,
    pathname: `/works/${id}`,
  });
}

export default async function WorkPage(props: NextPageProps) {
  const { params } = await props;
  const { id } = await params;
  console.log(`WorkPage, id: ${id}`);

  // find work by id
  const db = await getDb();
  const works = await db
    .select()
    .from(table_works)
    .where(eq(table_works.id, Number.parseInt(id as string)))
    .limit(1);

  if (works.length === 0) {
    console.error(`WorkPage, work not found, id: ${id}`);
    return notFound();
  }

  const work = works[0];
  // console.log(`WorkPage, work.layout: ${work.layout}`);
  // console.log(`WorkPage, work: ${JSON.stringify(work)}`);

  const collections = await db
    .select()
    .from(table_collection_works)
    .where(eq(table_collection_works.work_id, Number.parseInt(id as string)))
    .orderBy(asc(table_collection_works.show_order));

  const quotes = await db
    .select()
    .from(table_quotes)
    .where(eq(table_quotes.work_id, Number.parseInt(id as string)));

  return (
    <>
      <div className="flex-1 flex flex-col gap-8">
        {/* title, author, dynasty */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold">{work.title}</h2>
          <p className="text-base leading-relaxed flex items-center gap-2 text-muted-foreground">
            <a
              href={`/works?d=${work.dynasty}`}
              className="animated-underline hover:text-primary"
            >
              [{work.dynasty}]
            </a>
            <a
              href={`/authors/${work.author_id}`}
              className="animated-underline hover:text-primary"
            >
              {work.author}
            </a>
          </p>
        </div>

        {/* content */}
        <div className="flex flex-col gap-4">
          {work.layout === 'center' && (
            <div className="flex justify-center">
              <pre className="whitespace-pre-wrap leading-relaxed font-wen-kai">
                {work.content}
              </pre>
            </div>
          )}
          {work.layout === 'indent' && (
            <div className="flex justify-center">
              <pre className="whitespace-pre-wrap leading-relaxed font-wen-kai">
                {work.content}
              </pre>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <FavoriteButton
            workId={work.id}
            workTitle={work.title ?? ''}
            workAuthor={work.author ?? ''}
            workDynasty={work.dynasty ?? ''}
          />
        </div>

        {/* collections, annotation, intro, quotes, translation, master_comment */}
        <div className="flex flex-col gap-4">
          {/* quotes */}
          {quotes.length > 0 ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="佳句" description="" />
              <ul>
                {quotes.map((quote) => (
                  <li
                    key={quote.id}
                    className="p-1 text-sm leading-relaxed text-muted-foreground"
                  >
                    {quote.quote}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="佳句" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
          {/* collections */}
          {collections.length ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="诗集" description="" />
              <div className="flex flex-wrap gap-y-1 gap-x-2">
                {collections.map((collection) => (
                  <a
                    key={collection.id}
                    href={`/works?c=${collection.collection_id}`}
                    className="animated-underline p-1 text-sm font-medium leading-relaxed text-muted-foreground hover:text-primary"
                  >
                    # {collection.collection}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="诗集" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
          {/* intro */}
          {work.intro ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="简介" description="" />
              <div className="flex justify-start">
                <pre className="whitespace-pre-wrap font-wen-kai text-sm font-medium leading-relaxed text-muted-foreground">
                  {work.intro}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="简介" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
          {/* annotation */}
          {work.annotation ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="注解" description="" />
              <div className="flex justify-start">
                <pre className="whitespace-pre-wrap font-wen-kai text-sm font-medium leading-relaxed text-muted-foreground">
                  {work.annotation}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="注解" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
          {/* translation */}
          {work.translation != null && work.translation ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="翻译" description="" />
              <div className="flex justify-start">
                <pre className="whitespace-pre-wrap font-wen-kai text-sm font-medium leading-relaxed text-muted-foreground">
                  {work.translation}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="翻译" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
          {/* master_comment */}
          {work.master_comment != null && work.master_comment ? (
            <div className="flex flex-col gap-4">
              <SubTitle title="评价" description="" />
              <div className="flex justify-start">
                <pre className="whitespace-pre-wrap font-wen-kai text-sm font-medium leading-relaxed text-muted-foreground">
                  {work.master_comment}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SubTitle title="评价" description="" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无内容
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
