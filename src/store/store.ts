/* ------------------------ Store.ts ------------------------ */
import { writable, type Writable } from 'svelte/store';
import type { Workspace, Task, Priority, Label, Reminder, Loc, Todo } from './types';

/**
 * ✅ Global function to add an item to a given Svelte store.
 *
 * This function provides a reusable way to add new items to any writable store.
 * It automatically generates a unique `id` for the item and optionally sets an `isDefault` flag if applicable.
 *
 * @template T - The type of items stored in the writable store. Must include an `id` field.
 *
 * @param {Writable<T[]>} store - The Svelte writable store to which the item will be added.
 * @param {Omit<T, 'id'>} baseData - The base data for the new item, excluding the `id` (auto-generated).
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.isDefault=false] - Whether the new item should be marked as default (if applicable).
 *
 * @example
 * // Add a new workspace
 * addToStore(workspaces, { title: 'New Workspace', description: 'Workspace description' }, { isDefault: false });
 *
 * @example
 * // Add a new task
 * addToStore(tasks, { title: 'New Task', description: 'Task details', workspaceId: 1 });
 */
export function addToStore<T extends { id: string | number }>(
  store: Writable<T[]>,
  baseData: Omit<T, 'id'>,
  options: { isDefault?: boolean } = {}
) {
  store.update(current => [
    ...current,
    {
      id: crypto.randomUUID(), // 🆔 Auto-generated unique ID
      ...baseData,
      ...(options.isDefault !== undefined ? { isDefault: options.isDefault } : {}),
    } as T
  ]);
}

/**
 * 🗑️ Global function to delete an item from a given Svelte store.
 *
 * @template T - The type of items in the store.
 * @param {Writable<T[]>} store - The writable store to modify.
 * @param {string | number} id - The ID of the item to delete.
 */
export function deleteFromStore<T extends { id: string | number }>(
    store: Writable<T[]>,
    id: string | number): void {
    store.update(items => items.filter(item => item.id !== id));
}

/**
 * 🔄 Global function to updates an item in a store by its ID.
 *
 * @template T - The type of items in the store.
 * @param {Writable<T[]>} store - The writable store to update.
 * @param {string | number} id - The ID of the item to update.
 * @param {Partial<T>} updatedFields - An object with the fields to update (e.g., { title: 'New Title' }).
 */
export function updateInStore<T extends { id: string | number }>(
    store: Writable<T[]>,
    id: string | number,
    updatedFields: { title?: string, description?: string }
): void {
  store.update(items =>
      items.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
  );
}

/**
 * ✅ Marks an item as complete for todos, tasks, and workspaces.
 * @param store - The store containing the items.
 * @param id - The ID of the item to mark as complete.
 */
export function markAsComplete<T extends { id: string; isComplete?: boolean }>(
    store: Writable<T[]>,
    id: string
) {
  store.update((items) =>
      items.map((item) =>
          item.id === id
              ? {
                ...item,
                isComplete: item.isComplete !== undefined ? true : item.isComplete,
              }
              : item
      )
  );
}

/* -------------------------- 📦 Store Definitions -------------------------- */

/**
 * 📝 **Todo Store**
 * Manages a list of todos with fields like `title`, `description`, `dueDate`, etc.
 *
 * @type {Writable<Todo[]>}
 */
export const todos: Writable<Todo[]> = writable<Todo[]>([]);

/**
 * 🗂️ **Workspace Store**
 * Holds user workspaces, with one default workspace (`My Tasks`).
 *
 * @type {Writable<Workspace[]>}
 */
export const defaultWorkspace: Workspace =
  { id: crypto.randomUUID(), title: 'my tasks', description: 'default workspace', isDefault: true };
export const workspaces: Writable<Workspace[]> = writable<Workspace[]>([defaultWorkspace]);

/**
 * ✅ **Task Store**
 * Contains tasks linked to specific workspaces.
 *
 * @type {Writable<Task[]>}
 */
export const defaultTask: Task =
  { id: crypto.randomUUID(), title: 'inbox', description: 'default task for all todos', isDefault: true, workspaceId: defaultWorkspace.id };
export const tasks: Writable<Task[]> = writable<Task[]>([defaultTask]);

/**
 * 🚦 **Priority Store**
 * Defines task priorities, with one set as default (Priority 4).
 *
 * @type {Writable<Priority[]>}
 */
export const defaultPriority: Priority = { id: 4, title: 'priority 4', description: 'low priority', isDefault: true };
export const priorities: Writable<Priority[]> = writable<Priority[]>([
  { id: 1, title: 'priority 1', description: 'very high priority' },
  { id: 2, title: 'priority 2', description: 'high priority' },
  { id: 3, title: 'priority 3', description: 'medium priority' },
  defaultPriority
]);

/**
 * 🏷️ **Label Store**
 * Handles labels to categorize tasks and todos.
 *
 * @type {Writable<Label[]>}
 */
export const labels: Writable<Label[]> = writable<Label[]>([]);

/**
 * ⏰ **Reminder Store**
 * Stores reminders with default options (e.g., `None`).
 *
 * @type {Writable<Reminder[]>}
 */
export const defaultReminder: Reminder = { id: crypto.randomUUID(), time: 'none', isDefault: true };
export const reminders: Writable<Reminder[]> = writable<Reminder[]>([defaultReminder]);

/**
 * 📍 **Location Store**
 * Manages locations associated with tasks and todos.
 *
 * @type {Writable<Loc[]>}
 */
export const locations: Writable<Loc[]> = writable<Loc[]>([]);

