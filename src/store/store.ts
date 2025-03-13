/* ------------------------ Store.ts ------------------------ */
import {derived, get, writable, type Writable} from 'svelte/store';
import type {
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
    Loc, Workspace,
} from './types';

/* -------------------------- 📦 Workspace Store Actions -------------------------- */
export const addWorkspace = (newWorkspace: Workspace) => {
    workspaceStore.update(workspaces => ({
        ...workspaces,
        [newWorkspace.id]: newWorkspace
    }));
};

export const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    workspaceStore.update(workspaces => {
        if (!workspaces[id]) return workspaces;
        return {
            ...workspaces,
            [id]: { ...workspaces[id], ...updates, updatedAt: new Date().toISOString() }
        };
    });
};

export const deleteWorkspace = (id: string) => {
    workspaceStore.update(workspaces => {
        const updatedWorkspaces = { ...workspaces };
        delete updatedWorkspaces[id];
        return updatedWorkspaces;
    });
};

/* -------------------------- 📦 Workspace Store Definitions -------------------------- */
/** 🌍 Store for all workspaces */
export const workspaceStore: Writable<WorkspaceStore> = writable({
    ["default-workspace"]: {
        id: "default-workspace",
        title: "My Tasks",
        description: "Default workspace",
        isSelected: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
});
/** 🔄 **Derived variable for selected workspace** */
export const selectedWorkspace = derived(workspaceStore, workspaces =>
    Object.values(workspaces).find(ws => ws.isSelected)!
);

/* -------------------------- 📦 Block Store Actions -------------------------- */
export const addBlock = <T extends Block>(block: Omit<T, "id" | "createdAt" | "updatedAt">): void => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    blockStore.update(store => ({
        ...store,
        [id]: {
            id,
            createdAt: now,
            updatedAt: now,
            ...block
        }
    }));
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

/* -------------------------- 📦 Block Store Definitions -------------------------- */
/** 🌍 Store for all blocks (tasks, sections, todos, notes) */
export const blockStore: Writable<BlockStore> = writable({
    ["default-task"]: {
        id: "default-task",
        type: "task",
        parentId: "default-workspace",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: "Inbox",
        description: "Default task for all new items",
        isSelected: true,
        isComplete: false,
    },
});
export const blocksByParent = (parentId: string) => {derived(blockStore, ($blockStore) =>
        Object.values($blockStore)
            .filter(block => block.parentId === parentId)
            .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
    );
}

/** 🌍 Store for all tasks */
export const tasks = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "task") as Task[]
);
/** 🔄 Derived store to get the selected task */
export const selectedTask = derived(tasks, ($tasks) =>
    $tasks.find(task => task.isSelected)!
);

/** 🌍 Store for all sections */
export const sections = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "section") as Section[]
);

/** 🌍 Store for all notes */
export const notes = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "note") as Note[]
);

/** 🌍 Store for all todos */
export const todos = derived(blockStore, ($blockStore) =>
    Object.values($blockStore).filter((block) => block.type === "todo") as Todo[]
);

/* -------------------------- 📦 Todos Metadata Definitions -------------------------- */
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
 * // Add a new label
 * addToStore(labels, { title: 'New Task', description: 'Task details', workspaceId: 1 });
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
    updatedFields: Partial<T>
): void {
    store.update(items =>
        items.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
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
 * 🚦 **Priority Store**
 * Defines task priorities, with one set as default (Priority 4).
 *
 * @type {Writable<Priority[]>}
 */
export const priorities: Writable<Priority[]> = writable<Priority[]>([
    { id: 1, title: 'high', description: 'very high priority' },
    { id: 2, title: 'medium', description: 'high priority' },
    { id: 3, title: 'low', description: 'medium priority' },
    {id: 4, title: 'none', description: 'low priority', isDefault: true }
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

