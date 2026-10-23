const { Task } = require('../models/schemas');

class DependencyEngine {
  /**
   * Detects circular dependencies using DFS
   * Returns true if a cycle is detected
   */
  static async detectCycle(taskId, dependsOnId) {
    const visited = new Set();
    const stack = new Set();

    async function hasCycle(currentId) {
      visited.add(currentId.toString());
      stack.add(currentId.toString());

      const task = await Task.findById(currentId);
      if (task && task.dependencies) {
        for (const depId of task.dependencies) {
          const depStr = depId.toString();
          if (!visited.has(depStr)) {
            if (await hasCycle(depId)) return true;
          } else if (stack.has(depStr)) {
            return true;
          }
        }
      }

      stack.delete(currentId.toString());
      return false;
    }

    // Temporarily simulate the dependency to see if it creates a cycle
    // We check if taskId is reachable from dependsOnId
    const targetIdStr = taskId.toString();
    
    async function search(currentId) {
      if (currentId.toString() === targetIdStr) return true;
      
      const task = await Task.findById(currentId);
      if (!task || !task.dependencies) return false;
      
      for (const depId of task.dependencies) {
        if (await search(depId)) return true;
      }
      return false;
    }

    return await search(dependsOnId);
  }
}

module.exports = DependencyEngine;
