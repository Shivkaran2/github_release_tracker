import type { FilterStatus, SortOption } from '../types/filter';

type RepositoryControlsProps = {
  filterStatus: FilterStatus;
  sortBy: SortOption;
  refreshing: boolean;
  onFilterChange: (filter: FilterStatus) => void;
  onSortChange: (sort: SortOption) => void;
  onRefresh: () => void;
};

export function RepositoryControls({
  filterStatus,
  sortBy,
  refreshing,
  onFilterChange,
  onSortChange,
  onRefresh,
}: RepositoryControlsProps) {
  return (
    <div className="repository-column-header">
      <h2 className="repository-list-header">Your Repositories</h2>
      <div className="repository-header-actions">
        <div className="filter-sort-controls">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="unseen">Unseen Updates</option>
            <option value="seen">All Seen</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="refresh-button-inline"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}

