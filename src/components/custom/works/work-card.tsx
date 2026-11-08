import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CollectionWork, Work } from '@/types/db';
import Link from 'next/link';

interface WorkCardProps {
  work: Work | CollectionWork;
}

export default function WorkCard({ work }: WorkCardProps) {
  const workId = 'work_id' in work ? work.work_id : work.id;
  const workTitle = 'work_title' in work ? work.work_title : work.title;
  const workAuthor = 'work_author' in work ? work.work_author : work.author;
  const workDynasty = 'work_dynasty' in work ? work.work_dynasty : work.dynasty;
  const workContent = 'work_content' in work ? work.work_content : work.content;

  return (
    <Link href={`/works/${workId}`}>
      <Card className="cursor-pointer bg-transparent h-full transition-all duration-300 ease-in-out hover:ring-primary hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10">
        <CardHeader className="flex flex-col gap-4">
          <h3 className="text-md font-semibold line-clamp-1">{workTitle}</h3>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {workAuthor} {workDynasty && `[${workDynasty}]`}
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-2 leading-relaxed">{workContent}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
