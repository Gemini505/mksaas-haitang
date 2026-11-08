import FavoriteWorkCard from '@/components/custom/favorites/work-card';
import CustomQueryPagination from '@/components/custom/pagination';
import WorkCard from '@/components/custom/works/work-card';
import EmptyGrid from '@/components/shared/empty-grid';
import { websiteConfig } from '@/config/website';
import { getDb } from '@/db';
import { table_users_like_works, table_works } from '@/db/schema';
import { getSession } from '@/lib/server';
import type { NextPageProps } from '@/types/next-page-props';
import { desc, eq, sql } from 'drizzle-orm';

/**
 * Favorites page
 */
export default async function FavoritesPage(props: NextPageProps) {
  const { searchParams } = await props;
  const { page } = await searchParams;
  console.log(`FavoritesPage, page: ${page}`);

  const session = await getSession();
  const currentUser = session?.user;
  if (!currentUser) {
    return null;
  }

  const pageSize = websiteConfig.extend.favoritePageSize;
  const currentPage = Number(page) || 1;

  const db = await getDb();
  const [joinedWorks, [{ count }]] = await Promise.all([
    db
      .select({ work: table_works })
      .from(table_users_like_works)
      .innerJoin(
        table_works,
        eq(table_users_like_works.works_id, table_works.id)
      )
      .where(eq(table_users_like_works.user_id, currentUser.id))
      .orderBy(desc(table_users_like_works.created_at))
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize),
    db
      .select({ count: sql`count(*)` })
      .from(table_users_like_works)
      .where(eq(table_users_like_works.user_id, currentUser.id)),
  ]);
  const items = joinedWorks.map((row) => row.work);
  const total = Number(count);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full flex-col px-4 lg:px-6">
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          {items && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((item) => (
                <FavoriteWorkCard key={item.id} work={item} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <CustomQueryPagination
              routePreix="/favorites"
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </div>
  );
}
