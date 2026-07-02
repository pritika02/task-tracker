import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import TaskList from "./components/TaskList";
import TaskFormModal from "./components/TaskFormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import ToastStack from "./components/ToastStack";
import { useToasts } from "./hooks/useToasts";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api/taskApi";
import "./App.css";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  order: "desc",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formTask, setFormTask] = useState(null); // null = closed, {} = new, {...} = edit
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const { toasts, push, dismiss } = useToasts();

  const loadTasks = useCallback(async (activeFilters) => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = {};
      if (activeFilters.status) params.status = activeFilters.status;
      if (activeFilters.priority) params.priority = activeFilters.priority;
      if (activeFilters.search) params.search = activeFilters.search;
      params.sortBy = activeFilters.sortBy;
      params.order = activeFilters.order;

      const data = await fetchTasks(params);
      setTasks(data);
    } catch (error) {
      setLoadError(error.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search/filter driven fetches so we don't hit the API on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadTasks(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, loadTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter((task) => task.status === "in-progress").length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(
      (task) =>
        task.status !== "done" && task.dueDate && new Date(task.dueDate) < today
    ).length;
    return { total, done, inProgress, overdue };
  }, [tasks]);

  const hasFilters = Boolean(filters.search || filters.status || filters.priority);

  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (formTask?._id) {
        const updated = await updateTask(formTask._id, payload);
        setTasks((current) =>
          current.map((task) => (task._id === updated._id ? updated : task))
        );
        push(`Updated “${updated.title}”`, "success");
      } else {
        const created = await createTask(payload);
        setTasks((current) => [created, ...current]);
        push(`Added “${created.title}”`, "success");
      }
      setFormTask(null);
    } catch (error) {
      push(error.message || "Could not save task", "error");
      throw error; // let the form show field-level errors and stay open
    }
  };

  const handleCycleStatus = async (task, nextStatus) => {
    // Optimistic update: reflect the change immediately, roll back on failure.
    setTasks((current) =>
      current.map((item) => (item._id === task._id ? { ...item, status: nextStatus } : item))
    );
    try {
      await updateTask(task._id, { status: nextStatus });
    } catch (error) {
      setTasks((current) =>
        current.map((item) => (item._id === task._id ? task : item))
      );
      push(error.message || "Could not update status", "error");
    }
  };

  const handleDeleteConfirmed = async () => {
    const task = taskToDelete;
    setTaskToDelete(null);
    setTasks((current) => current.filter((item) => item._id !== task._id));
    try {
      await deleteTask(task._id);
      push(`Deleted “${task.title}”`, "info");
    } catch (error) {
      setTasks((current) => [task, ...current]);
      push(error.message || "Could not delete task", "error");
    }
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        <Header stats={stats} />

        <Toolbar
          filters={filters}
          onChange={setFilters}
          onNewTask={() => setFormTask({})}
          onClearFilters={handleClearFilters}
          hasFilters={hasFilters}
        />

        {loadError ? (
          <div className="load-error">
            <p>{loadError}</p>
            <button className="btn btn--ghost" onClick={() => loadTasks(filters)}>
              Retry
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            loading={loading}
            hasFilters={hasFilters}
            onEdit={setFormTask}
            onDelete={setTaskToDelete}
            onCycleStatus={handleCycleStatus}
          />
        )}
      </div>

      {formTask !== null && (
        <TaskFormModal
          task={formTask._id ? formTask : null}
          onClose={() => setFormTask(null)}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${taskToDelete.title}” will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

export default App;
