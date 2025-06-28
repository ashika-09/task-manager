const Task = require("../models/task.js");
const User = require("../models/user.js");
const authMiddleware = require("../middlewares/auth.js");
const express = require("express");

const taskRouter = express.Router();

taskRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const task = new Task({
      title,
      description,
      dueDate: new Date(dueDate), // Now accepts ISO format
      completed,
      user: req.user._id,
    });

    const savedTask = await task.save();
    res.status(201).json({ message: "Task added", task: savedTask });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

taskRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, completed, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json("Task not found");
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) {
      const [day, month, year] = dueDate.split("/");
      task.dueDate = new Date(`${year}-${month}-${day}`);
    }
    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

taskRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

taskRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = taskRouter;
