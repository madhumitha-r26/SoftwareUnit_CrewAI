const express = require('express');
const router = express.Router();
const { Task } = require('../models/schemas');
const { authenticate, authorize } = require('../middleware/auth');
const DependencyEngine = require('../services/dependencyEngine');

const STATE_TRANSITIONS = {
  'To-Do': ['In Progress'],
  'In Progress': ['Review'],
  'Review': ['Done'],
  'Done': []
};

router.post('/', authenticate, authorize('Admin', 'Editor'), async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', authenticate, authorize('Admin', 'Editor'), async (req, res) => {
  try {
    const { status, version, ...updates } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Optimistic Locking Check
    if (version !== undefined && version !== task.version) {
      return res.status(409).json({ error: 'Conflict: Task was modified by another user' });
    }

    // State Machine Validation
    if (status && status !== task.status) {
      const allowed = STATE_TRANSITIONS[task.status] || [];
      if (!allowed.includes(status)) {
        return res.status(422).json({ 
          error: `Illegal transition from ${task.status} to ${status}` 
        });
      }

      // Check if dependencies are 'Done' before moving to In Progress
      if (status === 'In Progress') {
        const unfinishedDeps = await Task.find({
          _id: { $in: task.dependencies },
          status: { $ne: 'Done' }
        });
        if (unfinishedDeps.length > 0) {
          return res.status(422).json({ 
            error: 'Cannot start task: Blocking dependencies are not completed' 
          });
        }
      }
    }

    Object.assign(task, updates);
    if (status) task.status = status;
    task.version += 1;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/dep', authenticate, authorize('Admin', 'Editor'), async (req, res) => {
  try {
    const { dependsOnId } = req.body;
    const taskId = req.params.id;

    if (taskId === dependsOnId) {
      return res.status(400).json({ error: 'Task cannot depend on itself' });
    }

    const hasCycle = await DependencyEngine.detectCycle(taskId, dependsOnId);
    if (hasCycle) {
      return res.status(409).json({ error: 'Circular dependency detected' });
    }

    const task = await Task.findByIdAndUpdate(
      taskId, 
      { $addToSet: { dependencies: dependsOnId } }, 
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const formatted = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
