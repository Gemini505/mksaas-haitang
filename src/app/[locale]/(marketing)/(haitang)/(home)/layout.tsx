import { RecommendationListComponent } from '@/components/custom/home/recommendation-list';
import Container from '@/components/layout/container';
import {
  AUTHOR_LIST,
  COLLECTION_LIST,
  DYNASTY_LIST,
  TYPE_LIST,
} from '@/lib/constants';
import type { RecommendationList } from '@/types/biz';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const collectionList: RecommendationList = COLLECTION_LIST.map((item) => ({
    name: item.name,
    url: `/works?c=${item.slug}`,
  }));

  const authorList: RecommendationList = AUTHOR_LIST.map((item) => ({
    name: item.name,
    url: `/authors/${item.slug}`,
  }));

  const dynastyList: RecommendationList = DYNASTY_LIST.map((item) => ({
    name: item.name,
    url: `/works?d=${item.slug}`,
  }));

  const typeList: RecommendationList = TYPE_LIST.map((item) => ({
    name: item.name,
    url: `/works?t=${item.slug}`,
  }));

  return (
    <Container className="mt-8 mb-16 flex flex-col gap-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* left content: today card */}
        <div className="flex-1">
          <div className="flex flex-col gap-8">{children}</div>
        </div>

        {/* right sidebar: category list */}
        <div className="md:w-[250px] md:sticky md:top-24 flex flex-col gap-8">
          <RecommendationListComponent
            title="热门选集"
            recommendationList={collectionList}
          />

          <RecommendationListComponent
            title="热门诗人"
            recommendationList={authorList}
          />

          <RecommendationListComponent
            title="诗文朝代"
            recommendationList={dynastyList}
          />

          <RecommendationListComponent
            title="诗文形式"
            recommendationList={typeList}
          />
        </div>
      </div>
    </Container>
  );
}
