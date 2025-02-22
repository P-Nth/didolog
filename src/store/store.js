// store.js
import { writable } from 'svelte/store';

// Workspace store
export const workspaces = writable([
  {id: 0, title: 'my tasks', description: 'primary task workspace'},
]);

// Tasks store
export const tasks = writable([
  {id: 0, title: 'inbox', description: 'your primary todo inbox', workspaceId: 0},
]);

// Labels store
export const labels = writable([]);

// priorities store
export const priorities = writable([
  {id: 0, title: 'priority 1', code:"p1", description: 'very high priority'},
  {id: 1, title: 'priority 2', code:"p2", description: 'high priority'},
  {id: 2, title: 'priority 3', code:"p3", description: 'medium priority'},
  {id: 3, title: 'priority 4', code:"p4", description: 'low priority'},
]);

// Todos store
export const todos = writable([]);

/**
 * Add a task or a todo dynamically.
 * @param {string} title - The title of the task or todo.
 * @param {string} description - The description of the task or todo.
 * @param {string} type - Either "task" or "todo".
 * @param {number|null} taskId - Optional, links a todo to a task.
 * @param {number|null} workspaceId - Optional, links a task to a workspace.
 * @param {number|null} priorityId - Optional, links a todo with a priority.
 * @param {number|null} labelId - Optional, links a todo with a label.
 */
export function addItem(
  title,
  description = '',
  type,
  taskId = null,
  workspaceId = null,
  priorityId = null,
  labelId = null
) {
  if (!title.trim()) return;

  const newItem = {
    id: crypto.randomUUID(),
    completed: false,
    startTime: Date.now(),
    endTime: null
  };

  if (type === 'todo') todos.update(t => [...t, { ...newItem, title, description: description, taskId: taskId, priorityId: priorityId, labelId: labelId }]);
  else if (type === 'task') tasks.update(t => [...t, { ...newItem, title, description: description, workspaceId: workspaceId  }]);
  else  labels.update(t => [...t, { ...newItem, title }]);
}

/**
 * Mark a task or todo as completed.
 * @param {number} id - ID of the item.
 * @param {string} type - Either "task" or "todo".
 */
export function markComplete(id, type) {
  if (type === 'task') {
    tasks.update(t => t.map(task => task.id === id ? { ...task, completed: true, endTime: Date.now() } : task));
  } else if (type === 'todo') {
    todos.update(t => t.map(todo => todo.id === id ? { ...todo, completed: true, endTime: Date.now() } : todo));
  }
}

/**
 * Delete a task or a todo dynamically.
 * If a task is deleted, its linked todos remain but lose their link.
 * @param {number} id - ID of the task or todo to delete.
 * @param {string} type - Either "task" or "todo".
 */
export function deleteItem(id, type) {
  if (type === 'task') {
    tasks.update(t => t.filter(task => task.id !== id));

    // Unlink todos associated with the deleted task
    todos.update(t => t.map(todo => todo.taskId === id ? { ...todo, taskId: null } : todo));
  } else if (type === 'todo') {
    todos.update(t => t.filter(todo => todo.id !== id));
  }
}

/**
 * Update an item (both tasks and todos)
 * @param {number} id - The ID of the item (task or to-do)
 * @param {string} newTitle - The new title for the item
 * @param {string} newDescription - The new description for the item
 * @param {string} type - Either "task" or "to-do"
 */
export function updateItem(id, newTitle, newDescription, type) {
  if (type === 'task') {
    tasks.update(taskList =>
      taskList.map(task =>
        task.id === id ? { ...task, title: newTitle, description:newDescription } : task
      )
    );
  } else if (type === 'todo') {
    todos.update(todoList =>
      todoList.map(todo =>
        todo.id === id ? { ...todo, title: newTitle, description:newDescription } : todo
      )
    );
  }
}
