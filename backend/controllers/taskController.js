const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy, order, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const sortField = ["title", "createdAt", "dueDate", "priority"].includes(sortBy)
      ? sortBy
      : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      status,
      priority,
      dueDate: dueDate || null,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: task, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
