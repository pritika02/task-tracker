const express = require("express");
const router = express.Router();
const validateTask = require("../middleware/validateTask");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/").get(getTasks).post(validateTask, createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

module.exports = router;
