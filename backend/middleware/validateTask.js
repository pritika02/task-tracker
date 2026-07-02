const VALID_STATUSES = ["todo", "in-progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];
const validateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = {};
  const isCreate = req.method === "POST";

  // Title: required on create, must be a non-empty string within length bounds
  if (isCreate || title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.title = "Title is required";
    } else if (title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    } else if (title.trim().length > 100) {
      errors.title = "Title cannot exceed 100 characters";
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      errors.description = "Description must be text";
    } else if (description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(", ")}`;
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`;
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = "Due date must be a valid date";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = validateTask;
