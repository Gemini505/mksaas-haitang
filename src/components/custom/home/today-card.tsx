import { getDb } from '@/db';
import { table_collection_works, table_works } from '@/db/schema';
import todayJson from '@/scripts/today/today.json';
import { asc, eq } from 'drizzle-orm';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import SubTitle from '../sub-title';

export default async function TodayCard() {
  // get today's date as YYYY-MM-DD
  const today = new Date();
  // const today = new Date('2024-04-18');
  const dateString = today.toISOString().split('T')[0];

  // get work_id from dateConfig
  const work_id = todayJson[dateString as keyof typeof todayJson] || null;
  console.log('TodayCard, work id: ', work_id);

  if (work_id == null) {
    console.error('TodayCard, work id is null');
    return null;
  }

  const id = work_id.toString();

  // find work by id
  const db = await getDb();
  const works = await db
    .select()
    .from(table_works)
    .where(eq(table_works.id, Number.parseInt(id as string)))
    .limit(1);

  if (works.length === 0) {
    console.error(`TodayCard, work not found, id: ${id}`);
    return null;
  }

  const work = works[0];

  const collections = await db
    .select()
    .from(table_collection_works)
    .where(eq(table_collection_works.work_id, Number.parseInt(id as string)))
    .orderBy(asc(table_collection_works.show_order));

  return (
    <Card className="border-1 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <SubTitle title="每日一诗" description="" />
          <Button variant="default" size="sm" asChild>
            <Link href={`/works/${work.id}`}>
              阅读
              <ArrowUpRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* title, author, dynasty */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-semibold">{work.title}</h3>
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
      </CardContent>
      {collections.length ? (
        <CardContent>
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
        </CardContent>
      ) : null}
    </Card>
  );
}
