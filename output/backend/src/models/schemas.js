const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Editor', 'Viewer'], 
    default: 'Viewer' 
  },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  status: { 
    type: String, 
    enum: ['To-Do', 'In Progress', 'Review', 'Done'], 
    index: true,
    default: 'To-Do'
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, index: true },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  version: { type: Number, default: 0 },
}, { timestamps: true });

// Compound index for Kanban performance
TaskSchema.index({ projectId: 1, status: 1 });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Task: mongoose.model('Task', TaskSchema)
};
