import { GroupListComponent } from '@/components/custom/group-list';
import { QuotesSearchFilter } from '@/components/custom/quotes/quotes-search-filter';
import Container from '@/components/layout/container';
import { GROUP_LIST } from '@/lib/constants';

interface QuotesLayoutProps {
  children: React.ReactNode;
}

export default async function QuotesLayout({ children }: QuotesLayoutProps) {
  // fetch all collection kinds and collections, covert to group list
  // const [collectionKinds, collections] = await Promise.all([
  //   db
  //     .select()
  //     .from(table_collection_kinds)
  //     .orderBy(asc(table_collection_kinds.show_order)),
  //   db
  //     .select()
  //     .from(table_collections)
  //     .orderBy(asc(table_collections.show_order)),
  // ]);
  // const groupList = collectionKinds.map((kind) => {
  //   return {
  //     slug: kind.name,
  //     name: kind.name,
  //     categories: collections
  //       .filter((collection) => collection.kind_id === kind.id)
  //       .map((collection) => ({
  //         slug: collection.id.toString(),
  //         name: collection.name,
  //       })),
  //   };
  // });
  // console.log(JSON.stringify(groupList, null, 2));
  // use constant group list in order to avoid fetching data from database
  const groupList = GROUP_LIST;

  return (
    <Container className="mt-8 mb-16 flex flex-col gap-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* left sidebar: category list */}
        <div className="hidden md:block w-[250px] flex-shrink-0">
          <div className="sticky top-24">
            <GroupListComponent urlPrefix="/quotes" groupList={groupList} />
          </div>
        </div>

        {/* right content: item grid */}
        <div className="flex-1">
          <div className="flex flex-col gap-8">
            <QuotesSearchFilter urlPrefix="/quotes" />
            {children}
          </div>
        </div>
      </div>
    </Container>
  );
}
