/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Backend for the To Do List Page.
*/

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const requireToken = require("../Middlewares/AuthTokenRequired");

// Route to add a new task
router.post("/tasks", requireToken, async (req, res) => {
  const { task, assignedTo } = req.body;
  if (!task) {
    return res.status(422).json({ error: "Task is required" });
  }
  try {
    const newTask = new Task({
      task,
      assignedTo,
      createdBy: req.user._id,
    });
    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to retrieve all tasks
router.get("/tasks", requireToken, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("createdBy");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for processing a task
router.put("/tasks/:id", requireToken, async (req, res) => {
  const { id } = req.params;
  const { task, assignedTo } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task, assignedTo },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a task
router.delete("/tasks/:id", requireToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
