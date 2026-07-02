import { useEffect, useState } from "react";
import "./TaskFormModal.css";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/**
 * Validates the form client-side using the same rules as the API,
 * so the user gets instant feedback before a network round trip.
 */
const validate = (form) => {
  const errors = {};
  const title = form.title.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters long";
  } else if (title.length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  }

  if (form.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  return errors;
};

const TaskFormModal = ({ task, onClose, onSubmit }) => {
  const isEditing = Boolean(task);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: toDateInputValue(task.dueDate),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
    } catch (error) {
      if (error?.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="task-form-title">{isEditing ? "Edit task" : "New task"}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="What needs to get done?"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              autoFocus
            />
            {errors.title && (
              <p className="field__error" id="title-error">
                {errors.title}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="description">
              Description <span className="field__optional">(optional)</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Add any useful details"
              rows={3}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            <div className="field__meta">
              {errors.description && (
                <p className="field__error" id="description-error">
                  {errors.description}
                </p>
              )}
              <span className="field__counter">{form.description.length}/500</span>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={handleChange("status")}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={form.priority} onChange={handleChange("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange("dueDate")}
              />
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Saving…" : isEditing ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
