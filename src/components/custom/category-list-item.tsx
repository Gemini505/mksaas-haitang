import { Button } from '@/components/ui/button';

export interface CategoryListItemProps {
  title: string;
  active: boolean;
  clickAction?: () => void;
}

export default function CategoryListItem({
  title,
  active,
  clickAction,
}: CategoryListItemProps) {
  return (
    <div>
      <Button
        asChild
        variant={active ? 'default' : 'ghost'}
        size="sm"
        className="px-3 py-3 cursor-pointer"
        onClick={clickAction}
      >
        <li className="w-full">
          <div className="flex w-full items-center justify-between">
            <h2>{title}</h2>
            {/* <ArrowRightIcon className="w-4 h-4" /> */}
          </div>
        </li>
      </Button>
    </div>
  );
}
