import TaskItem from "./TaskItem";
import "./TaskList.css";

const TaskList = ({ tasks, loading, hasFilters, onEdit, onDelete, onCycleStatus }) => {
  if (loading) {
    return (
      <div className="state-panel">
        <span className="state-panel__spinner" aria-hidden="true" />
        <p>Loading tasks…</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-panel">
        <p className="state-panel__mono">$ tasks --list</p>
        <p className="state-panel__title">
          {hasFilters ? "No tasks match these filters" : "No tasks yet"}
        </p>
        <p className="state-panel__hint">
          {hasFilters
            ? "Try clearing a filter or search term."
            : "Click “+ New task” to add your first one."}
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onCycleStatus={onCycleStatus}
        />
      ))}
    </ul>
  );
};

export default TaskList;
