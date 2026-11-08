/**
 * sub title component
 */
export default function SubTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary w-1 h-4 inline-block rounded" />
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </div>
  );
}
