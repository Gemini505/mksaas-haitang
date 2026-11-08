import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Author } from '@/types/db';
import Link from 'next/link';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link href={`/authors/${author.id}`}>
      <Card className="cursor-pointer bg-transparent h-full transition-all duration-300 ease-in-out hover:ring-primary hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10">
        <CardHeader>
          <h3 className="flex flex-col items-start gap-2">
            <span className="text-md font-semibold line-clamp-1">
              {author.name}
            </span>
            <span className="text-sm text-muted-foreground">
              [{author.dynasty}]
            </span>
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-2 leading-relaxed">{author.intro}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
