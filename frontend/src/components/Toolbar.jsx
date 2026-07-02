import "./Toolbar.css";

const Toolbar = ({ filters, onChange, onNewTask, onClearFilters, hasFilters }) => {
  const handleField = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <span className="toolbar__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={handleField("search")}
          aria-label="Search tasks by title"
        />
      </div>

      <select
        value={filters.status}
        onChange={handleField("status")}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={handleField("priority")}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        <option value="high">High priority</option>
        <option value="medium">Medium priority</option>
        <option value="low">Low priority</option>
      </select>

      <select
        value={`${filters.sortBy}:${filters.order}`}
        onChange={(event) => {
          const [sortBy, order] = event.target.value.split(":");
          onChange({ ...filters, sortBy, order });
        }}
        aria-label="Sort tasks"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="dueDate:asc">Due date ↑</option>
        <option value="dueDate:desc">Due date ↓</option>
        <option value="title:asc">Title A–Z</option>
      </select>

      {hasFilters && (
        <button className="btn btn--ghost toolbar__clear" onClick={onClearFilters}>
          Clear
        </button>
      )}

      <button className="btn btn--primary toolbar__new" onClick={onNewTask}>
        + New task
      </button>
    </div>
  );
};

export default Toolbar;
