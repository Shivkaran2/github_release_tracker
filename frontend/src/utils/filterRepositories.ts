import type { Repository } from '../types/repository';
import type { SortOption, FilterStatus } from '../types/filter';

export function filterAndSortRepositories(
  repositories: Repository[],
  filterStatus: FilterStatus,
  sortBy: SortOption,
): Repository[] {
  let filtered = repositories;

  if (filterStatus === 'unseen') {
    filtered = repositories.filter((repo) => repo.hasUnseenRelease);
  } else if (filterStatus === 'seen') {
    filtered = repositories.filter((repo) => !repo.hasUnseenRelease);
  }

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.owner}/${a.name}`.localeCompare(`${b.owner}/${b.name}`);
      case 'date':
        const dateA = a.lastSyncedAt ? new Date(a.lastSyncedAt).getTime() : 0;
        const dateB = b.lastSyncedAt ? new Date(b.lastSyncedAt).getTime() : 0;
        return dateB - dateA;
      case 'status':
        if (a.hasUnseenRelease && !b.hasUnseenRelease) return -1;
        if (!a.hasUnseenRelease && b.hasUnseenRelease) return 1;
        return 0;
      default:
        return 0;
    }
  });

  return sorted;
}

