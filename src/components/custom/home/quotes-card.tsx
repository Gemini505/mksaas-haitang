import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_quotes } from '@/db/schema';
import SubTitle from '../sub-title';
import QuoteCard from './quote-card';

export default async function QuotesCard() {
  const page = Math.floor(Math.random() * 100) + 1;
  const start = (page - 1) * websiteConfig.extend.homePageSize;

  const db = await getDb();
  const quotes = await db
    .select()
    .from(table_quotes)
    .offset(start)
    .limit(websiteConfig.extend.homePageSize);

  return (
    <div className="flex flex-col gap-4">
      <SubTitle title="精选诗句" description="" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  );
}
