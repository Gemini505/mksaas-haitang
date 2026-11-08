import type { GroupList } from '@/types/biz';
import { GroupListClient } from './group-list-client';

interface GroupListProps {
  urlPrefix: string;
  groupList: GroupList;
}

export async function GroupListComponent({
  urlPrefix,
  groupList,
}: GroupListProps) {
  return <GroupListClient urlPrefix={urlPrefix} groupList={groupList} />;
}
