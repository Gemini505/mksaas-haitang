import { Card, CardContent } from '@/components/ui/card';
import type { Quote } from '@/types/db';
import Link from 'next/link';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const workId = quote.work_id;
  const workContent = quote.quote;
  const workAuthor = quote.author;
  const workDynasty = quote.dynasty;
  const workTitle = quote.work_title;

  return (
    <Link href={`/works/${workId}`}>
      <Card className="cursor-pointer bg-transparent h-full transition-all duration-300 ease-in-out hover:ring-primary hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10">
        <CardContent className="flex flex-col gap-4">
          <p className="line-clamp-2 leading-relaxed">{workContent}</p>
          <div className="flex gap-1">
            <span className="text-sm text-muted-foreground line-clamp-1">
              {workAuthor}
            </span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              《{workTitle}》
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
