import "./TaskItem.css";

const STATUS_LABEL = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const STATUS_CYCLE = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

const formatDueDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const isOverdue = (value, status) => {
  if (!value || status === "done") return false;
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const TaskItem = ({ task, onEdit, onDelete, onCycleStatus }) => {
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <li className={`task-card task-card--${task.priority}`}>
      <button
        className={`task-card__status task-card__status--${task.status}`}
        onClick={() => onCycleStatus(task, STATUS_CYCLE[task.status])}
        title={`Mark as ${STATUS_LABEL[STATUS_CYCLE[task.status]]}`}
        aria-label={`Status: ${STATUS_LABEL[task.status]}. Click to advance.`}
      >
        {task.status === "done" ? "✓" : ""}
      </button>

      <div className="task-card__body">
        <div className="task-card__top">
          <h3 className={task.status === "done" ? "task-card__title--done" : ""}>
            {task.title}
          </h3>
          <div className="task-card__actions">
            <button
              className="icon-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              title="Edit task"
            >
              ✎
            </button>
            <button
              className="icon-btn icon-btn--danger"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              title="Delete task"
            >
              🗑
            </button>
          </div>
        </div>

        {task.description && <p className="task-card__description">{task.description}</p>}

        <div className="task-card__meta">
          <span className={`pill pill--priority-${task.priority}`}>{task.priority}</span>
          <span className={`pill pill--status-${task.status}`}>{STATUS_LABEL[task.status]}</span>
          {dueLabel && (
            <span className={`due-date ${overdue ? "due-date--overdue" : ""}`}>
              {overdue ? "overdue · " : "due "}
              {dueLabel}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
