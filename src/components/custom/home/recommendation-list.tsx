import type { RecommendationList } from '@/types/biz';
import SubTitle from '../sub-title';
import RecommendationListItem from './recommendation-list-item';

interface RecommendationListProps {
  title: string;
  recommendationList: RecommendationList;
}

export async function RecommendationListComponent({
  title,
  recommendationList,
}: RecommendationListProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-4">
      <SubTitle title={title} description="" />
      <ul className="flex flex-wrap gap-2 w-full">
        {recommendationList.map((item) => (
          <RecommendationListItem
            key={item.name}
            title={item.name}
            url={item.url}
          />
        ))}
      </ul>
    </div>
  );
}
