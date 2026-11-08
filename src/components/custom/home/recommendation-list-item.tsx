export interface RecommendationListItemProps {
  title: string;
  url: string;
}

export default function RecommendationListItem({
  title,
  url,
}: RecommendationListItemProps) {
  return (
    <li className="p-1">
      <a
        href={url}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        <h3 className="animated-underline">{title}</h3>
      </a>
    </li>
  );
}
