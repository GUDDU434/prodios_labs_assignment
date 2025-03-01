const Task = require("../models/task.model");

// Create a new task
exports.CreateTask = async (req, res) => {
  try {
    if (!req.body.assignedTo) req.body.assignedTo = req.user.userId;
    const task = await Task.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tasks
exports.GetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.userId,
      createdBy: req.user.userId,
    })
      .populate("assignedTo", "name email _id")
      .populate("createdBy", "name email _id");

    // filter tasks by status
    

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
exports.GetTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo createdBy"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task by ID
exports.UpdateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task by ID
exports.DeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
