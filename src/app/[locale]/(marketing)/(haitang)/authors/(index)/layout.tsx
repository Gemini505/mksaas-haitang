import { AuthorsSearchFilter } from '@/components/custom/authors/authors-search-filter';
import { CategoryListComponent } from '@/components/custom/category-list';
import Container from '@/components/layout/container';
import { DYNASTY_LIST } from '@/lib/constants';

interface AuthorsLayoutProps {
  children: React.ReactNode;
}

export default async function AuthorsLayout({ children }: AuthorsLayoutProps) {
  return (
    <Container className="mt-8 mb-16 flex flex-col gap-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* left sidebar: category list */}
        <div className="hidden md:block w-[200px] flex-shrink-0">
          <div className="sticky top-24">
            <CategoryListComponent
              urlPrefix="/authors"
              categoryList={DYNASTY_LIST}
            />
          </div>
        </div>

        {/* right content: item grid */}
        <div className="flex-1">
          <div className="flex flex-col gap-8">
            <div className="md:hidden">
              <AuthorsSearchFilter urlPrefix="/authors" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </Container>
  );
}
