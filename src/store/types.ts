// src/types.ts
/** 🏢 Workspace Store: Holds all Workspaces */
export interface WorkspaceStore {
    [id: string]: Workspace;
}

export interface Workspace {
    id: string;
    title: string;
    description: string;
    isDefault?: boolean;
    isComplete?: boolean;
    colorId?: number;
    createdAt?: string;
    updatedAt?: string;
}

/** 🌍 Block Store: Holds all Blocks (Tasks, Sections, Notes, Todos) */
export interface BlockStore {
    [id: string]: Block;
}

type BlockType = "task" | "section" | "todo" | "note";

export interface Block {
    id: string;
    type: BlockType;
    parentId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Task extends Block {
    type: "task";
    title: string;
    description: string;
    isDefault?: boolean;
    isComplete?: boolean;
}

export interface Section extends Block {
    type: "section";
    title: string;
    parentId: string;
}

export interface Note extends Block {
    type: "note";
    title: string;
    parentId: string;
}

export interface Todo extends Block {
    type: "todo";
    title: string;
    description: string;
    parentId: string;
    dueDate: [string, string] | null;
    priorityId: number;
    labelIds: string[] | null;
    reminderIds: string[] | null;
    locationId: string | null;
    isComplete?: boolean;
}

export interface Priority {
    id: number;
    title: string;
    description: string;
    isDefault?: boolean;
}

export interface Label {
    id: string;
    title: string;
    description: string;
}

export interface Reminder {
    id: string;
    title: string;
    isDefault?: boolean;
}

export interface Loc {
    id: string;
    title: string;
    description: string;
}

