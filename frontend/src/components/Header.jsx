import "./Header.css";

const Header = ({ stats }) => {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true">
          ▣
        </span>
        <h1>Task Tracker</h1>
      </div>

      <div className="app-header__stats" aria-label="Task statistics">
        <span className="app-header__stat">
          <strong>{stats.total}</strong> total
        </span>
        <span className="app-header__stat app-header__stat--progress">
          <strong>{stats.inProgress}</strong> active
        </span>
        <span className="app-header__stat app-header__stat--done">
          <strong>{stats.done}</strong> done
        </span>
        {stats.overdue > 0 && (
          <span className="app-header__stat app-header__stat--overdue">
            <strong>{stats.overdue}</strong> overdue
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
