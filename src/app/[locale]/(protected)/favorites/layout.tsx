import { DashboardHeader } from '@/components/dashboard/dashboard-header';

interface FavoritesLayoutProps {
  children: React.ReactNode;
}

export default async function FavoritesLayout({
  children,
}: FavoritesLayoutProps) {
  const breadcrumbs = [
    {
      label: '收藏',
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
