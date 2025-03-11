/* ------------------------ Store.ts ------------------------ */
import {derived, writable, type Writable} from 'svelte/store';
import type {
    Workspace,
    WorkspaceStore,
    Block,
    BlockStore,
    Task,
    Section,
    Note,
    Todo,
    Priority,
    Label,
    Reminder,
    Loc,
} from './types';

export const addBlock = <T extends Block>(block: Omit<T, "id" | "createdAt" | "updatedAt" | "type"> & { type?: T["type"] }): void => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    blockStore.update(store => {
        store[id] = {
            id,
            createdAt: now,
            updatedAt: now,
            type: block.type as T["type"], // Ensure type is correctly inferred
            ...block
        };
        return store;
    });
};

export const updateBlock = (id: string, updates: Partial<Block>) => {
    blockStore.update(blocks => {
        if (!blocks[id]) return blocks;
        return {
            ...blocks,
            [id]: { ...blocks[id], ...updates, updatedAt: new Date().toISOString() },
        };
    });
};

export const deleteBlock = (id: string) => {
    blockStore.update(blocks => {
        const updatedBlocks = { ...blocks };
        delete updatedBlocks[id];
        return updatedBlocks;
    });
};

/* -------------------------- 📦 Store Definitions -------------------------- */

/**
 * 🏢 **Default Workspace**: "My Tasks"
 * - All tasks are added here unless moved to another workspace.
 */
export const defaultWorkspace: Workspace = {
    id: crypto.randomUUID(),
    title: "My Tasks",
    description: "Default workspace",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
/** 🌍 Store for all workspaces */
export const workspaceStore: Writable<WorkspaceStore> = writable({
    [defaultWorkspace.id]: defaultWorkspace,
});

/**
 * ✅ **Default Task**: "Inbox"
 * - All new todos, sections, and notes default to this task unless changed.
 */
export const defaultTask: Task = {
    id: crypto.randomUUID(),
    type: "task",
    parentId: defaultWorkspace.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: "Inbox",
    description: "Default task for all new items",
    isDefault: true,
    isComplete: false,
};
/** 🌍 Store for all blocks (tasks, sections, todos, notes) */
export const blockStore: Writable<BlockStore> = writable({
    [defaultTask.id]: defaultTask,
});


export const tasks = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "task") as Task[]
);


export const sections = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "section") as Section[]
);


export const notes = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "note") as Note[]
);


export const todos = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "todo") as Todo[]
);

/* -------------------------- 📦 Todos Metadata Definitions -------------------------- */


/**
 * 🚦 **Priority Store**
 * Defines task priorities, with one set as default (Priority 4).
 *
 * @type {Writable<Priority[]>}
 */
export const defaultPriority: Priority = { id: 4, title: 'none', description: 'low priority', isDefault: true };
export const priorities: Writable<Priority[]> = writable<Priority[]>([
  { id: 1, title: 'high', description: 'very high priority' },
  { id: 2, title: 'medium', description: 'high priority' },
  { id: 3, title: 'low', description: 'medium priority' },
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
export const reminders: Writable<Reminder[]> = writable<Reminder[]>([
    { id: crypto.randomUUID(), title:"on time", isDefault: true },
    { id: crypto.randomUUID(), title: '5 minutes ahead', isDefault: true },
    { id: crypto.randomUUID(), title: '30 minutes ahead', isDefault: true },
    { id: crypto.randomUUID(), title: '1 hour ahead', isDefault: true },
    { id: crypto.randomUUID(), title: '1 day ahead', isDefault: true }
]);

/**
 * 📍 **Location Store**
 * Manages locations associated with tasks and todos.
 *
 * @type {Writable<Loc[]>}
 */
export const locations: Writable<Loc[]> = writable<Loc[]>([]);

